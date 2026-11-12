import { describe, it, expect } from "vitest";
import { calculateProfit } from "../../../src/modules/profit/domain/calculate.js";
import { CookingRecipe, ParsedRate } from "../../../src/modules/profit/domain/types.js";
import { parseRate } from "../../../src/modules/profit/domain/rate.js";
import {
  CalculationOverflowError,
  InvalidQuantityError,
  MissingQuantityChoiceError,
} from "../../../src/modules/profit/domain/errors.js";

describe("Profit Calculator Engine", () => {
  const mockRecipe: CookingRecipe = {
    id: "pizza",
    name: "Pizza",
    heatLevel: "Medium",
    punchTiming: "1m 30s",
    ingredients: [
      { id: "dough", name: "Dough", quantity: 2, timing: "0s", requirement: "required" },
      { id: "cheese", name: "Cheese", quantity: 1, timing: "10s", requirement: "required" },
      { id: "pepper", name: "Pepper", quantity: 1, timing: "Anytime", requirement: "optional" },
    ],
  };

  it("should calculate modal, profit, margin, and ROI accurately", () => {
    const prices = new Map([
      ["dough", parseRate("200/150")], // 0.75 WL each * 2 = 1.5 WL
      ["cheese", parseRate("100/50")], // 0.50 WL each * 1 = 0.5 WL
    ]);

    const result = calculateProfit({
      recipe: mockRecipe,
      prices,
      includeSpices: false,
      sellRate: parseRate("1/3"), // 3.0 WL sell price
      quantity: 1,
    });

    // Modal = 1.5 + 0.5 = 2.0 WL
    expect(result.modalPerMasakanWl).toBe(2.0);
    expect(result.totalModalWl).toBe(2.0);
    expect(result.sellPricePerMasakanWl).toBe(3.0);
    expect(result.profitPerMasakanWl).toBe(1.0);
    expect(result.totalProfitWl).toBe(1.0);
    expect(result.marginPercent).toBeCloseTo(33.33, 1);
    expect(result.roiPercent).toBeCloseTo(50.0, 1);
    expect(result.breakdown).toHaveLength(2); // pepper was excluded
  });

  it("should handle optional spice inclusion and free overrides", () => {
    const prices = new Map([
      ["dough", parseRate("200/150")],
      ["cheese", parseRate("100/50")],
      ["pepper", parseRate("100/20")], // 0.20 WL each * 1 = 0.2 WL
    ]);

    const result = calculateProfit({
      recipe: mockRecipe,
      prices,
      includeSpices: true, // pepper included
      overrides: new Map([["dough", { kind: "free" }]]), // dough is free (0 WL)
      sellRate: parseRate("1/2"), // 2.0 WL sell price
      quantity: 5,
    });

    // Modal = 0 (dough) + 0.5 (cheese) + 0.2 (pepper) = 0.7 WL per dish
    expect(result.modalPerMasakanWl).toBe(0.7);
    expect(result.totalModalWl).toBe(3.5);
    expect(result.totalRevenueWl).toBe(10.0);
    expect(result.totalProfitWl).toBe(6.5);
    expect(result.breakdown).toHaveLength(3);
  });

  it("should return null for profit metrics when sellRate is omitted", () => {
    const prices = new Map([
      ["dough", parseRate("200/150")],
      ["cheese", parseRate("100/50")],
    ]);

    const result = calculateProfit({
      recipe: mockRecipe,
      prices,
      includeSpices: false,
      quantity: 1,
    });

    expect(result.modalPerMasakanWl).toBe(2.0);
    expect(result.sellPricePerMasakanWl).toBeNull();
    expect(result.profitPerMasakanWl).toBeNull();
    expect(result.marginPercent).toBeNull();
    expect(result.roiPercent).toBeNull();
  });

  it("should reject batch quantities outside 1..100000 without clamping", () => {
    const prices = new Map([
      ["dough", parseRate("200/150")],
      ["cheese", parseRate("100/50")],
    ]);

    expect(() =>
      calculateProfit({ recipe: mockRecipe, prices, quantity: 0 })
    ).toThrow(InvalidQuantityError);
    expect(() =>
      calculateProfit({ recipe: mockRecipe, prices, quantity: 100001 })
    ).toThrow(InvalidQuantityError);
    expect(() =>
      calculateProfit({ recipe: mockRecipe, prices, quantity: 2.5 })
    ).toThrow(InvalidQuantityError);
    expect(() =>
      calculateProfit({ recipe: mockRecipe, prices, quantity: 100000 })
    ).not.toThrow();
  });

  it("should require and apply explicit range ingredient choices", () => {
    const rangeRecipe: CookingRecipe = {
      id: "lamb",
      name: "Butter Lamb",
      heatLevel: "Low",
      punchTiming: "1m 12.5s",
      ingredients: [
        { id: "milk", name: "Milk", quantity: 1, timing: "39.5s", requirement: "required" },
        {
          id: "sugar",
          name: "Sugar",
          quantity: 2,
          quantityRange: { min: 2, max: 3 },
          timing: "Anytime",
          requirement: "required",
        },
      ],
    };

    const prices = new Map<string, ParsedRate>([
      ["milk", parseRate("100/100")],
      ["sugar", parseRate("100/100")],
    ]);

    expect(() =>
      calculateProfit({ recipe: rangeRecipe, prices, quantity: 1 })
    ).toThrow(MissingQuantityChoiceError);

    const result = calculateProfit({
      recipe: rangeRecipe,
      prices,
      quantity: 1,
      rangeChoices: new Map([["sugar", 3]]),
    });

    expect(result.modalPerMasakanWl).toBe(1 + 3);
    const sugarRow = result.breakdown.find((b) => b.id === "sugar");
    expect(sugarRow?.quantity).toBe(3);
  });

  it("should reject invalid range choices for range ingredients", () => {
    const rangeRecipe: CookingRecipe = {
      id: "lamb",
      name: "Butter Lamb",
      heatLevel: "Low",
      punchTiming: "1m 12.5s",
      ingredients: [
        {
          id: "sugar",
          name: "Sugar",
          quantity: 2,
          quantityRange: { min: 2, max: 3 },
          timing: "Anytime",
          requirement: "required",
        },
      ],
    };

    const prices = new Map<string, ParsedRate>([["sugar", parseRate("100/100")]]);

    expect(() =>
      calculateProfit({
        recipe: rangeRecipe,
        prices,
        quantity: 1,
        rangeChoices: new Map([["sugar", 5]]),
      })
    ).toThrow(InvalidQuantityError);
  });

  it("should throw CalculationOverflowError when totals exceed finite bounds", () => {
    const hugeRate: ParsedRate = {
      isFree: false,
      rate: { items: 1, wl: 1e308, currency: "WL" },
    };
    const prices = new Map<string, ParsedRate>([["dough", hugeRate]]);

    expect(() =>
      calculateProfit({ recipe: mockRecipe, prices, quantity: 100000 })
    ).toThrow(CalculationOverflowError);
  });

  it("should reject non-finite margin and ROI instead of returning Infinity", () => {
    const tinyRate: ParsedRate = {
      isFree: false,
      rate: { items: 1, wl: 1e-300, currency: "WL" },
    };
    const prices = new Map<string, ParsedRate>([
      ["dough", tinyRate],
      ["cheese", tinyRate],
    ]);

    expect(() =>
      calculateProfit({
        recipe: mockRecipe,
        prices,
        quantity: 1,
        sellRate: {
          isFree: false,
          rate: { items: 1, wl: 1e300, currency: "WL" },
        },
      })
    ).toThrow(CalculationOverflowError);
  });
});
