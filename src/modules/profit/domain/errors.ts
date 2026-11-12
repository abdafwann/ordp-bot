export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class InvalidRateError extends DomainError {}

export class RecipeNotFoundError extends DomainError {
  constructor(recipeName: string) {
    super(`Recipe "${recipeName}" was not found.`);
  }
}

export class MissingPricesError extends DomainError {
  constructor(public readonly missing: string[]) {
    super(`Missing prices for ingredients: ${missing.join(", ")}`);
  }
}

export class InvalidOverrideError extends DomainError {}

export class InvalidQuantityError extends DomainError {}

export class MissingQuantityChoiceError extends DomainError {
  constructor(
    ingredientName: string,
    range: { readonly min: number; readonly max: number }
  ) {
    super(
      `Choose a quantity for ${ingredientName} (${range.min}-${range.max}) before calculating.`
    );
  }
}

export class CalculationOverflowError extends DomainError {
  constructor() {
    super(
      "A calculated value is too large to handle. Reduce the batch quantity or use smaller rates."
    );
  }
}
