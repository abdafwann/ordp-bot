import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { MessageFlags } from "discord.js";

vi.mock("../../../../src/modules/profit/profit.service.js", () => ({
  profitService: {
    getRecipe: vi.fn(),
    collectPrices: vi.fn(),
    searchRecipes: vi.fn().mockReturnValue([]),
    listPrices: vi.fn().mockResolvedValue([]),
  },
}));

import { profitService } from "../../../../src/modules/profit/profit.service.js";
import {
  executeCookCommand,
  handleCookButton,
  handleCookModalSubmit,
} from "../../../../src/modules/profit/interactions/cook.interactions.js";
import { cookSessionStore } from "../../../../src/modules/profit/session/cook-session.js";
import { decodeCookComponentId, encodeCookButtonId, encodeCookModalId } from "../../../../src/modules/profit/ui/cook-worksheet.js";
import { recipeRepository } from "../../../../src/modules/profit/data/recipe.repository.js";
import { parseRate } from "../../../../src/modules/profit/domain/rate.js";

const berryCrepes = recipeRepository.findByName("Berry Crepes")!;
const skillSpice = recipeRepository.findByName("Skill Spice")!;
const butterLamb = recipeRepository.findByName("Detective Butter Lamb")!;

function savedPricesFor(recipe: typeof berryCrepes) {
  const map = new Map<string, ReturnType<typeof parseRate>>();
  for (const ing of recipe.ingredients) {
    map.set(ing.name.toLowerCase(), parseRate("200/150"));
  }
  return map;
}

function commandInteraction(overrides?: Record<string, unknown>) {
  const calls: string[] = [];
  const interaction: any = {
    guildId: "guild-1",
    channelId: "channel-1",
    user: { id: "user-1" },
    options: {
      getString: (name: string) => (name === "dish" ? "Berry Crepes" : null),
      getInteger: () => null,
      getBoolean: () => null,
    },
    deferred: false,
    replied: false,
    deferReply: vi.fn(async () => {
      calls.push("defer");
      interaction.deferred = true;
    }),
    editReply: vi.fn(async () => {
      calls.push("editReply");
      return { id: "message-1" };
    }),
    reply: vi.fn(async () => undefined),
  };
  Object.assign(interaction, overrides);
  return { calls, interaction };
}

function buttonInteraction(
  customId: string,
  overrides?: Record<string, unknown>
) {
  return {
    customId,
    guildId: "guild-1",
    channelId: "channel-1",
    user: { id: "user-1" },
    message: { id: "message-1" },
    isButton: () => true,
    showModal: vi.fn(async () => undefined),
    update: vi.fn(async () => undefined),
    reply: vi.fn(async () => undefined),
    ...overrides,
  } as any;
}

function modalInteraction(
  customId: string,
  fieldValues: Record<string, string>,
  overrides?: Record<string, unknown>
) {
  return {
    customId,
    guildId: "guild-1",
    channelId: "channel-1",
    user: { id: "user-1" },
    message: { id: "message-1" },
    isButton: () => false,
    isFromMessage: () => true,
    fields: {
      getTextInputValue: (id: string) => {
        if (!(id in fieldValues)) {
          throw new Error("field not present");
        }
        return fieldValues[id];
      },
    },
    update: vi.fn(async () => undefined),
    reply: vi.fn(async () => undefined),
    ...overrides,
  } as any;
}

function seedSession(overrides?: {
  recipe?: typeof berryCrepes;
  includeSpices?: boolean;
  batchQuantity?: number;
  savedPrices?: Map<string, ReturnType<typeof parseRate>>;
}) {
  const recipe = overrides?.recipe ?? berryCrepes;
  const session = cookSessionStore.create({
    guildId: "guild-1",
    channelId: "channel-1",
    userId: "user-1",
    recipe,
    batchQuantity: overrides?.batchQuantity ?? 1,
    includeSpices: overrides?.includeSpices ?? false,
    savedPrices: overrides?.savedPrices ?? savedPricesFor(recipe),
  });
  session.messageId = "message-1";
  return session;
}

beforeEach(() => {
  vi.clearAllMocks();
  cookSessionStore.sweep(Number.MAX_SAFE_INTEGER);
  vi.mocked(profitService.getRecipe).mockReturnValue(berryCrepes as any);
  vi.mocked(profitService.collectPrices).mockImplementation(
    async (_guildId: string, recipe: typeof berryCrepes) =>
      savedPricesFor(recipe)
  );
});

afterEach(() => {
  vi.useRealTimers();
});

