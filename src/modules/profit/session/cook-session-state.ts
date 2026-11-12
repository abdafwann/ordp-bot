import {
  CookingRecipe,
  IngredientQuantityRange,
  ParsedRate,
  ProfitResult,
  RecipeIngredient,
} from "../domain/types.js";
import { parseRate } from "../domain/rate.js";
import { calculateProfit } from "../domain/calculate.js";
import {
  collectRangeIngredients,
  formatIngredientQuantity,
  hasQuantityRange,
  resolveIngredientQuantity,
} from "../domain/quantity.js";
import {
  CalculationOverflowError,
  MissingPricesError,
  MissingQuantityChoiceError,
} from "../domain/errors.js";
import {
  CookRateDraft,
  CookSession,
} from "./cook-session.js";

export type RateSource = "saved" | "temporary" | "free" | "missing" | "invalid";

export interface IngredientRateStatus {
  readonly ingredient: RecipeIngredient;
  readonly included: boolean;
  readonly quantityLabel: string;
  readonly range: IngredientQuantityRange | null;
  readonly rangeChoice: number | null;
  readonly source: RateSource;
  readonly effectiveRate: ParsedRate | null;
  readonly savedRate: ParsedRate | null;
  readonly draft: CookRateDraft | null;
}

export interface SellRateStatus {
  readonly rate: ParsedRate | null;
  readonly draft: CookRateDraft | null;
  readonly fromSlash: boolean;
  readonly invalid: boolean;
}

export type CookBlocker =
  | { kind: "invalid_rates"; names: readonly string[] }
  | { kind: "missing_rates"; names: readonly string[] }
  | { kind: "missing_range_choice"; names: readonly string[] }
  | { kind: "invalid_sell" }
  | { kind: "overflow" };

export interface CookWorksheetModel {
  readonly included: readonly IngredientRateStatus[];
  readonly excluded: readonly IngredientRateStatus[];
  readonly sell: SellRateStatus;
  readonly pages: readonly (readonly RecipeIngredient[])[];
  readonly blockers: readonly CookBlocker[];
  readonly modalPerDishWl: number | null;
}

export const INGREDIENTS_PER_MODAL = 5;

function buildIngredientStatus(
  ingredient: RecipeIngredient,
  session: CookSession,
  included: boolean
): IngredientRateStatus {
  const key = ingredient.id.toLowerCase();
  const draft = session.rateDrafts.get(key) ?? null;
  const savedRate =
    session.savedPrices.get(ingredient.name.toLowerCase()) ??
    session.savedPrices.get(key) ??
    null;

  let source: RateSource;
  let effectiveRate: ParsedRate | null;
  if (draft && draft.error) {
    source = "invalid";
    effectiveRate = null;
  } else if (draft?.parsed) {
    source = draft.parsed.isFree ? "free" : "temporary";
    effectiveRate = draft.parsed;
  } else if (savedRate) {
    source = savedRate.isFree ? "free" : "saved";
    effectiveRate = savedRate;
  } else {
    source = "missing";
    effectiveRate = null;
  }

  const range = ingredient.quantityRange ?? null;
  const rangeChoice = session.rangeChoices.get(key) ?? null;
  let quantityLabel: string;
  if (range && rangeChoice === null) {
    quantityLabel = formatIngredientQuantity(ingredient);
  } else if (range) {
    quantityLabel = String(rangeChoice);
  } else {
    quantityLabel = formatIngredientQuantity(ingredient);
  }

  return {
    ingredient,
    included,
    quantityLabel,
    range,
    rangeChoice,
    source,
    effectiveRate,
    savedRate,
    draft,
  };
}

