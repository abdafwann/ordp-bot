import { describe, it, expect } from "vitest";
import { recipeRepository } from "../../../src/modules/profit/data/recipe.repository.js";

describe("Recipe Repository", () => {
  it("should load recipes from seeded json", () => {
    const all = recipeRepository.getAll();
    expect(all.length).toBeGreaterThanOrEqual(5);
  });

  it("should find recipe by exact id or case-insensitive name", () => {
    const r1 = recipeRepository.findByName("Berry Crepes");
    expect(r1).not.toBeNull();
    expect(r1?.id).toBe("berry_crepes");

    const r2 = recipeRepository.findByName("pizza");
    expect(r2).not.toBeNull();
    expect(r2?.name).toBe("Pizza");
  });

  it("should search recipes by substring for autocomplete", () => {
    const matches = recipeRepository.search("piz");
    expect(matches.length).toBeGreaterThanOrEqual(1);
    expect(matches[0].name).toBe("Pizza");
  });

  it("should collect all unique ingredient names", () => {
    const names = recipeRepository.getAllIngredientNames();
    expect(names).toContain("Dough");
    expect(names).toContain("Cheese");
  });
});