describe("/cook command execution", () => {
  it("defers the private reply before reading stored prices", async () => {
    const { interaction, calls } = commandInteraction();

    await executeCookCommand(interaction);

    expect(calls[0]).toBe("defer");
    expect(
      interaction.deferReply.mock.invocationCallOrder[0]
    ).toBeLessThan(
      vi.mocked(profitService.collectPrices).mock.invocationCallOrder[0]
    );
    expect(interaction.deferReply).toHaveBeenCalledWith(
      expect.objectContaining({ flags: MessageFlags.Ephemeral })
    );
  });

  it("sends a worksheet with components and binds it to the session", async () => {
    const { interaction } = commandInteraction();

    await executeCookCommand(interaction);

    const payload = interaction.editReply.mock.calls[0][0];
    expect(payload.embeds).toHaveLength(1);
    expect(payload.components.length).toBeGreaterThanOrEqual(2);
    expect(JSON.stringify(payload)).toContain("Cooking Worksheet: Berry Crepes");

    const session = cookSessionStore.getByMessage("message-1");
    expect(session).not.toBeNull();
    expect(session!.recipe.id).toBe("berry_crepes");
  });

  it("rejects out-of-range quantities without touching storage", async () => {
    for (const qty of [0, 100001]) {
      const { interaction } = commandInteraction({
        options: {
          getString: (name: string) => (name === "dish" ? "Berry Crepes" : null),
          getInteger: () => qty,
          getBoolean: () => null,
        },
      });

      await executeCookCommand(interaction);

      expect(interaction.deferReply).not.toHaveBeenCalled();
      expect(interaction.reply).toHaveBeenCalledWith(
        expect.objectContaining({
          content: expect.stringContaining("between 1 and 100000"),
        })
      );
    }
    expect(profitService.collectPrices).not.toHaveBeenCalled();
  });

  it("rejects invalid slash selling rates without creating a session", async () => {
    const { interaction } = commandInteraction({
      options: {
        getString: (name: string) =>
          name === "dish" ? "Berry Crepes" : name === "sell" ? "garbage" : null,
        getInteger: () => null,
        getBoolean: () => null,
      },
    });

    await executeCookCommand(interaction);

    expect(interaction.reply).toHaveBeenCalledWith(
      expect.objectContaining({
        content: expect.stringContaining("selling rate"),
      })
    );
    expect(cookSessionStore.size()).toBe(0);
  });

  it("reports unknown dishes privately", async () => {
    vi.mocked(profitService.getRecipe).mockReturnValueOnce(null as any);
    const { interaction } = commandInteraction();

    await executeCookCommand(interaction);

    expect(interaction.editReply).toHaveBeenCalledWith(
      expect.objectContaining({
        content: expect.stringContaining("not found"),
      })
    );
  });

  it("uses the slash selling rate as the initial value only", async () => {
    const { interaction } = commandInteraction({
      options: {
        getString: (name: string) =>
          name === "dish" ? "Berry Crepes" : name === "sell" ? "1/3" : null,
        getInteger: () => 5,
        getBoolean: () => true,
      },
    });

    await executeCookCommand(interaction);

    const session = cookSessionStore.getByMessage("message-1")!;
    expect(session.sellRate).toEqual(parseRate("1/3"));
    expect(session.sellFromSlash).toBe(true);
    expect(session.batchQuantity).toBe(5);
    expect(session.includeSpices).toBe(true);
  });

  it("replies with a generic sanitized error when storage fails", async () => {
    vi.mocked(profitService.collectPrices).mockRejectedValueOnce(
      new Error("SECRET PRAGMA failure details")
    );
    const { interaction } = commandInteraction();

    await executeCookCommand(interaction);

    const payload = interaction.editReply.mock.calls[0][0];
    expect(payload.content).not.toContain("SECRET PRAGMA");
    expect(payload.content).toContain("Something went wrong");
  });
});

