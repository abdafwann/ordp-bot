import { describe, it, expect } from "vitest";
import { buildResultEmbeds } from "../../../../src/modules/profit/ui/cook-results.js";
import { CookSession, CookSessionStore } from "../../../../src/modules/profit/session/cook-session.js";
import { recipeRepository } from "../../../../src/modules/profit/data/recipe.repository.js";
import { parseRate } from "../../../../src/modules/profit/domain/rate.js";
import { calculateProfit } from "../../../../src/modules/profit/domain/calculate.js";
import { CookingRecipe, ProfitResult } from "../../../../src/modules/profit/domain/types.js";

const BERRY_SPRITE = "https://cdn.growtopiawiki.com/sprites/4596.png";
const BERRY_SOURCE = "https://growtopiawiki.com/w/Berry_Crepes";

function makeSession(
  recipeName: string,
  batchQuantity: number,
  includeSpices = false
): CookSession {
  const store = new CookSessionStore({ now: () => 1000 });
  const recipe = recipeRepository.findByName(recipeName)!;
  return store.create({
    guildId: "guild-1",
    channelId: "channel-1",
    userId: "user-1",
    recipe,
    batchQuantity,
    includeSpices,
    savedPrices: new Map(),
  });
}

const bareRecipe: CookingRecipe = {
  id: "bare_test",
  name: "Bare Test Dish",
  ingredients: [
    { id: "flour", name: "Flour", quantity: 2, timing: "0s", requirement: "required" },
    { id: "egg", name: "Egg", quantity: 1, timing: "0s", requirement: "required" },
  ],
  punchTiming: "30s",
  heatLevel: "Medium",
};

function makeBareSession(batchQuantity = 1): CookSession {
  const store = new CookSessionStore({ now: () => 1000 });
  return store.create({
    guildId: "guild-1",
    channelId: "channel-1",
    userId: "user-1",
    recipe: bareRecipe,
    batchQuantity,
    includeSpices: false,
    savedPrices: new Map(),
  });
}

function compute(session: CookSession, rateStr = "200/150"): ProfitResult {
  const prices = new Map<string, ReturnType<typeof parseRate>>();
  for (const ing of session.recipe.ingredients) {
    prices.set(ing.name.toLowerCase(), parseRate(rateStr));
  }
  return calculateProfit({
    recipe: session.recipe,
    prices,
    quantity: session.batchQuantity,
    includeSpices: session.includeSpices,
    sellRate: session.sellRate,
  });
}

function render(
  recipeName: string,
  session: CookSession,
  view?: "summary" | "details"
) {
  const result = compute(session);
  return buildResultEmbeds({ session, result, view });
}

function textOf(embeds: { toJSON: () => unknown }[]): string {
  return JSON.stringify(embeds.map((e) => e.toJSON()));
}

