import {
  ButtonInteraction,
  ChatInputCommandInteraction,
  EmbedBuilder,
  MessageFlags,
  ModalSubmitInteraction,
} from "discord.js";
import { profitService } from "../profit.service.js";
import {
  cookSessionStore,
  CookSession,
  MAX_DRAFT_LENGTH,
  MAX_RETAINED_DRAFT_LENGTH,
} from "../session/cook-session.js";
import {
  buildWorksheetModel,
  computeSessionResult,
  CookBlocker,
} from "../session/cook-session-state.js";
import {
  buildRateModal,
  buildSellModal,
  buildWorksheet,
  decodeCookComponentId,
} from "../ui/cook-worksheet.js";
import { buildResultEmbeds, ResultView } from "../ui/cook-results.js";
import { parseRate } from "../domain/rate.js";
import {
  hasQuantityRange,
  validateBatchQuantity,
} from "../domain/quantity.js";
import { CookingRecipe, ParsedRate } from "../domain/types.js";

const INVALID_RATE_HINT =
  "Invalid rate format. Use formats like 200/150, 2/1dl, 3wl, or free.";
const OVERLENGTH_RATE_HINT = `Rate is too long (maximum ${MAX_DRAFT_LENGTH} characters).`;
const STALE_MESSAGE =
  "That action is out of date because the worksheet was updated. Use the buttons on the latest worksheet.";

export function isCookButtonCustomId(customId: string): boolean {
  return customId.startsWith("cook:");
}

export function isCookModalCustomId(customId: string): boolean {
  return customId.startsWith("cook-modal:");
}

interface RateDraftParse {
  parsed: ParsedRate | null;
  error: string | null;
  retained: string;
}

function parseRateDraft(raw: string): RateDraftParse {
  const trimmed = raw.replace(/[\u0000-\u001f\u007f]/g, " ").trim();
  if (trimmed.length > MAX_DRAFT_LENGTH) {
    return {
      parsed: null,
      error: OVERLENGTH_RATE_HINT,
      retained: trimmed.slice(0, MAX_RETAINED_DRAFT_LENGTH),
    };
  }
  try {
    return { parsed: parseRate(trimmed), error: null, retained: trimmed };
  } catch {
    return { parsed: null, error: INVALID_RATE_HINT, retained: trimmed };
  }
}

function blockerLines(blockers: readonly CookBlocker[]): string[] {
  const lines: string[] = [];
  for (const blocker of blockers) {
    switch (blocker.kind) {
      case "invalid_rates":
        lines.push(
          `Fix or clear the invalid rates for: ${blocker.names.join(", ")}.`
        );
        break;
      case "missing_rates":
        lines.push(
          `No saved price for: ${blocker.names.join(", ")}. Enter a temporary rate or set one with /prices set.`
        );
        break;
      case "missing_range_choice":
        lines.push(
          `Choose a quantity below for: ${blocker.names.join(", ")}.`
        );
        break;
      case "invalid_sell":
        lines.push("Fix or clear the invalid selling rate draft.");
        break;
      case "overflow":
        lines.push(
          "The result is too large to display. Reduce the batch quantity or use smaller rates."
        );
        break;
    }
  }
  return lines;
}

function expiredPayload() {
  return {
    content:
      "This cooking session has expired or no longer exists. Run /cook to start a new one.",
    embeds: [],
    components: [],
  };
}

async function replyGenericError(
  interaction: ButtonInteraction | ModalSubmitInteraction | ChatInputCommandInteraction,
  error: unknown
): Promise<void> {
  console.error("Cook interaction error:", error);
  try {
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content:
          "Something went wrong while handling the cooking action. Please try again.",
        flags: MessageFlags.Ephemeral,
      });
    } else {
      await interaction.reply({
        content:
          "Something went wrong while handling the cooking action. Please try again.",
        flags: MessageFlags.Ephemeral,
      });
    }
  } catch {
  }
}

interface ResolvedSession {
  session: CookSession;
  decoded: NonNullable<ReturnType<typeof decodeCookComponentId>>;
}

const EXPIRED_REPLY =
  "This cooking session has expired or no longer exists. Run /cook to start a new one.";

async function dismissExpired(
  interaction: ButtonInteraction | ModalSubmitInteraction
): Promise<void> {
  if (interaction.isButton() || interaction.isFromMessage()) {
    await interaction.update(expiredPayload());
    return;
  }
  await interaction
    .reply({ content: EXPIRED_REPLY, flags: MessageFlags.Ephemeral })
    .catch(() => undefined);
}

async function replyStale(
  interaction: ButtonInteraction | ModalSubmitInteraction
): Promise<void> {
  await interaction
    .reply({ content: STALE_MESSAGE, flags: MessageFlags.Ephemeral })
    .catch(() => undefined);
}

