import { describe, it, expect } from "vitest";
import {
  buildWorksheet,
  buildRateModal,
  buildSellModal,
  encodeCookButtonId,
  encodeCookModalId,
  decodeCookComponentId,
  WORKSHEET_BUTTON_PREFIX,
  WORKSHEET_MODAL_PREFIX,
} from "../../../../src/modules/profit/ui/cook-worksheet.js";
import { CookSession, CookSessionStore } from "../../../../src/modules/profit/session/cook-session.js";
import { buildWorksheetModel } from "../../../../src/modules/profit/session/cook-session-state.js";
import { recipeRepository } from "../../../../src/modules/profit/data/recipe.repository.js";
import { parseRate } from "../../../../src/modules/profit/domain/rate.js";
import { TextInputStyle, ActionRowBuilder, TextInputBuilder } from "discord.js";

function makeSession(options?: {
  recipeName?: string;
  includeSpices?: boolean;
  savedPrices?: Map<string, ReturnType<typeof parseRate>>;
}): CookSession {
  const store = new CookSessionStore({ now: () => 1000 });
  const recipe = recipeRepository.findByName(options?.recipeName ?? "Berry Crepes")!;
  return store.create({
    guildId: "guild-1",
    channelId: "channel-1",
    userId: "user-1",
    recipe,
    batchQuantity: 5,
    includeSpices: options?.includeSpices ?? false,
    savedPrices:
      options?.savedPrices ??
      new Map([
        ["flour", parseRate("200/150")],
        ["egg", parseRate("100/50")],
        ["milk", parseRate("100/30")],
        ["blueberry", parseRate("200/100")],
      ]),
  });
}

describe("Cook component id codec", () => {
  it("round-trips every button action", () => {
    const ids = [
      encodeCookButtonId({ kind: "edit", sessionId: "abc123", revision: 4, page: 1 }),
      encodeCookButtonId({ kind: "sell", sessionId: "abc123", revision: 4 }),
      encodeCookButtonId({ kind: "calc", sessionId: "abc123", revision: 4 }),
      encodeCookButtonId({ kind: "cancel", sessionId: "abc123", revision: 4 }),
      encodeCookButtonId({
        kind: "choice",
        sessionId: "abc123",
        revision: 4,
        ingredientId: "sugar",
        value: 3,
      }),
    ];

    for (const id of ids) {
      expect(id.startsWith(WORKSHEET_BUTTON_PREFIX)).toBe(true);
      expect(decodeCookComponentId(id)).not.toBeNull();
    }

    expect(decodeCookComponentId(ids[0])).toEqual({
      kind: "edit",
      sessionId: "abc123",
      revision: 4,
      page: 1,
    });
    expect(decodeCookComponentId(ids[4])).toEqual({
      kind: "choice",
      sessionId: "abc123",
      revision: 4,
      ingredientId: "sugar",
      value: 3,
    });
  });

  it("round-trips modal ids and rejects junk", () => {
    const rateModal = encodeCookModalId({ kind: "modal-rate", sessionId: "abc123", revision: 7, page: 0 });
    const sellModal = encodeCookModalId({ kind: "modal-sell", sessionId: "abc123", revision: 7 });

    expect(rateModal.startsWith(WORKSHEET_MODAL_PREFIX)).toBe(true);
    expect(decodeCookComponentId(rateModal)).toEqual({
      kind: "modal-rate",
      sessionId: "abc123",
      revision: 7,
      page: 0,
    });
    expect(decodeCookComponentId(sellModal)).toEqual({
      kind: "modal-sell",
      sessionId: "abc123",
      revision: 7,
    });
    expect(decodeCookComponentId("poll_vote_1")).toBeNull();
    expect(decodeCookComponentId("cook:edit:abc:notarev:1")).toBeNull();
    expect(decodeCookComponentId("cook:unknown:abc123:1")).toBeNull();
  });

  it("round-trips the details and summary toggle ids", () => {
    const details = encodeCookButtonId({ kind: "details", sessionId: "abc123", revision: 4 });
    const summary = encodeCookButtonId({ kind: "summary", sessionId: "abc123", revision: 4 });

    expect(decodeCookComponentId(details)).toEqual({
      kind: "details",
      sessionId: "abc123",
      revision: 4,
    });
    expect(decodeCookComponentId(summary)).toEqual({
      kind: "summary",
      sessionId: "abc123",
      revision: 4,
    });
    expect(decodeCookComponentId("cook:details:abc123:notarev")).toBeNull();
    expect(decodeCookComponentId("cook:summary:abc123:4:extra")).toBeNull();
  });

  it("keeps generated ids under the Discord 100 character limit", () => {
    const longestButton = encodeCookButtonId({
      kind: "choice",
      sessionId: "0123456789abcdef",
      revision: 123456,
      ingredientId: "chocolate_sprinkles_block",
      value: 3,
    });
    const longestModal = encodeCookModalId({
      kind: "modal-rate",
      sessionId: "0123456789abcdef",
      revision: 123456,
      page: 3,
    });
    expect(longestButton.length).toBeLessThan(100);
    expect(longestModal.length).toBeLessThan(100);
  });
});

