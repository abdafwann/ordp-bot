import { describe, it, expect } from "vitest";
import {
  WL_PER_DL,
  DL_PER_BGL,
  WL_PER_BGL,
  CURRENCY_MULTIPLIER,
} from "../../../src/modules/profit/domain/constants.js";
import {
  DomainError,
  InvalidRateError,
  RecipeNotFoundError,
  MissingPricesError,
  InvalidQuantityError,
  MissingQuantityChoiceError,
  CalculationOverflowError,
} from "../../../src/modules/profit/domain/errors.js";

describe("Profit Domain Constants & Errors", () => {
  it("should define correct Growtopia currency multipliers", () => {
    expect(WL_PER_DL).toBe(200);
    expect(DL_PER_BGL).toBe(200);
    expect(WL_PER_BGL).toBe(40000);
    expect(CURRENCY_MULTIPLIER.WL).toBe(1);
    expect(CURRENCY_MULTIPLIER.DL).toBe(200);
    expect(CURRENCY_MULTIPLIER.BGL).toBe(40000);
  });

  it("should instantiate domain errors correctly", () => {
    const rateErr = new InvalidRateError("Bad rate");
    expect(rateErr).toBeInstanceOf(DomainError);
    expect(rateErr.message).toBe("Bad rate");

    const recipeErr = new RecipeNotFoundError("Pizza");
    expect(recipeErr.message).toContain("Pizza");

    const missingErr = new MissingPricesError(["dough", "tomato"]);
    expect(missingErr.missing).toEqual(["dough", "tomato"]);

    const qtyErr = new InvalidQuantityError("Quantity must be an integer.");
    expect(qtyErr).toBeInstanceOf(DomainError);
    expect(qtyErr.message).toBe("Quantity must be an integer.");

    const choiceErr = new MissingQuantityChoiceError("Sugar", { min: 2, max: 3 });
    expect(choiceErr).toBeInstanceOf(DomainError);
    expect(choiceErr.message).toContain("Sugar");
    expect(choiceErr.message).toContain("2-3");

    const overflowErr = new CalculationOverflowError();
    expect(overflowErr).toBeInstanceOf(DomainError);
  });
});