async function resolveSession(
  interaction: ButtonInteraction | ModalSubmitInteraction,
  decoded: NonNullable<ReturnType<typeof decodeCookComponentId>>
): Promise<ResolvedSession | null> {
  const session = cookSessionStore.get(decoded.sessionId);
  if (!session) {
    await dismissExpired(interaction);
    return null;
  }

  const boundToMessage =
    interaction.message && interaction.message.id === session.messageId;
  if (
    session.userId !== interaction.user.id ||
    session.guildId !== interaction.guildId ||
    session.channelId !== interaction.channelId ||
    !boundToMessage
  ) {
    await interaction
      .reply({
        content:
          "This cooking worksheet does not belong to you. Run /cook to start your own.",
        flags: MessageFlags.Ephemeral,
      })
      .catch(() => undefined);
    return null;
  }

  if (decoded.revision !== session.revision) {
    await replyStale(interaction);
    return null;
  }

  return { session, decoded };
}

async function publishTransition(
  interaction: ButtonInteraction | ModalSubmitInteraction,
  sessionId: string,
  expectedRevision: number,
  mutateFn: (session: CookSession) => void,
  renderPayload: (session: CookSession) => Record<string, unknown>
): Promise<void> {
  const result = cookSessionStore.mutateIf(sessionId, expectedRevision, mutateFn);
  if (!result.ok) {
    if (result.reason === "missing") {
      await dismissExpired(interaction);
    } else {
      await replyStale(interaction);
    }
    return;
  }

  try {
    if (interaction.isButton() || interaction.isFromMessage()) {
      await interaction.update(renderPayload(result.session));
    } else {
      result.rollback();
      return;
    }
  } catch (error) {
    result.rollback();
    throw error;
  }
}

