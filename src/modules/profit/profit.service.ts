import { prisma } from "../../core/db.js";
import { recipeRepository, RecipeRepository } from "./data/recipe.repository.js";
import { parseRate } from "./domain/rate.js";
import { parseOverrides } from "./domain/overrides.js";
import { calculateProfit } from "./domain/calculate.js";
import { CookingRecipe, ParsedRate, ProfitResult } from "./domain/types.js";
import { MissingPricesError, RecipeNotFoundError } from "./domain/errors.js";

export type CookExecutionResult =
  | {
      status: "success";
      recipe: CookingRecipe;
      quantity: number;
      profit: ProfitResult;
    }
  | {
      status: "missing_prices";
      recipe: CookingRecipe;
      missing: string[];
      suggestedCommands: string[];
    };

export class ProfitService {
  constructor(private readonly recipes: RecipeRepository = recipeRepository) {}

  getRecipe(nameOrId: string): CookingRecipe | null {
    return this.recipes.findByName(nameOrId);
  }

  searchRecipes(query: string, limit = 25): CookingRecipe[] {
    return this.recipes.search(query, limit);
  }

  getAllRecipes(): readonly CookingRecipe[] {
    return this.recipes.getAll();
  }

  getAllIngredientNames(): string[] {
    return this.recipes.getAllIngredientNames();
  }

  async getPrice(guildId: string, ingredientName: string) {
    return prisma.ingredientPrice.findUnique({
      where: {
        guildId_name: {
          guildId,
          name: ingredientName.toLowerCase().trim(),
        },
      },
    });
  }

  async listPrices(guildId: string) {
    return prisma.ingredientPrice.findMany({
      where: { guildId },
      orderBy: { name: "asc" },
    });
  }

  async setPrice(guildId: string, ingredientName: string, rateStr: string, userId: string) {
    const parsed = parseRate(rateStr);
    const name = ingredientName.toLowerCase().trim();

    return prisma.ingredientPrice.upsert({
      where: {
        guildId_name: { guildId, name },
      },
      create: {
        guildId,
        name,
        items: parsed.rate ? parsed.rate.items : 1,
        wl: parsed.rate ? parsed.rate.wl : 0,
        currency: parsed.rate ? parsed.rate.currency : "WL",
        updatedBy: userId,
      },
      update: {
        items: parsed.rate ? parsed.rate.items : 1,
        wl: parsed.rate ? parsed.rate.wl : 0,
        currency: parsed.rate ? parsed.rate.currency : "WL",
        updatedBy: userId,
      },
    });
  }

  async removePrice(guildId: string, ingredientName: string): Promise<boolean> {
    try {
      await prisma.ingredientPrice.delete({
        where: {
          guildId_name: {
            guildId,
            name: ingredientName.toLowerCase().trim(),
          },
        },
      });
      return true;
    } catch {
      return false;
    }
  }

  async cook(params: {
    guildId: string;
    dishName: string;
    sellRateStr?: string;
    quantity?: number;
    includeSpices?: boolean;
    overridesStr?: string;
  }): Promise<CookExecutionResult> {
    const { guildId, dishName, sellRateStr, quantity = 1, includeSpices = false, overridesStr } = params;

    const recipe = this.recipes.findByName(dishName);
    if (!recipe) {
      throw new RecipeNotFoundError(dishName);
    }

    const overrides = parseOverrides(overridesStr);
    const sellRate = sellRateStr ? parseRate(sellRateStr) : null;

    const ingredientNames = recipe.ingredients.map((i) => i.name.toLowerCase());
    const dbPrices = await prisma.ingredientPrice.findMany({
      where: {
        guildId,
        name: { in: ingredientNames },
      },
    });

    const pricesMap = new Map<string, ParsedRate>();
    for (const p of dbPrices) {
      pricesMap.set(p.name, {
        isFree: p.wl === 0,
        rate: {
          items: p.items,
          wl: p.wl,
          currency: p.currency as "WL" | "DL" | "BGL",
        },
      });
    }

    try {
      const profit = calculateProfit({
        recipe,
        prices: pricesMap,
        includeSpices,
        overrides,
        sellRate,
        quantity,
      });

      return {
        status: "success",
        recipe,
        quantity,
        profit,
      };
    } catch (err) {
      if (err instanceof MissingPricesError) {
        const suggestedCommands = err.missing.map(
          (m) => `/prices set ingredient:${m} rate:<rate>`
        );
        return {
          status: "missing_prices",
          recipe,
          missing: err.missing,
          suggestedCommands,
        };
      }
      throw err;
    }
  }
}

export const profitService = new ProfitService();
