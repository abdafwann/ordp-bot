import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import { formatWl, formatRate } from "../domain/rate.js";
import { RecipeIngredient } from "../domain/types.js";
import { CookSession, MAX_DRAFT_LENGTH } from "../session/cook-session.js";
import {
  buildWorksheetModel,
  CookWorksheetModel,
  IngredientRateStatus,
} from "../session/cook-session-state.js";
import { ResultView } from "./cook-results.js";

export const WORKSHEET_BUTTON_PREFIX = "cook:";
export const WORKSHEET_MODAL_PREFIX = "cook-modal:";

const MAX_BUTTONS_PER_ROW = 5;
const MAX_MODAL_ROWS = 5;
const MAX_FIELD_CHARS = 950;

export type CookComponentId =
  | { kind: "edit"; sessionId: string; revision: number; page: number }
  | { kind: "sell"; sessionId: string; revision: number }
  | { kind: "calc"; sessionId: string; revision: number }
  | { kind: "cancel"; sessionId: string; revision: number }
  | { kind: "details"; sessionId: string; revision: number }
  | { kind: "summary"; sessionId: string; revision: number }
  | {
      kind: "choice";
      sessionId: string;
      revision: number;
      ingredientId: string;
      value: number;
    }
  | { kind: "modal-rate"; sessionId: string; revision: number; page: number }
  | { kind: "modal-sell"; sessionId: string; revision: number };

export type CookButtonId = Extract<
  CookComponentId,
  { kind: "edit" | "sell" | "calc" | "cancel" | "details" | "summary" | "choice" }
>;

export type CookModalId = Extract<
  CookComponentId,
  { kind: "modal-rate" | "modal-sell" }
>;

export function encodeCookButtonId(id: CookButtonId): string {
  switch (id.kind) {
    case "edit":
      return `${WORKSHEET_BUTTON_PREFIX}edit:${id.sessionId}:${id.revision}:${id.page}`;
    case "sell":
      return `${WORKSHEET_BUTTON_PREFIX}sell:${id.sessionId}:${id.revision}`;
    case "calc":
      return `${WORKSHEET_BUTTON_PREFIX}calc:${id.sessionId}:${id.revision}`;
    case "cancel":
      return `${WORKSHEET_BUTTON_PREFIX}cancel:${id.sessionId}:${id.revision}`;
    case "details":
      return `${WORKSHEET_BUTTON_PREFIX}details:${id.sessionId}:${id.revision}`;
    case "summary":
      return `${WORKSHEET_BUTTON_PREFIX}summary:${id.sessionId}:${id.revision}`;
    case "choice":
      return `${WORKSHEET_BUTTON_PREFIX}q:${id.sessionId}:${id.revision}:${id.ingredientId}:${id.value}`;
  }
}

export function encodeCookModalId(id: CookModalId): string {
  if (id.kind === "modal-rate") {
    return `${WORKSHEET_MODAL_PREFIX}rate:${id.sessionId}:${id.revision}:${id.page}`;
  }
  return `${WORKSHEET_MODAL_PREFIX}sell:${id.sessionId}:${id.revision}`;
}