describe("Cook result summary (compact default)", () => {
  it("shows cost, sell, profit, margin, and ROI immediately", () => {
    const session = makeSession("Berry Crepes", 10);
    session.sellRate = parseRate("1/4");
    const embeds = render("Berry Crepes", session);
    const text = textOf(embeds);

    expect(text).toContain("Cost per dish: 3.00 WL");
    expect(text).toContain("Sell per dish: 4.00 WL");
    expect(text).toContain("Profit per dish: +1.00 WL");
    expect(text).toContain("Margin: 25.00%");
    expect(text).toContain("ROI: 33.33%");
  });

  it("shows batch totals only when batch quantity is greater than one", () => {
    const batched = makeSession("Berry Crepes", 10);
    batched.sellRate = parseRate("1/4");
    const batchedText = textOf(render("Berry Crepes", batched));
    expect(batchedText).toContain("Batch (x10)");
    expect(batchedText).toContain("cost 30.00 WL");
    expect(batchedText).toContain("sell 40.00 WL");
    expect(batchedText).toContain("profit 10.00 WL");

    const single = makeSession("Berry Crepes", 1);
    single.sellRate = parseRate("1/4");
    const singleText = textOf(render("Berry Crepes", single));
    expect(singleText).not.toContain("Batch (x1)");
    expect(singleText).not.toContain("/batch");
    expect(singleText).not.toContain("Cost total");
    expect(singleText).not.toContain("Revenue total");
    expect(singleText).not.toContain("Profit total");
  });

  it("keeps ingredient names full with per-dish costs and no rate noise", () => {
    const session = makeSession("Berry Crepes", 10);
    const text = textOf(render("Berry Crepes", session));

    expect(text).toContain("Flour 1x — 0.75 WL");
    expect(text).toContain("Blueberry 1x — 0.75 WL");
    expect(text).not.toContain("200/150");
    expect(text).not.toContain("(saved)");
    expect(text).not.toContain("WL each");
  });

  it("marks free ingredients as FREE in the compact list", () => {
    const session = makeSession("Berry Crepes", 1);
    const prices = new Map<string, ReturnType<typeof parseRate>>([
      ["flour", parseRate("free")],
      ["egg", parseRate("100/50")],
      ["milk", parseRate("100/30")],
      ["blueberry", parseRate("200/100")],
    ]);
    const result = calculateProfit({
      recipe: session.recipe,
      prices,
      quantity: 1,
      sellRate: session.sellRate,
    });
    const text = textOf(buildResultEmbeds({ session, result }));

    expect(text).toContain("Flour 1x — FREE");
    expect(text).toContain("Egg 1x — 0.5 WL");
  });

  it("hides provenance and disclaimers from the compact view", () => {
    const session = makeSession("Berry Crepes", 10);
    const text = textOf(render("Berry Crepes", session));

    expect(text).not.toContain("Provenance");
    expect(text).not.toContain("fees");
  });

  it("states that profit is not calculated without a selling rate", () => {
    const embeds = render("Berry Crepes", makeSession("Berry Crepes", 1));
    const text = textOf(embeds);

    expect(text).toContain("Selling rate not set");
    expect(text).toContain("Cost per dish");
    expect(text).not.toContain("Margin");
    expect(text).not.toContain("ROI");
  });

  it("shows N/A independently for zero margin or ROI denominators", () => {
    const store = new CookSessionStore({ now: () => 1000 });
    const recipe = recipeRepository.findByName("Berry Crepes")!;
    const session = store.create({
      guildId: "g",
      channelId: "c",
      userId: "u",
      recipe,
      batchQuantity: 1,
      includeSpices: false,
      savedPrices: new Map(),
    });
    session.sellRate = parseRate("1/3");

    const result = calculateProfit({
      recipe,
      prices: new Map([
        ["flour", parseRate("free")],
        ["egg", parseRate("free")],
        ["milk", parseRate("free")],
        ["blueberry", parseRate("free")],
      ]),
      quantity: 1,
      overrides: new Map(
        ["flour", "egg", "milk", "blueberry"].map((n) => [
          n,
          { kind: "free" as const },
        ])
      ),
      sellRate: parseRate("1/3"),
    });

    const embeds = buildResultEmbeds({ session, result });
    const text = textOf(embeds);
    expect(text).toContain("ROI: N/A");
    expect(text).toContain("Margin:");
    expect(text).not.toContain("ROI: 100");
  });

  it("distinguishes a loss with red color and a signed negative profit", () => {
    const session = makeBareSession(1);
    session.sellRate = parseRate("1/3");
    const embeds = buildResultEmbeds({ session, result: compute(session, "1/3dl") });
    const text = textOf(embeds);

    expect(text).toContain("Profit per dish: -1797.00 WL");
    expect(embeds[0].toJSON().color).toBe(0xe74c3c);
  });

  it("colors the result by profitability or cost-only state", () => {
    const costOnly = render("Berry Crepes", makeSession("Berry Crepes", 1));
    expect(costOnly[0].toJSON().color).toBe(0x3498db);

    const profitable = makeSession("Berry Crepes", 1);
    profitable.sellRate = parseRate("1/4");
    expect(render("Berry Crepes", profitable)[0].toJSON().color).toBe(0x2ecc71);

    const losing = makeBareSession(1);
    losing.sellRate = parseRate("1/3");
    expect(
      buildResultEmbeds({ session: losing, result: compute(losing, "1/3dl") })[0].toJSON().color
    ).toBe(0xe74c3c);
  });

  it("restores heat, punch timing, and food buff info", () => {
    const session = makeSession("Berry Crepes", 1);
    session.sellRate = parseRate("1/4");
    const json = render("Berry Crepes", session)[0].toJSON();

    expect(json.description).toContain("Heat: Low");
    expect(json.description).toContain("Punch: 1m");
    expect(json.description).toContain("Buff: Surgery XP");
  });

  it("handles recipes without buff, image, or source metadata", () => {
    const session = makeBareSession(1);
    session.sellRate = parseRate("1/3");
    const embeds = buildResultEmbeds({ session, result: compute(session) });
    const json = embeds[0].toJSON();

    expect(json.description).toContain("Heat: Medium");
    expect(json.description).toContain("Punch: 30s");
    expect(json.description).not.toContain("Buff:");
    expect(json.thumbnail).toBeUndefined();
    expect(textOf(embeds)).not.toContain("http");
  });

  it("handles recipes with completely missing metadata without setting empty description", () => {
    const store = new CookSessionStore({ now: () => 1000 });
    const emptyMetaRecipe: CookingRecipe = {
      id: "empty_meta",
      name: "Empty Meta Dish",
      ingredients: [
        { id: "flour", name: "Flour", quantity: 1, timing: "0s", requirement: "required" },
      ],
      punchTiming: "",
      heatLevel: "" as any,
    };
    const session = store.create({
      guildId: "guild-1",
      channelId: "channel-1",
      userId: "user-1",
      recipe: emptyMetaRecipe,
      batchQuantity: 1,
      includeSpices: false,
      savedPrices: new Map(),
    });
    session.sellRate = parseRate("1/3");

    const embeds = buildResultEmbeds({ session, result: compute(session) });
    const json = embeds[0].toJSON();
    expect(json.description).toBeUndefined();
  });

  it("handles partial metadata with only heat level or only punch timing", () => {
    const store = new CookSessionStore({ now: () => 1000 });
    const heatOnlyRecipe: CookingRecipe = {
      id: "heat_only",
      name: "Heat Only Dish",
      ingredients: [
        { id: "flour", name: "Flour", quantity: 1, timing: "0s", requirement: "required" },
      ],
      punchTiming: "",
      heatLevel: "High",
    };
    const session1 = store.create({
      guildId: "guild-1",
      channelId: "channel-1",
      userId: "user-1",
      recipe: heatOnlyRecipe,
      batchQuantity: 1,
      includeSpices: false,
      savedPrices: new Map(),
    });
    const json1 = buildResultEmbeds({ session: session1, result: compute(session1) })[0].toJSON();
    expect(json1.description).toBe("Heat: High");

    const punchOnlyRecipe: CookingRecipe = {
      id: "punch_only",
      name: "Punch Only Dish",
      ingredients: [
        { id: "flour", name: "Flour", quantity: 1, timing: "0s", requirement: "required" },
      ],
      punchTiming: "45s",
      heatLevel: "" as any,
    };
    const session2 = store.create({
      guildId: "guild-1",
      channelId: "channel-1",
      userId: "user-1",
      recipe: punchOnlyRecipe,
      batchQuantity: 1,
      includeSpices: false,
      savedPrices: new Map(),
    });
    const json2 = buildResultEmbeds({ session: session2, result: compute(session2) })[0].toJSON();
    expect(json2.description).toBe("Punch: 45s");
  });

  it("sets the recipe sprite thumbnail when the recipe provides one", () => {
    const session = makeSession("Berry Crepes", 10);
    session.sellRate = parseRate("1/4");
    const embeds = render("Berry Crepes", session);

    for (const embed of embeds) {
      expect(embed.toJSON().thumbnail?.url).toBe(BERRY_SPRITE);
    }
  });
});