export async function executeCookCommand(
  interaction: ChatInputCommandInteraction
): Promise<void> {
  try {
    if (!interaction.guildId) {
      await interaction.reply({
        content: "This command can only be used in a server.",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    const dishName = interaction.options.getString("dish", true);
    const sellRateStr = interaction.options.getString("sell") ?? undefined;
    const quantity = interaction.options.getInteger("qty") ?? 1;
    const includeSpices = interaction.options.getBoolean("include-spices") ?? false;

    if (!Number.isInteger(quantity)) {
      await interaction.reply({
        content: "Quantity must be a whole number between 1 and 100000.",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }
    try {
      validateBatchQuantity(quantity);
    } catch {
      await interaction.reply({
        content: "Quantity must be a whole number between 1 and 100000.",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    let initialSell = null;
    if (sellRateStr) {
      try {
        initialSell = parseRate(sellRateStr);
      } catch {
        await interaction.reply({
          content:
            "Invalid selling rate. Use formats like 1/3, 2/1dl, or 3wl, or run /cook without a selling rate.",
          flags: MessageFlags.Ephemeral,
        });
        return;
      }
    }

    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    const recipe: CookingRecipe | null = profitService.getRecipe(dishName);
    if (!recipe) {
      await interaction.editReply({
        content:
          'Recipe was not found. Use autocomplete or check "/recipe list".',
      });
      return;
    }

    const savedPrices = await profitService.collectPrices(
      interaction.guildId,
      recipe
    );

    const session = cookSessionStore.create({
      guildId: interaction.guildId,
      channelId: interaction.channelId,
      userId: interaction.user.id,
      recipe,
      batchQuantity: quantity,
      includeSpices,
      savedPrices,
    });

    if (initialSell) {
      session.sellRate = initialSell;
      session.sellFromSlash = true;
    }

    const view = buildWorksheet(session, buildWorksheetModel(session));
    const message = await interaction.editReply({
      embeds: view.embeds,
      components: view.components,
    });
    session.messageId = message.id;
  } catch (error) {
    console.error("Cook command error:", error);
    const payload = {
      content: "Something went wrong while starting the cooking worksheet. Please try again.",
    };
    try {
      if (interaction.deferred) {
        await interaction.editReply(payload);
      } else if (!interaction.replied) {
        await interaction.reply({ ...payload, flags: MessageFlags.Ephemeral });
      }
    } catch {
    }
  }
}

export async function handleCookButton(
  interaction: ButtonInteraction
): Promise<void> {
  try {
    const decoded = decodeCookComponentId(interaction.customId);
    if (!decoded) {
      await interaction
        .reply({
          content: "Unknown cooking action.",
          flags: MessageFlags.Ephemeral,
        })
        .catch(() => undefined);
      return;
    }

    await cookSessionStore.withSessionLock(decoded.sessionId, async () => {
      const resolved = await resolveSession(interaction, decoded);
      if (!resolved) {
        return;
      }
      const { session, decoded: action } = resolved;

      switch (action.kind) {
        case "edit": {
          await interaction.showModal(buildRateModal(session, action.page));
          return;
        }
        case "sell": {
          await interaction.showModal(buildSellModal(session));
          return;
        }
        case "choice": {
          const ingredient = session.recipe.ingredients.find(
            (i) => i.id.toLowerCase() === action.ingredientId.toLowerCase()
          );
          if (!ingredient || !hasQuantityRange(ingredient)) {
            await interaction
              .reply({
                content: "Unknown cooking action.",
                flags: MessageFlags.Ephemeral,
              })
              .catch(() => undefined);
            return;
          }
          const range = ingredient.quantityRange!;
          if (
            !Number.isInteger(action.value) ||
            action.value < range.min ||
            action.value > range.max
          ) {
            await interaction
              .reply({
                content: `Choose a whole number between ${range.min} and ${range.max}.`,
                flags: MessageFlags.Ephemeral,
              })
              .catch(() => undefined);
            return;
          }
          await publishTransition(
            interaction,
            session.id,
            action.revision,
            (s) => {
              s.rangeChoices.set(ingredient.id.toLowerCase(), action.value);
            },
            (s) => buildWorksheet(s, buildWorksheetModel(s))
          );
          return;
        }
        case "calc":
        case "details":
        case "summary": {
          const outcome = computeSessionResult(session);
          if (!outcome.ok) {
            const view = buildWorksheet(session, buildWorksheetModel(session));
            const embed = view.embeds[0];
            embed.addFields({
              name: "Cannot calculate yet",
              value: blockerLines(outcome.blockers).join("\n"),
            });
            await interaction.update({ embeds: [embed], components: view.components });
            return;
          }
          const resultView: ResultView =
            action.kind === "calc" ? "summary" : action.kind;
          const resultEmbeds = buildResultEmbeds({
            session,
            result: outcome.result,
            view: resultView,
          });
          const view = buildWorksheet(session, buildWorksheetModel(session), {
            resultView,
          });
          await interaction.update({
            embeds: resultEmbeds,
            components: view.components,
          });
          return;
        }
        case "cancel": {
          cookSessionStore.delete(session.id);
          await interaction.update({
            embeds: [
              new EmbedBuilder()
                .setTitle("Cooking session cancelled")
                .setColor(0x95a5a6)
                .setDescription("Run /cook to start a new worksheet."),
            ],
            components: [],
          });
          return;
        }
      }
    });
  } catch (error) {
    await replyGenericError(interaction, error);
  }
}

export async function handleCookModalSubmit(
  interaction: ModalSubmitInteraction
): Promise<void> {
  try {
    const decoded = decodeCookComponentId(interaction.customId);
    if (!decoded || (decoded.kind !== "modal-rate" && decoded.kind !== "modal-sell")) {
      await interaction
        .reply({
          content: "Unknown cooking action.",
          flags: MessageFlags.Ephemeral,
        })
        .catch(() => undefined);
      return;
    }

    await cookSessionStore.withSessionLock(decoded.sessionId, async () => {
      if (!interaction.isFromMessage()) {
        await interaction
          .reply({
            content: "Unknown cooking action.",
            flags: MessageFlags.Ephemeral,
          })
          .catch(() => undefined);
        return;
      }
      const resolved = await resolveSession(interaction, decoded);
      if (!resolved) {
        return;
      }
      const { session, decoded: action } = resolved;

      if (action.kind === "modal-rate") {
        const pageIngredients =
          buildWorksheetModel(session).pages[action.page] ?? [];
        await publishTransition(
          interaction,
          session.id,
          action.revision,
          (s) => {
            for (const ingredient of pageIngredients) {
              const customId = `rate_${ingredient.id}`;
              let raw: string | null = null;
              try {
                raw = interaction.fields.getTextInputValue(customId);
              } catch {
                raw = null;
              }
              const key = ingredient.id.toLowerCase();
              if (raw === null || raw.trim() === "") {
                s.rateDrafts.delete(key);
                continue;
              }
              const parsed = parseRateDraft(raw);
              s.rateDrafts.set(key, {
                raw: parsed.retained,
                parsed: parsed.parsed,
                error: parsed.error,
              });
            }
          },
          (s) => buildWorksheet(s, buildWorksheetModel(s))
        );
        return;
      }

      let raw: string | null = null;
      try {
        raw = interaction.fields.getTextInputValue("sell_rate");
      } catch {
        raw = null;
      }

      await publishTransition(
        interaction,
        session.id,
        action.revision,
        (s) => {
          if (raw === null || raw.trim() === "") {
            s.sellRate = null;
            s.sellDraft = null;
            s.sellFromSlash = false;
            return;
          }
          const parsed = parseRateDraft(raw);
          if (parsed.parsed && !parsed.error) {
            s.sellRate = parsed.parsed;
            s.sellDraft = null;
            s.sellFromSlash = false;
            return;
          }
          s.sellDraft = {
            raw: parsed.retained,
            parsed: null,
            error: parsed.error ?? INVALID_RATE_HINT,
          };
        },
        (s) => buildWorksheet(s, buildWorksheetModel(s))
      );
    });
  } catch (error) {
    await replyGenericError(interaction, error);
  }
}