export function decodeCookComponentId(customId: string): CookComponentId | null {
  if (customId.startsWith(WORKSHEET_MODAL_PREFIX)) {
    const parts = customId
      .slice(WORKSHEET_MODAL_PREFIX.length)
      .split(":");
    if (parts[0] === "rate" && parts.length === 4) {
      const revision = Number(parts[2]);
      const page = Number(parts[3]);
      if (Number.isInteger(revision) && Number.isInteger(page)) {
        return { kind: "modal-rate", sessionId: parts[1], revision, page };
      }
    }
    if (parts[0] === "sell" && parts.length === 3) {
      const revision = Number(parts[2]);
      if (Number.isInteger(revision)) {
        return { kind: "modal-sell", sessionId: parts[1], revision };
      }
    }
    return null;
  }

  if (!customId.startsWith(WORKSHEET_BUTTON_PREFIX)) {
    return null;
  }

  const parts = customId.slice(WORKSHEET_BUTTON_PREFIX.length).split(":");
  const revision = Number(parts[2]);

  switch (parts[0]) {
    case "edit":
      if (parts.length === 4 && Number.isInteger(revision)) {
        const page = Number(parts[3]);
        if (Number.isInteger(page)) {
          return { kind: "edit", sessionId: parts[1], revision, page };
        }
      }
      return null;
    case "sell":
    case "calc":
    case "cancel":
    case "details":
    case "summary":
      if (parts.length === 3 && Number.isInteger(revision)) {
        return {
          kind: parts[0],
          sessionId: parts[1],
          revision,
        } as CookComponentId;
      }
      return null;
    case "q":
      if (parts.length === 5 && Number.isInteger(revision)) {
        const value = Number(parts[4]);
        if (Number.isInteger(value)) {
          return {
            kind: "choice",
            sessionId: parts[1],
            revision,
            ingredientId: parts[3],
            value,
          };
        }
      }
      return null;
    default:
      return null;
  }
}

export function formatRateInput(items: number, wl: number, currency: string): string {
  const suffix = currency === "WL" ? "" : currency.toLowerCase();
  return `${items}/${wl}${suffix}`;
}

function rateDisplay(status: IngredientRateStatus): string {
  const rate = status.effectiveRate;
  if (!rate || rate.isFree || !rate.rate) {
    return "FREE";
  }
  const { items, wl, currency } = rate.rate;
  return `${items}/${wl} ${currency}`;
}

function sourceLabel(status: IngredientRateStatus): string {
  return status.source;
}

function ingredientLine(status: IngredientRateStatus): string {
  const ing = status.ingredient;
  const parts: string[] = [];

  if (status.range && status.rangeChoice === null) {
    parts.push(`**${ing.name} ${status.range.min}-${status.range.max}**`);
  } else if (status.range) {
    parts.push(`**${ing.name}**`);
  } else {
    parts.push(`**${ing.name}**`);
  }

  let qtyText = `${status.quantityLabel}x`;
  if (status.range && status.rangeChoice !== null) {
    qtyText += ` (range ${status.range.min}-${status.range.max})`;
  }
  parts.push(qtyText);

  if (status.source === "invalid") {
    parts.push(`Invalid rate kept for correction: \`${status.draft?.raw ?? ""}\``);
  } else if (status.source === "missing") {
    parts.push("no saved price");
  } else if (status.source === "temporary") {
    const savedSuffix = status.savedRate
      ? ` (saved \`${formatRate(status.savedRate)}\`)`
      : "";
    parts.push(`temporary \`${rateDisplay(status)}\`${savedSuffix}`);
  } else {
    parts.push(`${status.source} \`${rateDisplay(status)}\``);
  }

  if (status.effectiveRate) {
    const unit =
      status.effectiveRate.isFree || !status.effectiveRate.rate
        ? "0"
        : formatWl(
            (status.effectiveRate.rate.wl *
              (status.effectiveRate.rate.currency === "DL" ? 200 : status.effectiveRate.rate.currency === "BGL" ? 40000 : 1)) /
              status.effectiveRate.rate.items,
            4
          );
    parts.push(`${unit} WL each`);
  }

  if (!status.included) {
    parts.push("excluded (optional spice)");
  }

  return parts.join(" — ");
}

function chunkLines(lines: string[], budget: number): string[] {
  const chunks: string[] = [];
  let current: string[] = [];
  let length = 0;
  for (const line of lines) {
    if (current.length > 0 && length + line.length + 1 > budget) {
      chunks.push(current.join("\n"));
      current = [];
      length = 0;
    }
    current.push(line);
    length += line.length + 1;
  }
  if (current.length > 0) {
    chunks.push(current.join("\n"));
  }
  return chunks;
}

export interface WorksheetRenderOptions {
  resultView?: ResultView;
}

