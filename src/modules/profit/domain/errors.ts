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