describe("Cook worksheet rendering", () => {
  it("shows full ingredient names, saved rates, and provenance", () => {
    const session = makeSession();
    session.rateDrafts.set("flour", {
      raw: "100/50",
      parsed: parseRate("100/50"),
      error: null,
    });
    session.sellRate = parseRate("1/3");
    session.sellFromSlash = true;

    const embeds = buildWorksheet(session, buildWorksheetModel(session)).embeds;
    const json = embeds[0].toJSON();
    const text = JSON.stringify(json);

    expect(text).toContain("Blueberry");
    expect(text).toContain("200/150 WL");
    expect(text).toContain("100/50");
    expect(text).toContain("temporary");
    expect(text).toContain("saved");
    expect(text).toContain("x5");
  });

  it("flags invalid drafts, missing prices, and unset selling rates", () => {
    const session = makeSession({ savedPrices: new Map() });
    session.rateDrafts.set("egg", {
      raw: "junk-input",
      parsed: null,
      error: "Invalid rate format.",
    });

    const view = buildWorksheet(session, buildWorksheetModel(session));
    const text = JSON.stringify(view.embeds[0].toJSON());

    expect(text).toContain("no saved price");
    expect(text).toContain("Invalid rate");
    expect(text).toContain("Not set");
  });

  it("builds at most five action rows with bounded buttons", () => {
    const session = makeSession({ recipeName: "Skill Spice", includeSpices: true });
    const view = buildWorksheet(session, buildWorksheetModel(session));

    expect(view.components.length).toBeLessThanOrEqual(5);
    for (const row of view.components as unknown as any[]) {
      expect(row.components.length).toBeLessThanOrEqual(5);
    }
    const labels = view.components.flatMap((r: any) => r.components.map((b: any) => b.data.label));
    expect(labels.some((l: any) => String(l).includes("1-5"))).toBe(true);
    expect(labels.some((l: any) => String(l).includes("6-8"))).toBe(true);
    expect(labels).toContain("Selling rate");
    expect(labels).toContain("Calculate");
    expect(labels).toContain("Cancel");
  });

  it("offers explicit range choice buttons with no default", () => {
    const session = makeSession({ recipeName: "Detective Butter Lamb" });
    const view = buildWorksheet(session, buildWorksheetModel(session));
    const json = JSON.stringify(view);

    expect(json).toContain("Sugar 2-3");
    const choiceButtons = view.components
      .flatMap((r) => r.components)
      .filter((b: any) => decodeCookComponentId(String(b.data.custom_id))?.kind === "choice");
    expect(choiceButtons.map((b) => (b.data as any).label).sort()).toEqual([
      "Sugar: 2",
      "Sugar: 3",
    ]);
    const chosenStyles = choiceButtons.map((b: any) => b.data.style);
    expect(chosenStyles).not.toContain(3);
  });

  it("marks the chosen range option and allows switching", () => {
    const session = makeSession({ recipeName: "Detective Butter Lamb" });
    session.rangeChoices.set("sugar", 3);
    const view = buildWorksheet(session, buildWorksheetModel(session));
    const choiceButtons = view.components
      .flatMap((r) => r.components)
      .filter((b: any) => decodeCookComponentId(String(b.data.custom_id))?.kind === "choice");
    const chosen = choiceButtons.find((b: any) => b.data.label === "Sugar: 3");
    expect(chosen?.data.style).toBe(3);
  });

  it("embeds the current revision into every rendered component", () => {
    const session = makeSession();
    session.revision = 9;
    const view = buildWorksheet(session, buildWorksheetModel(session));
    const ids = view.components.flatMap((r: any) => r.components.map((b: any) => String(b.data.custom_id)));
    for (const id of ids) {
      const decoded = decodeCookComponentId(id);
      expect(decoded?.revision).toBe(9);
    }
  });
});