describe("worksheet button handling", () => {
  it("opens a rate modal with at most five inputs", async () => {
    const session = seedSession();
    const interaction = buttonInteraction(
      encodeCookButtonId({
        kind: "edit",
        sessionId: session.id,
        revision: session.revision,
        page: 0,
      })
    );

    await handleCookButton(interaction);

    expect(interaction.showModal).toHaveBeenCalledTimes(1);
    const modal = interaction.showModal.mock.calls[0][0];
    expect(modal.components.length).toBeLessThanOrEqual(5);
    expect(modal.data.custom_id).toBe(
      encodeCookModalId({
        kind: "modal-rate",
        sessionId: session.id,
        revision: session.revision,
        page: 0,
      })
    );
  });

  it("opens a dedicated selling-rate modal", async () => {
    const session = seedSession();
    const interaction = buttonInteraction(
      encodeCookButtonId({
        kind: "sell",
        sessionId: session.id,
        revision: session.revision,
      })
    );

    await handleCookButton(interaction);

    const modal = interaction.showModal.mock.calls[0][0];
    expect(modal.components).toHaveLength(1);
    expect(modal.components[0].components[0].data.custom_id).toBe("sell_rate");
  });

  it("enforces ownership and message binding before any action", async () => {
    const session = seedSession();

    const stranger = buttonInteraction(
      encodeCookButtonId({
        kind: "edit",
        sessionId: session.id,
        revision: session.revision,
        page: 0,
      }),
      { user: { id: "user-2" } }
    );
    await handleCookButton(stranger);
    expect(stranger.showModal).not.toHaveBeenCalled();
    expect(stranger.reply).toHaveBeenCalledWith(
      expect.objectContaining({ content: expect.stringContaining("belong to you") })
    );

    const otherChannel = buttonInteraction(
      encodeCookButtonId({
        kind: "edit",
        sessionId: session.id,
        revision: session.revision,
        page: 0,
      }),
      { channelId: "channel-9" }
    );
    await handleCookButton(otherChannel);
    expect(otherChannel.showModal).not.toHaveBeenCalled();

    const otherMessage = buttonInteraction(
      encodeCookButtonId({
        kind: "edit",
        sessionId: session.id,
        revision: session.revision,
        page: 0,
      }),
      { message: { id: "message-9" } }
    );
    await handleCookButton(otherMessage);
    expect(otherMessage.showModal).not.toHaveBeenCalled();

    const otherGuild = buttonInteraction(
      encodeCookButtonId({
        kind: "edit",
        sessionId: session.id,
        revision: session.revision,
        page: 0,
      }),
      { guildId: "guild-9" }
    );
    await handleCookButton(otherGuild);
    expect(otherGuild.showModal).not.toHaveBeenCalled();
  });

  it("rejects stale revision actions safely without state changes", async () => {
    const session = seedSession();
    const staleId = encodeCookButtonId({
      kind: "calc",
      sessionId: session.id,
      revision: session.revision + 5,
    });
    const interaction = buttonInteraction(staleId);

    await handleCookButton(interaction);

    expect(interaction.update).not.toHaveBeenCalled();
    expect(interaction.reply).toHaveBeenCalledWith(
      expect.objectContaining({
        content: expect.stringContaining("updated"),
      })
    );
    expect(cookSessionStore.get(session.id)?.revision).toBe(0);
  });

  it("handles expired sessions by dismissing the worksheet safely", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00Z"));
    const session = seedSession();

    vi.setSystemTime(new Date("2026-01-01T00:10:01Z"));
    const interaction = buttonInteraction(
      encodeCookButtonId({
        kind: "calc",
        sessionId: session.id,
        revision: session.revision,
      })
    );

    await handleCookButton(interaction);

    expect(interaction.update).toHaveBeenCalledWith(
      expect.objectContaining({ components: [] })
    );
    expect(cookSessionStore.get(session.id)).toBeNull();
  });

  it("cancels the session and strips components", async () => {
    const session = seedSession();
    const interaction = buttonInteraction(
      encodeCookButtonId({
        kind: "cancel",
        sessionId: session.id,
        revision: session.revision,
      })
    );

    await handleCookButton(interaction);

    expect(cookSessionStore.get(session.id)).toBeNull();
    expect(interaction.update).toHaveBeenCalledWith(
      expect.objectContaining({ components: [] })
    );
  });

  it("handles unknown sessions from restarts safely", async () => {
    const interaction = buttonInteraction(
      encodeCookButtonId({
        kind: "calc",
        sessionId: "deadbeefdeadbeef",
        revision: 0,
      })
    );

    await handleCookButton(interaction);

    expect(interaction.update).toHaveBeenCalledWith(
      expect.objectContaining({ components: [] })
    );
  });

  it("blocks calculation until the range quantity is chosen", async () => {
    const session = seedSession({ recipe: butterLamb });
    const interaction = buttonInteraction(
      encodeCookButtonId({
        kind: "calc",
        sessionId: session.id,
        revision: session.revision,
      })
    );

    await handleCookButton(interaction);

    const payload = interaction.update.mock.calls[0][0];
    const text = JSON.stringify(payload);
    expect(text).toContain("Sugar");
    expect(text).toContain("Choose a quantity");
    expect(text).not.toContain("Cooking Result");
  });

  it("records explicit range choices and bumps the revision", async () => {
    const session = seedSession({ recipe: butterLamb });
    const interaction = buttonInteraction(
      encodeCookButtonId({
        kind: "choice",
        sessionId: session.id,
        revision: session.revision,
        ingredientId: "sugar",
        value: 3,
      })
    );

    await handleCookButton(interaction);

    expect(session.rangeChoices.get("sugar")).toBe(3);
    expect(session.revision).toBe(1);
    expect(interaction.update).toHaveBeenCalledTimes(1);
    const text = JSON.stringify(interaction.update.mock.calls[0][0]);
    expect(text).toContain("(range 2-3)");
  });

  it("rejects range choices outside the advertised range", async () => {
    const session = seedSession({ recipe: butterLamb });
    const interaction = buttonInteraction(
      encodeCookButtonId({
        kind: "choice",
        sessionId: session.id,
        revision: session.revision,
        ingredientId: "sugar",
        value: 9,
      })
    );

    await handleCookButton(interaction);

    expect(session.rangeChoices.size).toBe(0);
    expect(session.revision).toBe(0);
    expect(interaction.reply).toHaveBeenCalled();
  });
});

