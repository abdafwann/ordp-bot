import { CookingRecipe, IngredientCostBreakdown, ParsedRate, ProfitResult } from "./types.js";
import { pricePerItemWl } from "./rate.js";
import { OverrideAction } from "./overrides.js";
import { MissingPricesError } from "./errors.js";

export interface CalculateProfitParams {
  recipe: CookingRecipe;
  prices: Map<string, ParsedRate>; // Keyed by lowercase ingredient name/id
  includeSpices?: boolean;
  overrides?: Map<string, OverrideAction>;
  sellRate?: ParsedRate | null;
  quantity?: number;
}

export function calculateProfit(params: CalculateProfitParams): ProfitResult {
  const {
    recipe,
    prices,
    includeSpices = false,
    overrides = new Map(),
    sellRate = null,
    quantity = 1,
  } = params;

  const missingPrices: string[] = [];
  const breakdown: IngredientCostBreakdown[] = [];
  let modalPerMasakanWl = 0;

  for (const ingredient of recipe.ingredients) {
    const key = ingredient.name.toLowerCase();
    const override = overrides.get(key) || overrides.get(ingredient.id.toLowerCase());

    let isIncluded = ingredient.requirement === "required";
    if (ingredient.requirement === "optional") {
      isIncluded = includeSpices;
    }
    if (override?.kind === "include") isIncluded = true;
    if (override?.kind === "skip") isIncluded = false;

    if (!isIncluded) {
      continue;
    }

    let effectiveRate: ParsedRate;
    if (override?.kind === "free") {
      effectiveRate = { isFree: true, rate: null };
    } else if (override?.kind === "rate") {
      effectiveRate = override.parsedRate;
    } else {
      const dbPrice = prices.get(key) || prices.get(ingredient.id.toLowerCase());
      if (!dbPrice) {
        missingPrices.push(ingredient.name);
        continue;
      }
      effectiveRate = dbPrice;
    }

    const unitCostWl = pricePerItemWl(effectiveRate);
    const totalCostWl = unitCostWl * ingredient.quantity;
    modalPerMasakanWl += totalCostWl;

    breakdown.push({
      id: ingredient.id,
      name: ingredient.name,
      quantity: ingredient.quantity,
      requirement: ingredient.requirement,
      isFree: effectiveRate.isFree,
      rate: effectiveRate.rate,
      unitCostWl,
      totalCostWl,
    });
  }

  if (missingPrices.length > 0) {
    throw new MissingPricesError(missingPrices);
  }

  const batchQty = Math.max(1, quantity);
  const totalModalWl = modalPerMasakanWl * batchQty;

  const sellPricePerMasakanWl = sellRate ? pricePerItemWl(sellRate) : null;
  const totalRevenueWl = sellPricePerMasakanWl !== null ? sellPricePerMasakanWl * batchQty : null;

  const profitPerMasakanWl =
    sellPricePerMasakanWl !== null ? sellPricePerMasakanWl - modalPerMasakanWl : null;
  const totalProfitWl = profitPerMasakanWl !== null ? profitPerMasakanWl * batchQty : null;

  let marginPercent: number | null = null;
  if (profitPerMasakanWl !== null && sellPricePerMasakanWl !== null && sellPricePerMasakanWl > 0) {
    marginPercent = (profitPerMasakanWl / sellPricePerMasakanWl) * 100;
  }

  let roiPercent: number | null = null;
  if (profitPerMasakanWl !== null && modalPerMasakanWl > 0) {
    roiPercent = (profitPerMasakanWl / modalPerMasakanWl) * 100;
  }

  return {
    modalPerMasakanWl,
    totalModalWl,
    sellPricePerMasakanWl,
    totalRevenueWl,
    profitPerMasakanWl,
    totalProfitWl,
    marginPercent,
    roiPercent,
    breakdown,
  };
}