describe("Cook result view toggle", () => {
  it("adds a Details button when rendering the compact result view", () => {
    const session = makeSession();
    session.sellRate = parseRate("1/4");
    const view = buildWorksheet(session, buildWorksheetModel(session), {
      resultView: "summary",
    });

    const toggle = view.components
      .flatMap((r) => r.components)
      .find((b: any) => decodeCookComponentId(String(b.data.custom_id))?.kind === "details");
    expect(toggle).toBeDefined();
    expect((toggle!.data as any).label).toBe("Details");
    expect(decodeCookComponentId(String(toggle!.data.custom_id))).toEqual({
      kind: "details",
      sessionId: session.id,
      revision: session.revision,
    });
  });

  it("adds a Summary button when rendering the detailed result view", () => {
    const session = makeSession();
    session.sellRate = parseRate("1/4");
    const view = buildWorksheet(session, buildWorksheetModel(session), {
      resultView: "details",
    });

    const toggle = view.components
      .flatMap((r) => r.components)
      .find((b: any) => decodeCookComponentId(String(b.data.custom_id))?.kind === "summary");
    expect(toggle).toBeDefined();
    expect((toggle!.data as any).label).toBe("Summary");
  });

  it("omits the toggle from the plain worksheet view", () => {
    const session = makeSession();
    const view = buildWorksheet(session, buildWorksheetModel(session));
    const kinds = view.components
      .flatMap((r) => r.components)
      .map((b: any) => decodeCookComponentId(String(b.data.custom_id))?.kind);
    expect(kinds).not.toContain("details");
    expect(kinds).not.toContain("summary");
  });

  it("keeps edit, sell, calculate, cancel, and range controls within caps alongside the toggle", () => {
    const session = makeSession({ recipeName: "Detective Butter Lamb" });
    session.sellRate = parseRate("1/4");
    const view = buildWorksheet(session, buildWorksheetModel(session), {
      resultView: "summary",
    });

    expect(view.components.length).toBeLessThanOrEqual(5);
    for (const row of view.components as unknown as any[]) {
      expect(row.components.length).toBeLessThanOrEqual(5);
    }
    const kinds = view.components
      .flatMap((r) => r.components)
      .map((b: any) => decodeCookComponentId(String(b.data.custom_id))?.kind);
    for (const kind of ["edit", "sell", "calc", "cancel", "choice", "details"]) {
      expect(kinds).toContain(kind);
    }
  });
});