function resultToggleButton(session: CookSession, resultView: ResultView): ButtonBuilder {
  const kind = resultView === "summary" ? "details" : "summary";
  const label = resultView === "summary" ? "Details" : "Summary";
  return new ButtonBuilder()
    .setCustomId(
      encodeCookButtonId({
        kind,
        sessionId: session.id,
        revision: session.revision,
      })
    )
    .setLabel(label)
    .setStyle(ButtonStyle.Secondary);
}

export function buildWorksheet(
  session: CookSession,
  model: CookWorksheetModel,
  options: WorksheetRenderOptions = {}
): { embeds: EmbedBuilder[]; components: ActionRowBuilder<ButtonBuilder>[] } {
  const embed = new EmbedBuilder()
    .setTitle(
      `Cooking Worksheet: ${session.recipe.name} (x${session.batchQuantity})`
    )
    .setColor(0x3498db)
    .setDescription(
      `Include spices: ${session.includeSpices ? "yes" : "no"}\n` +
        `Expires <t:${Math.floor(session.expiresAt / 1000)}:R>. Blank inputs use saved /prices rates; typed rates are temporary.`
    );

  const lines = [...model.included, ...model.excluded].map(ingredientLine);
  const chunks = chunkLines(lines, MAX_FIELD_CHARS);
  chunks.forEach((chunk, idx) => {
    embed.addFields({
      name: chunks.length > 1 ? `Ingredients (${idx + 1}/${chunks.length})` : "Ingredients",
      value: chunk,
    });
  });

  const sellLines: string[] = [];
  if (model.sell.draft?.error) {
    sellLines.push(
      `Selling rate: invalid draft kept for correction — fix or clear it before calculating.`
    );
  } else if (model.sell.rate) {
    const origin = model.sell.fromSlash ? "initial from /cook" : "temporary";
    sellLines.push(`Selling rate: \`${formatRate(model.sell.rate)}\` (${origin})`);
  } else {
    sellLines.push(
      "Selling rate: Not set — cost-only calculation (profit is not calculated)."
    );
  }
  if (model.modalPerDishWl !== null) {
    sellLines.push(`Current cost per dish: ${formatWl(model.modalPerDishWl, 4)} WL`);
  }
  embed.addFields({ name: "Selling", value: sellLines.join("\n") });

  const components: ActionRowBuilder<ButtonBuilder>[] = [];
  if (model.pages.length > 0) {
    const pageRow = new ActionRowBuilder<ButtonBuilder>();
    model.pages.slice(0, MAX_BUTTONS_PER_ROW).forEach((page, idx) => {
      const start = idx * 5 + 1;
      const end = start + page.length - 1;
      const label =
        page.length === 1 ? `Edit rate ${start}` : `Edit rates ${start}-${end}`;
      pageRow.addComponents(
        new ButtonBuilder()
          .setCustomId(
            encodeCookButtonId({
              kind: "edit",
              sessionId: session.id,
              revision: session.revision,
              page: idx,
            })
          )
          .setLabel(label)
          .setStyle(ButtonStyle.Primary)
      );
    });
    components.push(pageRow);
  }

  const controlRow = new ActionRowBuilder<ButtonBuilder>();
  controlRow.addComponents(
    new ButtonBuilder()
      .setCustomId(
        encodeCookButtonId({ kind: "sell", sessionId: session.id, revision: session.revision })
      )
      .setLabel("Selling rate")
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId(
        encodeCookButtonId({ kind: "calc", sessionId: session.id, revision: session.revision })
      )
      .setLabel("Calculate")
      .setStyle(ButtonStyle.Success)
  );
  if (options.resultView) {
    controlRow.addComponents(resultToggleButton(session, options.resultView));
  }
  controlRow.addComponents(
    new ButtonBuilder()
      .setCustomId(
        encodeCookButtonId({ kind: "cancel", sessionId: session.id, revision: session.revision })
      )
      .setLabel("Cancel")
      .setStyle(ButtonStyle.Danger)
  );
  components.push(controlRow);

  const rangeStatuses = model.included.filter((s) => s.range !== null).slice(0, 3);
  for (const status of rangeStatuses) {
    const range = status.range!;
    const row = new ActionRowBuilder<ButtonBuilder>();
    for (let value = range.min; value <= range.max; value++) {
      const isChosen = status.rangeChoice === value;
      row.addComponents(
        new ButtonBuilder()
          .setCustomId(
            encodeCookButtonId({
              kind: "choice",
              sessionId: session.id,
              revision: session.revision,
              ingredientId: status.ingredient.id,
              value,
            })
          )
          .setLabel(`${status.ingredient.name}: ${value}`)
          .setStyle(isChosen ? ButtonStyle.Success : ButtonStyle.Secondary)
      );
    }
    components.push(row);
  }

  return { embeds: [embed], components: components.slice(0, MAX_MODAL_ROWS) };
}