describe("worksheet calculation", () => {
  it("updates the worksheet with a private paginated result", async () => {
    const session = seedSession({ batchQuantity: 10 });
    session.sellRate = parseRate("1/3");
    const interaction = buttonInteraction(
      encodeCookButtonId({
        kind: "calc",
        sessionId: session.id,
        revision: session.revision,
      })
    );

    await handleCookButton(interaction);

    const payload = interaction.update.mock.calls[0][0];
    const text = JSON.stringify(payload);
    expect(text).toContain("Cooking Result: Berry Crepes (x10)");
    expect(text).toContain("Profit per dish");
    expect(payload.components.length).toBeGreaterThanOrEqual(2);
  });

  it("keeps the worksheet editable after calculating", async () => {
    const session = seedSession();
    session.sellRate = parseRate("1/3");
    const calcId = encodeCookButtonId({
      kind: "calc",
      sessionId: session.id,
      revision: session.revision,
    });

    await handleCookButton(buttonInteraction(calcId));

    const editInteraction = buttonInteraction(
      encodeCookButtonId({
        kind: "edit",
        sessionId: session.id,
        revision: session.revision,
        page: 0,
      })
    );
    await handleCookButton(editInteraction);
    expect(editInteraction.showModal).toHaveBeenCalledTimes(1);
  });

  it("reports missing and invalid rates while retaining drafts", async () => {
    const session = seedSession({ recipe: butterLamb, savedPrices: new Map() });
    session.rateDrafts.set("milk", {
      raw: "bogus",
      parsed: null,
      error: "Invalid rate format.",
    });
    session.rangeChoices.set("sugar", 2);

    const interaction = buttonInteraction(
      encodeCookButtonId({
        kind: "calc",
        sessionId: session.id,
        revision: session.revision,
      })
    );

    await handleCookButton(interaction);

    const text = JSON.stringify(interaction.update.mock.calls[0][0]);
    expect(text).toContain("no saved price");
    expect(text).toContain("Invalid rate");
    expect(session.rateDrafts.get("milk")?.raw).toBe("bogus");
    expect(cookSessionStore.get(session.id)).not.toBeNull();
  });
});

