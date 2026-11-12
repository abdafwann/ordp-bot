import { describe, it, expect } from "vitest";
import { recipeRepository } from "../../../src/modules/profit/data/recipe.repository.js";

const TIMING_PATTERN = /^(?:\d+m(?: \d+(?:\.\d+)?s)?|\d+(?:\.\d+)?s)$/;

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

describe("Cooking Recipes Dataset", () => {
  describe("Trawlerman's Friend regression", () => {
    it("matches the wiki exactly with four ordered ingredients", () => {
      const recipe = recipeRepository.findByName("Trawlerman's Friend");
      expect(recipe).not.toBeNull();
      expect(recipe?.name).toBe("Trawlerman's Friend");
      expect(recipe?.punchTiming).toBe("1m 47s");
      expect(recipe?.heatLevel).toBe("Low");
      expect(recipe?.ingredients).toEqual([
        {
          id: "large_frozen_chunk",
          name: "Large Frozen Chunk",
          quantity: 1,
          timing: "0s",
          requirement: "required",
        },
        {
          id: "large_radioactive_bit",
          name: "Large Radioactive Bit",
          quantity: 1,
          timing: "47s",
          requirement: "required",
        },
        {
          id: "cobweb",
          name: "Cobweb",
          quantity: 1,
          timing: "1m 17s",
          requirement: "required",
        },
        {
          id: "pumpkin_candy",
          name: "Pumpkin Candy",
          quantity: 1,
          timing: "1m 40s",
          requirement: "required",
        },
      ]);
    });
  });

  describe("Chips And Guacamole regression", () => {
    it("matches the wiki exactly with six ordered ingredients", () => {
      const recipe = recipeRepository.findByName("Chips And Guacamole");
      expect(recipe).not.toBeNull();
      expect(recipe?.name).toBe("Chips And Guacamole");
      expect(recipe?.punchTiming).toBe("1m 6s");
      expect(recipe?.heatLevel).toBe("Low");
      expect(recipe?.ingredients).toEqual([
        {
          id: "salsa",
          name: "Salsa",
          quantity: 1,
          timing: "0s",
          requirement: "required",
        },
        {
          id: "water_bucket",
          name: "Water Bucket",
          quantity: 1,
          timing: "0s",
          requirement: "required",
        },
        {
          id: "corn_meal",
          name: "Corn Meal",
          quantity: 1,
          timing: "0s",
          requirement: "required",
        },
        {
          id: "lemon",
          name: "Lemon",
          quantity: 1,
          timing: "1m 5s",
          requirement: "required",
        },
        {
          id: "avocado",
          name: "Avocado",
          quantity: 1,
          timing: "1m 5s",
          requirement: "required",
        },
        {
          id: "salt",
          name: "Salt",
          quantity: 2,
          timing: "Anytime",
          requirement: "optional",
          notes: "optional spice",
        },
      ]);
    });
  });

  describe("dataset integrity", () => {
    const recipes = recipeRepository.getAll();

    it("contains at least forty recipes", () => {
      expect(recipes.length).toBeGreaterThanOrEqual(40);
    });

    it("caps ingredient counts to keep worksheet pagination within one button row", () => {
      for (const recipe of recipes) {
        expect(
          recipe.ingredients.length <= 25,
          `${recipe.id} has ${recipe.ingredients.length} ingredients`
        ).toBe(true);
      }
    });

    it("has unique case-insensitive recipe ids", () => {
      const ids = recipes.map((r) => r.id.toLowerCase());
      expect(new Set(ids).size).toBe(ids.length);
    });

    it("has unique case-insensitive recipe names", () => {
      const names = recipes.map((r) => r.name.toLowerCase());
      expect(new Set(names).size).toBe(names.length);
    });

    it("has non-empty recipe ids and names", () => {
      for (const recipe of recipes) {
        expect(isNonEmptyString(recipe.id), recipe.id).toBe(true);
        expect(isNonEmptyString(recipe.name), recipe.id).toBe(true);
      }
    });

    it("has valid heat levels", () => {
      const validHeats = new Set(["Low", "Medium", "High"]);
      for (const recipe of recipes) {
        expect(
          validHeats.has(recipe.heatLevel),
          `${recipe.id} heatLevel ${recipe.heatLevel}`
        ).toBe(true);
      }
    });

    it("has non-empty ingredient lists with non-empty ids and names", () => {
      for (const recipe of recipes) {
        expect(recipe.ingredients.length, recipe.id).toBeGreaterThan(0);
        for (const ingredient of recipe.ingredients) {
          expect(isNonEmptyString(ingredient.id), recipe.id).toBe(true);
          expect(isNonEmptyString(ingredient.name), recipe.id).toBe(true);
        }
      }
    });

    it("has positive finite integer ingredient quantities", () => {
      for (const recipe of recipes) {
        for (const ingredient of recipe.ingredients) {
          expect(
            Number.isFinite(ingredient.quantity) &&
              Number.isInteger(ingredient.quantity) &&
              ingredient.quantity > 0,
            `${recipe.id}/${ingredient.id} quantity ${ingredient.quantity}`
          ).toBe(true);
        }
      }
    });

    it("has valid ingredient requirements", () => {
      const validRequirements = new Set(["required", "optional"]);
      for (const recipe of recipes) {
        for (const ingredient of recipe.ingredients) {
          expect(
            validRequirements.has(ingredient.requirement),
            `${recipe.id}/${ingredient.id} requirement ${ingredient.requirement}`
          ).toBe(true);
        }
      }
    });

    it("has well-formed punch timings without Anytime", () => {
      for (const recipe of recipes) {
        expect(
          TIMING_PATTERN.test(recipe.punchTiming) &&
            recipe.punchTiming !== "Anytime",
          `${recipe.id} punchTiming ${recipe.punchTiming}`
        ).toBe(true);
      }
    });

    it("has well-formed ingredient timings allowing Anytime", () => {
      for (const recipe of recipes) {
        for (const ingredient of recipe.ingredients) {
          expect(
            ingredient.timing === "Anytime" ||
              TIMING_PATTERN.test(ingredient.timing),
            `${recipe.id}/${ingredient.id} timing ${ingredient.timing}`
          ).toBe(true);
        }
      }
    });
  });

  describe("quantity ranges", () => {
    const recipes = recipeRepository.getAll();

    it("represents Detective Butter Lamb sugar as the wiki range 2-3", () => {
      const recipe = recipeRepository.findByName("Detective Butter Lamb");
      expect(recipe).not.toBeNull();
      const sugar = recipe?.ingredients.find((i) => i.id === "sugar");
      expect(sugar?.requirement).toBe("required");
      expect(sugar?.quantity).toBe(2);
      expect(sugar?.quantityRange).toEqual({ min: 2, max: 3 });
    });

    it("represents Failed Butter Lamb sugar as the wiki range 2-3", () => {
      const recipe = recipeRepository.findByName("Failed Butter Lamb");
      expect(recipe).not.toBeNull();
      const sugar = recipe?.ingredients.find((i) => i.id === "sugar");
      expect(sugar?.requirement).toBe("required");
      expect(sugar?.quantity).toBe(2);
      expect(sugar?.quantityRange).toEqual({ min: 2, max: 3 });
    });

    it("marks exactly the two butter lamb sugar ingredients as ranged", () => {
      const ranged = recipes.flatMap((r) =>
        r.ingredients
          .filter((i) => i.quantityRange !== undefined)
          .map((i) => `${r.id}/${i.id}`)
      );
      expect(ranged.sort()).toEqual([
        "detective_butter_lamb/sugar",
        "failed_butter_lamb/sugar",
      ]);
    });

    it("keeps every range well-formed with a positive integer min and max", () => {
      for (const recipe of recipes) {
        for (const ingredient of recipe.ingredients) {
          const range = ingredient.quantityRange;
          if (!range) continue;
          expect(
            Number.isInteger(range.min) &&
              Number.isInteger(range.max) &&
              range.min >= 1 &&
              range.min <= range.max &&
              range.max <= 1000,
            `${recipe.id}/${ingredient.id} range ${range.min}-${range.max}`
          ).toBe(true);
          expect(ingredient.quantity).toBe(range.min);
        }
      }
    });
  });
});