export function buildRateModal(
  session: CookSession,
  page: number
): ModalBuilder {
  const model = buildWorksheetModel(session);
  const ingredients = model.pages[page] ?? [];
  const start = page * 5 + 1;
  const end = start + ingredients.length - 1;

  const modal = new ModalBuilder()
    .setCustomId(
      encodeCookModalId({ kind: "modal-rate", sessionId: session.id, revision: session.revision, page })
    )
    .setTitle(`Cook rates ${start}-${end}`.slice(0, 45));

  for (const ingredient of ingredients) {
    const key = ingredient.id.toLowerCase();
    const draft = session.rateDrafts.get(key);
    const saved =
      session.savedPrices.get(ingredient.name.toLowerCase()) ?? null;
    const status = model.included.find((s) => s.ingredient.id === ingredient.id);
    const qtyLabel = status?.quantityLabel ?? String(ingredient.quantity);

    const input = new TextInputBuilder()
      .setCustomId(`rate_${ingredient.id}`)
      .setLabel(`${ingredient.name} (${qtyLabel}) rate`.slice(0, 45))
      .setStyle(TextInputStyle.Short)
      .setRequired(false)
      .setMaxLength(MAX_DRAFT_LENGTH);

    if (draft && draft.raw.length <= MAX_DRAFT_LENGTH) {
      input.setValue(draft.raw);
    } else if (saved?.rate) {
      input.setPlaceholder(
        formatRateInput(saved.rate.items, saved.rate.wl, saved.rate.currency)
      );
    } else {
      input.setPlaceholder("e.g. 200/150 or free");
    }

    modal.addComponents(new ActionRowBuilder<TextInputBuilder>().addComponents(input));
  }

  return modal;
}

export function buildSellModal(session: CookSession): ModalBuilder {
  const modal = new ModalBuilder()
    .setCustomId(
      encodeCookModalId({ kind: "modal-sell", sessionId: session.id, revision: session.revision })
    )
    .setTitle("Cook selling rate".slice(0, 45));

  const input = new TextInputBuilder()
    .setCustomId("sell_rate")
    .setLabel("Selling rate (blank = none)".slice(0, 45))
    .setStyle(TextInputStyle.Short)
    .setRequired(false)
    .setPlaceholder("e.g. 1/3 or 2/1dl");

  input.setMaxLength(MAX_DRAFT_LENGTH);
  if (session.sellDraft && session.sellDraft.raw.length <= MAX_DRAFT_LENGTH) {
    input.setValue(session.sellDraft.raw);
  } else if (session.sellRate?.rate) {
    input.setValue(
      formatRateInput(
        session.sellRate.rate.items,
        session.sellRate.rate.wl,
        session.sellRate.rate.currency
      )
    );
  }

  modal.addComponents(new ActionRowBuilder<TextInputBuilder>().addComponents(input));
  return modal;
}

export function ingredientPageRange(page: number, count: number): string {
  const start = page * 5 + 1;
  const end = start + count - 1;
  return `${start}-${end}`;
}

export function findRangeIngredient(
  session: CookSession,
  ingredientId: string
): RecipeIngredient | null {
  return (
    session.recipe.ingredients.find(
      (i) => i.id.toLowerCase() === ingredientId.toLowerCase()
    ) ?? null
  );
}