describe("worksheet modal submissions", () => {
  it("applies typed rates as temporary overrides and refreshes the worksheet", async () => {
    const session = seedSession();
    const interaction = modalInteraction(
      encodeCookModalId({
        kind: "modal-rate",
        sessionId: session.id,
        revision: session.revision,
        page: 0,
      }),
      { rate_flour: "100/50", rate_egg: "", rate_milk: "free" }
    );

    await handleCookModalSubmit(interaction);

    expect(session.rateDrafts.get("flour")?.parsed).toEqual(parseRate("100/50"));
    expect(session.rateDrafts.has("egg")).toBe(false);
    expect(session.rateDrafts.get("milk")?.parsed).toEqual(parseRate("free"));
    expect(session.revision).toBe(1);
    expect(interaction.update).toHaveBeenCalledTimes(1);
    const text = JSON.stringify(interaction.update.mock.calls[0][0]);
    expect(text).toContain("temporary");
  });

  it("retains invalid drafts for correction without leaking raw errors", async () => {
    const session = seedSession();
    const interaction = modalInteraction(
      encodeCookModalId({
        kind: "modal-rate",
        sessionId: session.id,
        revision: session.revision,
        page: 0,
      }),
      { rate_flour: "nonsense!!" }
    );

    await handleCookModalSubmit(interaction);

    const draft = session.rateDrafts.get("flour")!;
    expect(draft.parsed).toBeNull();
    expect(draft.error).toContain("Invalid rate");
    expect(draft.error).not.toContain("nonsense");
    const text = JSON.stringify(interaction.update.mock.calls[0][0]);
    expect(text).toContain("Invalid rate");
  });

  it("retains overlength input as an explicit error without truncating semantics", async () => {
    const session = seedSession();
    const overlength = `${"9".repeat(100)}dl`;
    const interaction = modalInteraction(
      encodeCookModalId({
        kind: "modal-rate",
        sessionId: session.id,
        revision: session.revision,
        page: 0,
      }),
      { rate_flour: overlength }
    );

    await handleCookModalSubmit(interaction);

    const draft = session.rateDrafts.get("flour")!;
    expect(draft.parsed).toBeNull();
    expect(draft.error).toContain("too long");
    expect(draft.raw).toBe(overlength);
    expect(session.revision).toBe(1);
    const text = JSON.stringify(interaction.update.mock.calls[0][0]);
    expect(text).toContain("Invalid rate");
  });

  it("bounds extremely long retained drafts defensively", async () => {
    const session = seedSession();
    const interaction = modalInteraction(
      encodeCookModalId({
        kind: "modal-rate",
        sessionId: session.id,
        revision: session.revision,
        page: 0,
      }),
      { rate_flour: "x".repeat(500) }
    );

    await handleCookModalSubmit(interaction);

    const draft = session.rateDrafts.get("flour")!;
    expect(draft.parsed).toBeNull();
    expect(draft.error).toContain("too long");
    expect(draft.raw.length).toBeLessThanOrEqual(200);
  });

  it("still accepts inputs exactly at the 100 character limit", async () => {
    const session = seedSession();
    const atLimit = `2147483647/${"9".repeat(89)}`;
    expect(atLimit.length).toBe(100);
    const interaction = modalInteraction(
      encodeCookModalId({
        kind: "modal-rate",
        sessionId: session.id,
        revision: session.revision,
        page: 0,
      }),
      { rate_flour: atLimit }
    );

    await handleCookModalSubmit(interaction);

    const draft = session.rateDrafts.get("flour")!;
    expect(draft.parsed).not.toBeNull();
    expect(draft.error).toBeNull();
    expect(draft.raw).toBe(atLimit);
  });

  it("sets, clears, and flags the selling rate from its dedicated modal", async () => {
    const session = seedSession();
    session.sellRate = parseRate("1/3");
    session.sellFromSlash = true;

    const setInteraction = modalInteraction(
      encodeCookModalId({
        kind: "modal-sell",
        sessionId: session.id,
        revision: session.revision,
      }),
      { sell_rate: "2/1dl" }
    );
    await handleCookModalSubmit(setInteraction);
    expect(session.sellRate).toEqual(parseRate("2/1dl"));
    expect(session.sellFromSlash).toBe(false);
    expect(session.sellDraft).toBeNull();

    const clearInteraction = modalInteraction(
      encodeCookModalId({
        kind: "modal-sell",
        sessionId: session.id,
        revision: session.revision,
      }),
      { sell_rate: "" }
    );
    await handleCookModalSubmit(clearInteraction);
    expect(session.sellRate).toBeNull();
    expect(session.sellDraft).toBeNull();

    const invalidInteraction = modalInteraction(
      encodeCookModalId({
        kind: "modal-sell",
        sessionId: session.id,
        revision: session.revision,
      }),
      { sell_rate: "junk-input" }
    );
    await handleCookModalSubmit(invalidInteraction);
    expect(session.sellRate).toBeNull();
    expect(session.sellDraft?.error).toContain("Invalid rate");
    const text = JSON.stringify(invalidInteraction.update.mock.calls[0][0]);
    expect(text).toContain("invalid draft");
  });

  it("rejects stale modal submissions without applying values", async () => {
    const session = seedSession();
    const interaction = modalInteraction(
      encodeCookModalId({
        kind: "modal-rate",
        sessionId: session.id,
        revision: session.revision + 3,
        page: 0,
      }),
      { rate_flour: "100/50" }
    );

    await handleCookModalSubmit(interaction);

    expect(session.rateDrafts.size).toBe(0);
    expect(interaction.update).not.toHaveBeenCalled();
    expect(interaction.reply).toHaveBeenCalled();
  });
});

describe("pagination with more than five ingredients", () => {
  it("splits skill spice across two pages with a dedicated sell modal", async () => {
    const session = seedSession({ recipe: skillSpice, includeSpices: true });

    const page0 = buttonInteraction(
      encodeCookButtonId({
        kind: "edit",
        sessionId: session.id,
        revision: session.revision,
        page: 0,
      })
    );
    await handleCookButton(page0);
    const modal0 = page0.showModal.mock.calls[0][0];
    expect(modal0.components).toHaveLength(5);

    const page1 = buttonInteraction(
      encodeCookButtonId({
        kind: "edit",
        sessionId: session.id,
        revision: session.revision,
        page: 1,
      })
    );
    await handleCookButton(page1);
    const modal1 = page1.showModal.mock.calls[0][0];
    expect(modal1.components).toHaveLength(3);
    expect(modal1.components[0].components[0].data.custom_id).toBe("rate_salt");

    const sell = buttonInteraction(
      encodeCookButtonId({
        kind: "sell",
        sessionId: session.id,
        revision: session.revision,
      })
    );
    await handleCookButton(sell);
    expect(sell.showModal).toHaveBeenCalledTimes(1);
  });
});

describe("cook interaction helpers", () => {
  it("recognizes cook component ids for routing", async () => {
    const { isCookButtonCustomId, isCookModalCustomId } = await import(
      "../../../../src/modules/profit/interactions/cook.interactions.js"
    );
    expect(isCookButtonCustomId("cook:calc:abc:1")).toBe(true);
    expect(isCookButtonCustomId("poll_vote_1")).toBe(false);
    expect(isCookModalCustomId("cook-modal:rate:abc:1:0")).toBe(true);
    expect(isCookModalCustomId("cook-modal:sell:abc:1")).toBe(true);
    expect(isCookModalCustomId("cook_modal:old:flow")).toBe(false);
  });
});

