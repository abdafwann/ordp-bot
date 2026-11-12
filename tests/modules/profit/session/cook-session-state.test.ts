import { describe, it, expect } from "vitest";
import {
  buildWorksheetModel,
  computeSessionResult,
  IngredientRateStatus,
} from "../../../../src/modules/profit/session/cook-session-state.js";
import { CookSession, CookSessionStore } from "../../../../src/modules/profit/session/cook-session.js";
import { recipeRepository } from "../../../../src/modules/profit/data/recipe.repository.js";
import { parseRate } from "../../../../src/modules/profit/domain/rate.js";
import { ProfitResult } from "../../../../src/modules/profit/domain/types.js";

function makeSession(options?: {
  recipeName?: string;
  includeSpices?: boolean;
  batchQuantity?: number;
  savedPrices?: Map<string, ReturnType<typeof parseRate>>;
  sellRate?: ReturnType<typeof parseRate>;
}): CookSession {
  const store = new CookSessionStore({ now: () => 1000 });
  const recipe =
    recipeRepository.findByName(options?.recipeName ?? "Berry Crepes")!;
  const session = store.create({
    guildId: "guild-1",
    channelId: "channel-1",
    userId: "user-1",
    recipe,
    batchQuantity: options?.batchQuantity ?? 1,
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
  if (options?.sellRate) {
    session.sellRate = options.sellRate;
  }
  return session;
}

function byId(
  model: ReturnType<typeof buildWorksheetModel>,
  id: string
): IngredientRateStatus | undefined {
  return [...model.included, ...model.excluded].find(
    (s) => s.ingredient.id === id
  );
}

describe("Cook session worksheet model", () => {
  it("describes saved rates and pages for included ingredients", () => {
    const session = makeSession();
    const model = buildWorksheetModel(session);

    expect(model.included.map((s) => s.ingredient.id)).toEqual([
      "flour",
      "egg",
      "milk",
      "blueberry",
    ]);
    expect(model.pages).toHaveLength(1);
    expect(model.pages[0]).toHaveLength(4);

    const flour = byId(model, "flour")!;
    expect(flour.source).toBe("saved");
    expect(flour.effectiveRate).toEqual(parseRate("200/150"));
    expect(flour.savedRate).toEqual(parseRate("200/150"));
    expect(flour.quantityLabel).toBe("1");
    expect(flour.included).toBe(true);
    expect(model.blockers).toEqual([]);
    expect(model.modalPerDishWl).toBeCloseTo(0.75 + 0.5 + 0.3 + 0.5, 6);
  });

  it("marks optional spices as excluded with their saved rates when include-spices is off", () => {
    const session = makeSession({ recipeName: "Apple Strudel" });
    const model = buildWorksheetModel(session);

    const salt = byId(model, "salt")!;
    expect(salt.included).toBe(false);
    expect(model.included.map((s) => s.ingredient.id)).not.toContain("salt");
    expect(model.excluded.map((s) => s.ingredient.id)).toContain("salt");
    expect(model.pages[0]).toHaveLength(4);
  });

  it("keeps typed free and temporary rate drafts separate from saved rates", () => {
    const session = makeSession();
    session.rateDrafts.set("flour", {
      raw: "free",
      parsed: parseRate("free"),
      error: null,
    });
    session.rateDrafts.set("egg", {
      raw: "100/80",
      parsed: parseRate("100/80"),
      error: null,
    });

    const model = buildWorksheetModel(session);
    expect(byId(model, "flour")!.source).toBe("free");
    expect(byId(model, "egg")!.source).toBe("temporary");
    expect(byId(model, "egg")!.savedRate?.rate?.wl).toBe(50);
    expect(byId(model, "egg")!.effectiveRate?.rate?.wl).toBe(80);
  });

  it("flags invalid drafts as blockers while retaining them", () => {
    const session = makeSession();
    session.rateDrafts.set("flour", {
      raw: "not-a-rate",
      parsed: null,
      error: "Invalid rate format.",
    });

    const model = buildWorksheetModel(session);
    const flour = byId(model, "flour")!;
    expect(flour.source).toBe("invalid");
    expect(flour.effectiveRate).toBeNull();
    expect(flour.draft?.raw).toBe("not-a-rate");
    expect(model.blockers).toContainEqual({
      kind: "invalid_rates",
      names: ["Flour"],
    });
    expect(model.modalPerDishWl).toBeNull();
  });

  it("flags missing saved prices for included ingredients", () => {
    const session = makeSession({ savedPrices: new Map() });
    const model = buildWorksheetModel(session);

    expect(byId(model, "flour")!.source).toBe("missing");
    expect(model.blockers).toContainEqual({
      kind: "missing_rates",
      names: ["Flour", "Egg", "Milk", "Blueberry"],
    });
  });

  it("reports sell rate state including invalid sell drafts", () => {
    const session = makeSession({ sellRate: parseRate("1/3") });
    let model = buildWorksheetModel(session);
    expect(model.sell.rate).toEqual(parseRate("1/3"));
    expect(model.sell.fromSlash).toBe(false);
    expect(model.sell.invalid).toBe(false);
    expect(model.blockers).toEqual([]);

    session.sellFromSlash = true;
    model = buildWorksheetModel(session);
    expect(model.sell.fromSlash).toBe(true);

    session.sellFromSlash = false;
    session.sellDraft = { raw: "junk", parsed: null, error: "Invalid rate format." };
    model = buildWorksheetModel(session);
    expect(model.sell.invalid).toBe(true);
    expect(model.sell.rate).toEqual(parseRate("1/3"));
    expect(model.blockers).toContainEqual({ kind: "invalid_sell" });
  });

  it("requires explicit range choices and reflects the chosen quantity", () => {
    const savedPrices = new Map([
      ["coconut milk", parseRate("100/50")],
      ["corn meal", parseRate("100/50")],
      ["bacon", parseRate("100/50")],
      ["milk", parseRate("100/50")],
      ["habanero pepper", parseRate("100/50")],
      ["sugar", parseRate("100/50")],
    ]);
    const session = makeSession({
      recipeName: "Detective Butter Lamb",
      savedPrices,
    });

    let model = buildWorksheetModel(session);
    const sugar = byId(model, "sugar")!;
    expect(sugar.range).toEqual({ min: 2, max: 3 });
    expect(sugar.quantityLabel).toBe("2-3");
    expect(model.blockers).toContainEqual({
      kind: "missing_range_choice",
      names: ["Sugar"],
    });

    session.rangeChoices.set("sugar", 3);
    model = buildWorksheetModel(session);
    const chosen = byId(model, "sugar")!;
    expect(chosen.quantityLabel).toBe("3");
    expect(chosen.rangeChoice).toBe(3);
    expect(model.blockers).not.toContainEqual(
      expect.objectContaining({ kind: "missing_range_choice" })
    );
    expect(model.modalPerDishWl).toBeCloseTo(5 * 0.5 + 3 * 0.5, 6);
  });
});

describe("Cook session calculation", () => {
  it("computes the full profit result without re-reading storage", () => {
    const session = makeSession({ batchQuantity: 10 });
    session.sellRate = parseRate("1/3");
    session.rateDrafts.set("flour", {
      raw: "100/50",
      parsed: parseRate("100/50"),
      error: null,
    });

    const outcome = computeSessionResult(session);
    expect(outcome.ok).toBe(true);
    const result = (outcome as { ok: true; result: ProfitResult }).result;

    expect(result.sellPricePerMasakanWl).toBe(3);
    expect(result.modalPerMasakanWl).toBeCloseTo(0.5 + 0.5 + 0.3 + 0.5, 6);
    expect(result.totalModalWl).toBeCloseTo(1.8 * 10, 6);
    expect(result.totalRevenueWl).toBeCloseTo(30, 6);
    expect(result.totalProfitWl).toBeCloseTo(30 - 18, 6);
    const flourRow = result.breakdown.find((b) => b.id === "flour");
    expect(flourRow?.quantity).toBe(1);
  });

  it("supports cost-only calculation when no selling rate is set", () => {
    const outcome = computeSessionResult(makeSession());
    expect(outcome.ok).toBe(true);
    const result = (outcome as { ok: true; result: ProfitResult }).result;
    expect(result.modalPerMasakanWl).toBeGreaterThan(0);
    expect(result.sellPricePerMasakanWl).toBeNull();
    expect(result.profitPerMasakanWl).toBeNull();
    expect(result.marginPercent).toBeNull();
    expect(result.roiPercent).toBeNull();
  });

  it("returns blockers instead of calculating when prerequisites are unmet", () => {
    const emptySession = makeSession({
      recipeName: "Detective Butter Lamb",
      savedPrices: new Map(),
    });

    const outcome = computeSessionResult(emptySession);
    expect(outcome.ok).toBe(false);
    const blockers = (outcome as { ok: false; blockers: unknown[] }).blockers;
    expect(blockers).toContainEqual(
      expect.objectContaining({ kind: "missing_range_choice" })
    );
    expect(blockers).toContainEqual(
      expect.objectContaining({ kind: "missing_rates" })
    );
  });
});