describe("Cook result details view", () => {
  it("lists every ingredient with rates, provenance, and per-batch figures", () => {
    const session = makeSession("Berry Crepes", 10);
    const text = textOf(render("Berry Crepes", session, "details"));

    expect(text).toContain("Blueberry — 1x/dish, 10x/batch");
    expect(text).toContain("200/150 WL (saved)");
    expect(text).toContain("0.75 WL each");
    expect(text).toContain("0.75/dish");
    expect(text).toContain("7.5/batch");
  });

  it("moves provenance and disclaimers behind the details view", () => {
    const session = makeSession("Berry Crepes", 10);
    const text = textOf(render("Berry Crepes", session, "details"));

    expect(text).toContain("Provenance: saved = stored /prices rate");
    expect(text).toContain("fees");
    expect(text).toContain("failure");
  });

  it("omits batch figures from details when batch quantity is one", () => {
    const session = makeSession("Berry Crepes", 1);
    const text = textOf(render("Berry Crepes", session, "details"));

    expect(text).toContain("Blueberry — 1x/dish —");
    expect(text).not.toContain("/batch");
    expect(text).not.toContain("x/batch");
  });

  it("links the recipe source and thumbnail only from recipe fields", () => {
    const session = makeSession("Berry Crepes", 10);
    const json = render("Berry Crepes", session, "details")[0].toJSON();

    expect(json.description).toContain(`Source: ${BERRY_SOURCE}`);
    expect(json.thumbnail?.url).toBe(BERRY_SPRITE);

    const bare = makeBareSession(10);
    const bareText = textOf(buildResultEmbeds({
      session: bare,
      result: compute(bare),
      view: "details",
    }));
    expect(bareText).not.toContain("http");
  });

  it("keeps long ingredient names intact across paginated detail fields", () => {
    const session = makeSession("Gingerbread Cookie", 1, true);
    const embeds = render("Gingerbread Cookie", session, "details");
    const fields = embeds.flatMap((e) => e.toJSON().fields ?? []);

    const text = fields.map((f) => f.value).join("\n");
    expect(text).toContain("Gingerbread Dough");
    expect(text).toContain("Chocolate Sprinkles Block");
    for (const field of fields) {
      expect(field.value.length).toBeLessThanOrEqual(1024);
    }
    expect(fields.length).toBeGreaterThan(1);
  });

  it("respects Discord embed payload limits for every view", () => {
    for (const recipeName of ["BBQ Bacon Burger", "Skill Spice"]) {
      for (const view of ["summary", "details"] as const) {
        const session = makeSession(recipeName, 100000, true);
        session.sellRate = parseRate("1/4");
        const embeds = render(recipeName, session, view);

        expect(embeds.length).toBeLessThanOrEqual(10);
        for (const embed of embeds) {
          const json = embed.toJSON();
          expect(json.title!.length).toBeLessThanOrEqual(256);
          expect((json.description ?? "").length).toBeLessThanOrEqual(4096);
          const fields = json.fields ?? [];
          expect(fields.length).toBeLessThanOrEqual(25);
          let used = 0;
          for (const field of fields) {
            expect(field.name.length).toBeLessThanOrEqual(256);
            expect(field.value.length).toBeLessThanOrEqual(1024);
            used += field.name.length + field.value.length;
          }
          expect(used).toBeLessThanOrEqual(6000);
        }
      }
    }
  });
});
