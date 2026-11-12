import { describe, it, expect } from "vitest";
import {
  formatIngredientQuantity,
  hasQuantityRange,
  resolveIngredientQuantity,
  validateBatchQuantity,
  MAX_BATCH_QUANTITY,
} from "../../../../src/modules/profit/domain/quantity.js";
import { RecipeIngredient } from "../../../../src/modules/profit/domain/types.js";
import {
  InvalidQuantityError,
  MissingQuantityChoiceError,
} from "../../../../src/modules/profit/domain/errors.js";

function scalarIngredient(overrides?: Partial<RecipeIngredient>): RecipeIngredient {
  return {
    id: "flour",
    name: "Flour",
    quantity: 1,
    timing: "0s",
    requirement: "required",
    ...overrides,
  };
}

function rangeIngredient(overrides?: Partial<RecipeIngredient>): RecipeIngredient {
  return {
    id: "sugar",
    name: "Sugar",
    quantity: 2,
    quantityRange: { min: 2, max: 3 },
    timing: "Anytime",
    requirement: "required",
    ...overrides,
  };
}

describe("Ingredient quantity helpers", () => {
  it("detects range ingredients", () => {
    expect(hasQuantityRange(scalarIngredient())).toBe(false);
    expect(hasQuantityRange(rangeIngredient())).toBe(true);
  });

  it("formats scalar quantities exactly", () => {
    expect(formatIngredientQuantity(scalarIngredient())).toBe("1");
    expect(formatIngredientQuantity(scalarIngredient({ quantity: 2 }))).toBe("2");
  });

  it("formats range quantities as min-max", () => {
    expect(formatIngredientQuantity(rangeIngredient())).toBe("2-3");
  });

  it("resolves scalar quantities without choices", () => {
    expect(resolveIngredientQuantity(scalarIngredient())).toBe(1);
    expect(resolveIngredientQuantity(scalarIngredient(), new Map())).toBe(1);
  });

  it("resolves range quantities from an explicit choice", () => {
    const choices = new Map([["sugar", 3]]);
    expect(resolveIngredientQuantity(rangeIngredient(), choices)).toBe(3);
    const choices2 = new Map([["sugar", 2]]);
    expect(resolveIngredientQuantity(rangeIngredient(), choices2)).toBe(2);
  });

  it("rejects range ingredients without a choice", () => {
    expect(() => resolveIngredientQuantity(rangeIngredient())).toThrow(
      MissingQuantityChoiceError
    );
    try {
      resolveIngredientQuantity(rangeIngredient());
    } catch (err) {
      expect((err as MissingQuantityChoiceError).message).toContain("Sugar");
      expect((err as MissingQuantityChoiceError).message).toContain("2-3");
    }
  });

  it("rejects out-of-range or non-integer range choices", () => {
    expect(() =>
      resolveIngredientQuantity(rangeIngredient(), new Map([["sugar", 1]]))
    ).toThrow(InvalidQuantityError);
    expect(() =>
      resolveIngredientQuantity(rangeIngredient(), new Map([["sugar", 4]]))
    ).toThrow(InvalidQuantityError);
    expect(() =>
      resolveIngredientQuantity(rangeIngredient(), new Map([["sugar", 2.5]]))
    ).toThrow(InvalidQuantityError);
  });

  it("validates batch quantities without clamping", () => {
    expect(MAX_BATCH_QUANTITY).toBe(100000);
    expect(() => validateBatchQuantity(0)).toThrow(InvalidQuantityError);
    expect(() => validateBatchQuantity(-5)).toThrow(InvalidQuantityError);
    expect(() => validateBatchQuantity(2.5)).toThrow(InvalidQuantityError);
    expect(() => validateBatchQuantity(100001)).toThrow(InvalidQuantityError);
    expect(() => validateBatchQuantity(Number.NaN)).toThrow(InvalidQuantityError);
    expect(() => validateBatchQuantity(Number.POSITIVE_INFINITY)).toThrow(
      InvalidQuantityError
    );
    expect(() => validateBatchQuantity(1)).not.toThrow();
    expect(() => validateBatchQuantity(100000)).not.toThrow();
  });
});
