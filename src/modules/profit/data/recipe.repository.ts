import { CookingRecipe } from "../domain/types.js";
import recipesData from "./cooking-recipes.json" with { type: "json" };

export class RecipeRepository {
  private readonly recipes: readonly CookingRecipe[];
  private readonly recipesById: Map<string, CookingRecipe>;
  private readonly recipesByName: Map<string, CookingRecipe>;

  constructor(recipes: readonly CookingRecipe[] = recipesData as CookingRecipe[]) {
    this.recipes = recipes;
    this.recipesById = new Map();
    this.recipesByName = new Map();

    for (const r of this.recipes) {
      this.recipesById.set(r.id.toLowerCase(), r);
      this.recipesByName.set(r.name.toLowerCase(), r);
    }
  }

  getAll(): readonly CookingRecipe[] {
    return this.recipes;
  }

  getById(id: string): CookingRecipe | null {
    return this.recipesById.get(id.toLowerCase()) ?? null;
  }

  findByName(name: string): CookingRecipe | null {
    const trimmed = name.trim().toLowerCase();
    return this.recipesByName.get(trimmed) ?? this.recipesById.get(trimmed) ?? null;
  }

  search(query: string, limit = 25): CookingRecipe[] {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) {
      return this.recipes.slice(0, limit);
    }
    const matches = this.recipes.filter(
      (r) => r.name.toLowerCase().includes(trimmed) || r.id.toLowerCase().includes(trimmed)
    );
    return matches.slice(0, limit);
  }

  getAllIngredientNames(): string[] {
    const set = new Set<string>();
    for (const r of this.recipes) {
      for (const ing of r.ingredients) {
        set.add(ing.name);
      }
    }
    return Array.from(set).sort();
  }
}

export const recipeRepository = new RecipeRepository();
