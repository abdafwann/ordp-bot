import { CookingRecipe, RecipeIngredient } from "./types.js";
import {
  InvalidQuantityError,
  MissingQuantityChoiceError,
} from "./errors.js";

export const MIN_BATCH_QUANTITY = 1;
export const MAX_BATCH_QUANTITY = 100000;

export function hasQuantityRange(
  ingredient: RecipeIngredient
): boolean {
  return ingredient.quantityRange !== undefined;
}

export function formatIngredientQuantity(
  ingredient: RecipeIngredient
): string {
  const range = ingredient.quantityRange;
  if (range) {
    return `${range.min}-${range.max}`;
  }
  return String(ingredient.quantity);
}

export function resolveIngredientQuantity(
  ingredient: RecipeIngredient,
  rangeChoices?: ReadonlyMap<string, number>
): number {
  const range = ingredient.quantityRange;
  if (!range) {
    return ingredient.quantity;
  }

  const key = ingredient.id.toLowerCase();
  const choice = rangeChoices?.get(key);

  if (choice === undefined) {
    throw new MissingQuantityChoiceError(ingredient.name, range);
  }

  validateIngredientChoice(choice, range);
  return choice;
}

function validateIngredientChoice(
  choice: number,
  range: { readonly min: number; readonly max: number }
): void {
  if (
    !Number.isInteger(choice) ||
    choice < range.min ||
    choice > range.max
  ) {
    throw new InvalidQuantityError(
      `Quantity choice must be a whole number between ${range.min} and ${range.max}.`
    );
  }
}

export function validateBatchQuantity(quantity: number): void {
  if (
    !Number.isInteger(quantity) ||
    quantity < MIN_BATCH_QUANTITY ||
    quantity > MAX_BATCH_QUANTITY
  ) {
    throw new InvalidQuantityError(
      `Quantity must be a whole number between ${MIN_BATCH_QUANTITY} and ${MAX_BATCH_QUANTITY}.`
    );
  }
}

export function collectRangeIngredients(
  recipe: CookingRecipe
): RecipeIngredient[] {
  return recipe.ingredients.filter(hasQuantityRange);
}