describe("modal pages need not be visited", () => {
  it("calculates straight from snapshot values without opening any modal", async () => {
    const session = seedSession();
    session.sellRate = parseRate("1/3");
    const interaction = buttonInteraction(
      encodeCookButtonId({
        kind: "calc",
        sessionId: session.id,
        revision: session.revision,
      })
    );

    await handleCookButton(interaction);

    expect(interaction.showModal).not.toHaveBeenCalled();
    const text = JSON.stringify(interaction.update.mock.calls[0][0]);
    expect(text).toContain("Cooking Result: Berry Crepes");
  });
});

describe("publication failure recovery", () => {
  function choiceCustomId(sessionId: string, revision: number, value: number) {
    return encodeCookButtonId({
      kind: "choice",
      sessionId,
      revision,
      ingredientId: "sugar",
      value,
    });
  }

  it("rolls the session back when publication fails so old controls stay usable", async () => {
    const session = seedSession({ recipe: butterLamb });
    const failing = buttonInteraction(choiceCustomId(session.id, 0, 3), {
      update: vi.fn(async () => {
        throw new Error("discord unavailable");
      }),
    });

    await handleCookButton(failing);

    expect(session.revision).toBe(0);
    expect(session.rangeChoices.size).toBe(0);
    expect(failing.update).toHaveBeenCalledTimes(1);
    expect(failing.reply).toHaveBeenCalledWith(
      expect.objectContaining({
        content: expect.stringContaining("Something went wrong"),
      })
    );

    const retry = buttonInteraction(choiceCustomId(session.id, 0, 3));
    await handleCookButton(retry);

    expect(retry.update).toHaveBeenCalledTimes(1);
    expect(session.rangeChoices.get("sugar")).toBe(3);
    expect(session.revision).toBe(1);
  });

  it("keeps the worksheet editable after a failed calculate publication", async () => {
    const session = seedSession();
    session.sellRate = parseRate("1/3");
    const failing = buttonInteraction(
      encodeCookButtonId({
        kind: "calc",
        sessionId: session.id,
        revision: session.revision,
      }),
      {
        update: vi.fn(async () => {
          throw new Error("discord unavailable");
        }),
      }
    );

    await handleCookButton(failing);

    expect(session.revision).toBe(0);
    expect(failing.reply).toHaveBeenCalledWith(
      expect.objectContaining({
        content: expect.stringContaining("Something went wrong"),
      })
    );

    const retry = buttonInteraction(
      encodeCookButtonId({
        kind: "calc",
        sessionId: session.id,
        revision: session.revision,
      })
    );
    await handleCookButton(retry);
    expect(JSON.stringify(retry.update.mock.calls[0][0])).toContain(
      "Cooking Result"
    );
  });

  it("applies only one of two concurrent same-revision submissions", async () => {
    const session = seedSession();
    const modalId = encodeCookModalId({
      kind: "modal-rate",
      sessionId: session.id,
      revision: 0,
      page: 0,
    });

    const first = modalInteraction(modalId, { rate_flour: "100/50" });
    const second = modalInteraction(modalId, { rate_flour: "200/150" });

    await Promise.all([
      handleCookModalSubmit(first),
      handleCookModalSubmit(second),
    ]);

    expect(session.revision).toBe(1);
    expect(session.rateDrafts.size).toBe(1);
    expect(session.rateDrafts.get("flour")?.parsed).toEqual(
      parseRate("100/50")
    );
    expect(first.update).toHaveBeenCalledTimes(1);
    expect(second.update).not.toHaveBeenCalled();
    expect(second.reply).toHaveBeenCalledWith(
      expect.objectContaining({
        content: expect.stringContaining("out of date"),
      })
    );
  });

  it("does not resurrect a session cancelled before its queued transition", async () => {
    const session = seedSession();
    const modalId = encodeCookModalId({
      kind: "modal-rate",
      sessionId: session.id,
      revision: 0,
      page: 0,
    });

    let releaseModal!: () => void;
    const gate = new Promise<void>((resolve) => {
      releaseModal = resolve;
    });
    const slowModal = modalInteraction(modalId, { rate_flour: "100/50" });
    slowModal.update = vi.fn(async () => {
      await gate;
    });

    const modalTask = handleCookModalSubmit(slowModal);
    await Promise.resolve();
    await Promise.resolve();

    cookSessionStore.delete(session.id);
    releaseModal();
    await modalTask;

    expect(slowModal.update).toHaveBeenCalledTimes(1);
    expect(cookSessionStore.get(session.id)).toBeNull();
    expect(cookSessionStore.size()).toBe(0);
  });
});