describe("Cook modals", () => {
  it("builds one short input per ingredient without a selling field", () => {
    const session = makeSession({ recipeName: "Skill Spice", includeSpices: true });
    const modal = buildRateModal(session, 0);
    const inputs = (modal.components as unknown as Array<ActionRowBuilder<TextInputBuilder>>).map((row) => row.components[0]);

    expect(inputs).toHaveLength(5);
    expect(modal.data.title!.length).toBeLessThanOrEqual(45);
    for (const input of inputs) {
      expect(input.data.custom_id!.startsWith("rate_")).toBe(true);
      expect(input.data.style).toBe(TextInputStyle.Short);
      expect((input.data.label as string).length).toBeLessThanOrEqual(45);
      expect(input.data.required).toBe(false);
    }
    const json = JSON.stringify(modal.toJSON());
    expect(json).not.toContain("sell_rate");
    expect(json).toContain("Cosmic 5-Spice Star");
  });

  it("prefills prior overrides and shows saved rates as placeholders", () => {
    const session = makeSession();
    session.rateDrafts.set("flour", {
      raw: "100/50",
      parsed: parseRate("100/50"),
      error: null,
    });

    const modal = buildRateModal(session, 0);
    const inputs = (modal.components as unknown as Array<ActionRowBuilder<TextInputBuilder>>).map((row) => row.components[0]);
    const flour = inputs.find((i) => i.data.custom_id === "rate_flour")!;
    const egg = inputs.find((i) => i.data.custom_id === "rate_egg")!;

    expect(flour.data.value).toBe("100/50");
    expect(flour.data.placeholder).toBeUndefined();
    expect(egg.data.value).toBeUndefined();
    expect(egg.data.placeholder).toBe("100/50");
  });

  it("paginates more than five ingredients into per-page modals", () => {
    const session = makeSession({ recipeName: "Skill Spice", includeSpices: true });
    const model = buildWorksheetModel(session);
    expect(model.pages.length).toBe(2);

    const page0 = buildRateModal(session, 0);
    const page1 = buildRateModal(session, 1);
    const page1Rows = page1.components as unknown as Array<ActionRowBuilder<TextInputBuilder>>;
    expect(page0.components).toHaveLength(5);
    expect(page1.components).toHaveLength(3);
    expect((page1Rows[0].components[0].data as any).custom_id).toBe("rate_salt");
  });

  it("builds a dedicated selling-rate modal", () => {
    const session = makeSession();
    session.sellRate = parseRate("2/1dl");

    const modal = buildSellModal(session);
    const inputs = (modal.components as unknown as Array<ActionRowBuilder<TextInputBuilder>>).map((row) => row.components[0]);
    expect(inputs).toHaveLength(1);
    expect(inputs[0].data.custom_id).toBe("sell_rate");
    expect(inputs[0].data.style).toBe(TextInputStyle.Short);
    expect(inputs[0].data.value).toBe("2/1dl");

    const cleared = makeSession();
    cleared.sellDraft = { raw: "bad", parsed: null, error: "Invalid" };
    const invalidModal = buildSellModal(cleared);
    const invalidInputs = (invalidModal.components as unknown as Array<ActionRowBuilder<TextInputBuilder>>).map((row) => row.components[0]);
    expect((invalidInputs[0].data as any).value).toBe("bad");
  });

  it("caps modal input length consistently with draft validation", () => {
    const modal = buildRateModal(makeSession(), 0);
    const inputs = (modal.components as unknown as Array<ActionRowBuilder<TextInputBuilder>>).map(
      (row) => row.components[0]
    );
    for (const input of inputs) {
      expect((input.data as any).max_length).toBe(100);
    }

    const sell = buildSellModal(makeSession());
    const sellInputs = (sell.components as unknown as Array<ActionRowBuilder<TextInputBuilder>>).map(
      (row) => row.components[0]
    );
    expect((sellInputs[0].data as any).max_length).toBe(100);
  });

  it("omits oversized retained drafts from modal prefills", () => {
    const session = makeSession();
    session.rateDrafts.set("flour", {
      raw: "x".repeat(150),
      parsed: null,
      error: "Rate is too long (maximum 100 characters).",
    });

    const modal = buildRateModal(session, 0);
    const inputs = (modal.components as unknown as Array<ActionRowBuilder<TextInputBuilder>>).map(
      (row) => row.components[0]
    );
    const flour = inputs.find(
      (i) => (i.data as any).custom_id === "rate_flour"
    )!;
    expect(flour.data.value).toBeUndefined();
  });
});