export function buildWorksheetModel(session: CookSession): CookWorksheetModel {
  const includedStatuses: IngredientRateStatus[] = [];
  const excludedStatuses: IngredientRateStatus[] = [];

  for (const ingredient of session.recipe.ingredients) {
    const isIncluded =
      ingredient.requirement === "required" || session.includeSpices;
    const status = buildIngredientStatus(ingredient, session, isIncluded);
    if (isIncluded) {
      includedStatuses.push(status);
    } else {
      excludedStatuses.push(status);
    }
  }

  const pages: RecipeIngredient[][] = [];
  for (let i = 0; i < includedStatuses.length; i += INGREDIENTS_PER_MODAL) {
    pages.push(includedStatuses.slice(i, i + INGREDIENTS_PER_MODAL).map((s) => s.ingredient));
  }

  const invalidNames = includedStatuses
    .filter((s) => s.source === "invalid")
    .map((s) => s.ingredient.name);
  const missingNames = includedStatuses
    .filter((s) => s.source === "missing")
    .map((s) => s.ingredient.name);
  const unchosenRanges = includedStatuses
    .filter((s) => s.range !== null && s.rangeChoice === null)
    .map((s) => s.ingredient.name);

  const blockers: CookBlocker[] = [];
  if (invalidNames.length > 0) blockers.push({ kind: "invalid_rates", names: invalidNames });
  if (missingNames.length > 0) blockers.push({ kind: "missing_rates", names: missingNames });
  if (unchosenRanges.length > 0) {
    blockers.push({ kind: "missing_range_choice", names: unchosenRanges });
  }
  if (session.sellDraft?.error) blockers.push({ kind: "invalid_sell" });

  const hasBlocking = blockers.some(
    (b) => b.kind === "invalid_rates" || b.kind === "missing_rates" || b.kind === "missing_range_choice"
  );

  let modalPerDishWl: number | null = null;
  if (!hasBlocking) {
    try {
      const result = calculateProfit({
        recipe: session.recipe,
        prices: effectivePricesFromSession(session),
        includeSpices: session.includeSpices,
        overrides: overridesFromSession(session),
        rangeChoices: session.rangeChoices,
        quantity: session.batchQuantity,
      });
      modalPerDishWl = result.modalPerMasakanWl;
    } catch {
      modalPerDishWl = null;
    }
  }

  return {
    included: includedStatuses,
    excluded: excludedStatuses,
    sell: {
      rate: session.sellRate,
      draft: session.sellDraft,
      fromSlash: session.sellFromSlash,
      invalid: Boolean(session.sellDraft?.error),
    },
    pages,
    blockers,
    modalPerDishWl,
  };
}

export function effectivePricesFromSession(
  session: CookSession
): Map<string, ParsedRate> {
  const prices = new Map<string, ParsedRate>();
  for (const ingredient of session.recipe.ingredients) {
    const status = buildIngredientStatus(ingredient, session, true);
    if (status.effectiveRate) {
      prices.set(ingredient.name.toLowerCase(), status.effectiveRate);
    }
  }
  return prices;
}

function overridesFromSession(
  session: CookSession
): Map<string, { kind: "free" } | { kind: "rate"; parsedRate: ParsedRate }> {
  const overrides = new Map<
    string,
    { kind: "free" } | { kind: "rate"; parsedRate: ParsedRate }
  >();
  for (const [key, draft] of session.rateDrafts) {
    if (!draft.parsed) continue;
    overrides.set(
      key,
      draft.parsed.isFree ? { kind: "free" } : { kind: "rate", parsedRate: draft.parsed }
    );
  }
  return overrides;
}

export type CookCalculationOutcome =
  | { ok: true; result: ProfitResult }
  | { ok: false; blockers: readonly CookBlocker[] };

export function computeSessionResult(session: CookSession): CookCalculationOutcome {
  const model = buildWorksheetModel(session);
  if (model.blockers.length > 0) {
    return { ok: false, blockers: model.blockers };
  }

  const sellRate = session.sellDraft?.parsed ?? session.sellRate ?? null;

  try {
    const result = calculateProfit({
      recipe: session.recipe,
      prices: effectivePricesFromSession(session),
      includeSpices: session.includeSpices,
      overrides: overridesFromSession(session),
      sellRate,
      rangeChoices: session.rangeChoices,
      quantity: session.batchQuantity,
    });
    return { ok: true, result };
  } catch (err) {
    if (err instanceof MissingPricesError) {
      return {
        ok: false,
        blockers: [{ kind: "missing_rates", names: err.missing }],
      };
    }
    if (err instanceof MissingQuantityChoiceError) {
      return {
        ok: false,
        blockers: [{ kind: "missing_range_choice", names: [err.message] }],
      };
    }
    if (err instanceof CalculationOverflowError) {
      return { ok: false, blockers: [{ kind: "overflow" }] };
    }
    throw err;
  }
}

export function collectIncludedRangeIngredients(
  recipe: CookingRecipe
): RecipeIngredient[] {
  return collectRangeIngredients(recipe).filter(hasQuantityRange);
}

export function describeRangeChoice(
  ingredient: RecipeIngredient,
  choice: number | null
): string {
  const label = formatIngredientQuantity(ingredient);
  if (!hasQuantityRange(ingredient)) return label;
  if (choice === null) return `${label} (choose below)`;
  return `${choice} (range ${label})`;
}

export function resolveConfirmedQuantity(
  ingredient: RecipeIngredient,
  session: CookSession
): number {
  return resolveIngredientQuantity(ingredient, session.rangeChoices);
}