describe("calculation overflow handling", () => {
  it("reports an actionable blocker instead of Infinity percentages", async () => {
    const extreme: ReturnType<typeof parseRate> = {
      isFree: false,
      rate: { items: 1, wl: 1e-300, currency: "WL" },
    };
    const session = seedSession({
      savedPrices: new Map([
        ["flour", extreme],
        ["egg", extreme],
        ["milk", extreme],
        ["blueberry", extreme],
      ]),
    });
    session.sellRate = {
      isFree: false,
      rate: { items: 1, wl: 1e300, currency: "WL" },
    };

    const interaction = buttonInteraction(
      encodeCookButtonId({
        kind: "calc",
        sessionId: session.id,
        revision: session.revision,
      })
    );

    await handleCookButton(interaction);

    const text = JSON.stringify(interaction.update.mock.calls[0][0]);
    expect(text).toContain("too large");
    expect(text).toContain("Reduce the batch quantity");
    expect(text).not.toContain("Infinity");
    expect(session.revision).toBe(0);

    const followUp = buttonInteraction(
      encodeCookButtonId({
        kind: "edit",
        sessionId: session.id,
        revision: session.revision,
        page: 0,
      })
    );
    await handleCookButton(followUp);
    expect(followUp.showModal).toHaveBeenCalledTimes(1);
  });
});

