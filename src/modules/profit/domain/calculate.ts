import { CookingRecipe, IngredientCostBreakdown, ParsedRate, ProfitResult } from "./types.js";
import { pricePerItemWl } from "./rate.js";
import { OverrideAction } from "./overrides.js";
import { MissingPricesError, CalculationOverflowError } from "./errors.js";
import {
  resolveIngredientQuantity,
  validateBatchQuantity,
} from "./quantity.js";

export interface CalculateProfitParams {
  recipe: CookingRecipe;
  prices: Map<string, ParsedRate>; // Keyed by lowercase ingredient name/id
  includeSpices?: boolean;
  overrides?: Map<string, OverrideAction>;
  sellRate?: ParsedRate | null;
  quantity?: number;
  rangeChoices?: ReadonlyMap<string, number>;
}

function assertFinite(value: number): number {
  if (!Number.isFinite(value)) {
    throw new CalculationOverflowError();
  }
  return value;
}

export function calculateProfit(params: CalculateProfitParams): ProfitResult {
  const {
    recipe,
    prices,
    includeSpices = false,
    overrides = new Map(),
    sellRate = null,
    quantity = 1,
    rangeChoices,
  } = params;

  validateBatchQuantity(quantity);

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

    const resolvedQuantity = resolveIngredientQuantity(ingredient, rangeChoices);
    const unitCostWl = assertFinite(pricePerItemWl(effectiveRate));
    const totalCostWl = assertFinite(unitCostWl * resolvedQuantity);
    modalPerMasakanWl = assertFinite(modalPerMasakanWl + totalCostWl);

    breakdown.push({
      id: ingredient.id,
      name: ingredient.name,
      quantity: resolvedQuantity,
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

  const totalModalWl = assertFinite(modalPerMasakanWl * quantity);

  const sellPricePerMasakanWl = sellRate ? assertFinite(pricePerItemWl(sellRate)) : null;
  const totalRevenueWl =
    sellPricePerMasakanWl !== null
      ? assertFinite(sellPricePerMasakanWl * quantity)
      : null;

  const profitPerMasakanWl =
    sellPricePerMasakanWl !== null
      ? assertFinite(sellPricePerMasakanWl - modalPerMasakanWl)
      : null;
  const totalProfitWl =
    profitPerMasakanWl !== null
      ? assertFinite(profitPerMasakanWl * quantity)
      : null;

  let marginPercent: number | null = null;
  if (profitPerMasakanWl !== null && sellPricePerMasakanWl !== null && sellPricePerMasakanWl > 0) {
    marginPercent = assertFinite((profitPerMasakanWl / sellPricePerMasakanWl) * 100);
  }

  let roiPercent: number | null = null;
  if (profitPerMasakanWl !== null && modalPerMasakanWl > 0) {
    roiPercent = assertFinite((profitPerMasakanWl / modalPerMasakanWl) * 100);
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