describe("result details toggle", () => {
  function calcButton(session: { id: string; revision: number }) {
    return encodeCookButtonId({
      kind: "calc",
      sessionId: session.id,
      revision: session.revision,
    });
  }

  function detailsButton(session: { id: string; revision: number }) {
    return encodeCookButtonId({
      kind: "details",
      sessionId: session.id,
      revision: session.revision,
    });
  }

  function summaryButton(session: { id: string; revision: number }) {
    return encodeCookButtonId({
      kind: "summary",
      sessionId: session.id,
      revision: session.revision,
    });
  }

  function componentKinds(payload: any): (string | undefined)[] {
    return (payload.components as any[])
      .flatMap((row) => row.components)
      .map((b) => decodeCookComponentId(String(b.data.custom_id))?.kind);
  }

  it("calculates into the compact result with a Details button", async () => {
    const session = seedSession({ batchQuantity: 10 });
    session.sellRate = parseRate("1/4");
    const interaction = buttonInteraction(calcButton(session));

    await handleCookButton(interaction);

    const payload = interaction.update.mock.calls[0][0];
    const text = JSON.stringify(payload);
    expect(text).toContain("Cooking Result: Berry Crepes (x10)");
    expect(text).toContain("Profit per dish");
    expect(text).not.toContain("Provenance");
    expect(componentKinds(payload)).toContain("details");
  });

  it("omits batch totals from interaction views when batch quantity is 1", async () => {
    const session = seedSession({ batchQuantity: 1 });
    session.sellRate = parseRate("1/4");

    const calc = buttonInteraction(calcButton(session));
    await handleCookButton(calc);
    const summaryText = JSON.stringify(calc.update.mock.calls[0][0]);
    expect(summaryText).toContain("Cooking Result: Berry Crepes (x1)");
    expect(summaryText).not.toContain("Batch (x1)");

    const details = buttonInteraction(detailsButton(session));
    await handleCookButton(details);
    const detailsText = JSON.stringify(details.update.mock.calls[0][0]);
    expect(detailsText).toContain("Cooking Details: Berry Crepes (x1)");
    expect(detailsText).not.toContain("x/batch");
  });

  it("supports calculating and toggling details in cost-only mode when sell rate is not set", async () => {
    const session = seedSession({ batchQuantity: 5 });
    // session.sellRate is null (cost-only)

    const calc = buttonInteraction(calcButton(session));
    await handleCookButton(calc);
    const summaryPayload = calc.update.mock.calls[0][0];
    const summaryText = JSON.stringify(summaryPayload);
    expect(summaryText).toContain("Selling rate not set");
    expect(summaryText).toContain("Batch (x5)");
    expect(componentKinds(summaryPayload)).toContain("details");

    const details = buttonInteraction(detailsButton(session));
    await handleCookButton(details);
    const detailsPayload = details.update.mock.calls[0][0];
    const detailsText = JSON.stringify(detailsPayload);
    expect(detailsText).toContain("Cooking Details: Berry Crepes (x5)");
    expect(detailsText).toContain("Provenance:");
    expect(componentKinds(detailsPayload)).toContain("summary");

    const back = buttonInteraction(summaryButton(session));
    await handleCookButton(back);
    const backText = JSON.stringify(back.update.mock.calls[0][0]);
    expect(backText).toContain("Cooking Result: Berry Crepes (x5)");
  });

  it("toggles to the detailed view and back without mutating the session", async () => {
    const session = seedSession({ batchQuantity: 10 });
    session.sellRate = parseRate("1/4");

    await handleCookButton(buttonInteraction(calcButton(session)));

    const details = buttonInteraction(detailsButton(session));
    await handleCookButton(details);

    const detailsPayload = details.update.mock.calls[0][0];
    const detailsText = JSON.stringify(detailsPayload);
    expect(detailsText).toContain("Cooking Details: Berry Crepes (x10)");
    expect(detailsText).toContain("Provenance: saved = stored /prices rate");
    expect(detailsText).toContain("10x/batch");
    expect(componentKinds(detailsPayload)).toContain("summary");
    expect(componentKinds(detailsPayload)).toContain("edit");
    expect(componentKinds(detailsPayload)).toContain("calc");
    expect(componentKinds(detailsPayload)).toContain("cancel");
    expect(session.revision).toBe(0);

    const back = buttonInteraction(summaryButton(session));
    await handleCookButton(back);

    const summaryPayload = back.update.mock.calls[0][0];
    const summaryText = JSON.stringify(summaryPayload);
    expect(summaryText).toContain("Cooking Result: Berry Crepes (x10)");
    expect(summaryText).not.toContain("Provenance");
    expect(componentKinds(summaryPayload)).toContain("details");
    expect(session.revision).toBe(0);
  });

  it("keeps rate editing working after toggling views", async () => {
    const session = seedSession();
    session.sellRate = parseRate("1/4");

    await handleCookButton(buttonInteraction(calcButton(session)));
    await handleCookButton(buttonInteraction(detailsButton(session)));

    const edit = buttonInteraction(
      encodeCookButtonId({
        kind: "edit",
        sessionId: session.id,
        revision: session.revision,
        page: 0,
      })
    );
    await handleCookButton(edit);
    expect(edit.showModal).toHaveBeenCalledTimes(1);
    expect(edit.showModal.mock.calls[0][0].components.length).toBeLessThanOrEqual(5);
  });

  it("enforces ownership, guild, channel, and message binding for toggles", async () => {
    const session = seedSession();
    session.sellRate = parseRate("1/4");

    const stranger = buttonInteraction(detailsButton(session), {
      user: { id: "user-2" },
    });
    await handleCookButton(stranger);
    expect(stranger.update).not.toHaveBeenCalled();
    expect(stranger.reply).toHaveBeenCalledWith(
      expect.objectContaining({ content: expect.stringContaining("belong to you") })
    );

    const otherMessage = buttonInteraction(detailsButton(session), {
      message: { id: "message-9" },
    });
    await handleCookButton(otherMessage);
    expect(otherMessage.update).not.toHaveBeenCalled();
  });

  it("rejects stale toggle clicks without rendering a result", async () => {
    const session = seedSession();
    session.sellRate = parseRate("1/4");
    await handleCookButton(buttonInteraction(calcButton(session)));

    const staleDetails = buttonInteraction(
      encodeCookButtonId({ kind: "details", sessionId: session.id, revision: 99 })
    );
    await handleCookButton(staleDetails);

    expect(staleDetails.update).not.toHaveBeenCalled();
    expect(staleDetails.reply).toHaveBeenCalledWith(
      expect.objectContaining({ content: expect.stringContaining("out of date") })
    );
  });

  it("recovers safely when publishing the details view fails", async () => {
    const session = seedSession();
    session.sellRate = parseRate("1/4");
    await handleCookButton(buttonInteraction(calcButton(session)));

    const failing = buttonInteraction(detailsButton(session), {
      update: vi.fn(async () => {
        throw new Error("discord unavailable SECRET");
      }),
    });
    await handleCookButton(failing);

    expect(failing.reply).toHaveBeenCalledWith(
      expect.objectContaining({
        content: expect.stringContaining("Something went wrong"),
      })
    );
    expect(session.revision).toBe(0);

    const retry = buttonInteraction(detailsButton(session));
    await handleCookButton(retry);
    expect(JSON.stringify(retry.update.mock.calls[0][0])).toContain(
      "Cooking Details"
    );
  });

  it("never renders a stale result after rates were edited", async () => {
    const session = seedSession();
    session.sellRate = parseRate("1/4");
    await handleCookButton(buttonInteraction(calcButton(session)));

    const editSubmit = modalInteraction(
      encodeCookModalId({
        kind: "modal-rate",
        sessionId: session.id,
        revision: session.revision,
        page: 0,
      }),
      { rate_flour: "500/1" }
    );
    await handleCookModalSubmit(editSubmit);

    const editedText = JSON.stringify(editSubmit.update.mock.calls[0][0]);
    expect(session.revision).toBe(1);
    expect(editedText).not.toContain("Cooking Result");
    expect(editedText).not.toContain("Profit per dish");

    const oldDetails = buttonInteraction(
      encodeCookButtonId({ kind: "details", sessionId: session.id, revision: 0 })
    );
    await handleCookButton(oldDetails);
    expect(oldDetails.update).not.toHaveBeenCalled();
    expect(oldDetails.reply).toHaveBeenCalledWith(
      expect.objectContaining({ content: expect.stringContaining("out of date") })
    );
  });
});

void decodeCookComponentId;
