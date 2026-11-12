export type Currency = "WL" | "DL" | "BGL";
export type HeatLevel = "Low" | "Medium" | "High";
export type IngredientRequirement = "required" | "optional";

export interface IngredientQuantityRange {
  readonly min: number;
  readonly max: number;
}

export interface Rate {
  readonly items: number;
  readonly wl: number;
  readonly currency: Currency;
}

export interface ParsedRate {
  readonly isFree: boolean;
  readonly rate: Rate | null;
}

export interface RecipeIngredient {
  readonly id: string;
  readonly name: string;
  readonly quantity: number;
  readonly quantityRange?: IngredientQuantityRange;
  readonly timing: string;
  readonly requirement: IngredientRequirement;
  readonly notes?: string;
}

export interface CookingRecipe {
  readonly id: string;
  readonly name: string;
  readonly outputSpriteUrl?: string;
  readonly ingredients: readonly RecipeIngredient[];
  readonly punchTiming: string;
  readonly heatLevel: HeatLevel;
  readonly foodBuff?: string;
  readonly notes?: string;
  readonly sourceUrl?: string;
}

export interface IngredientCostBreakdown {
  readonly id: string;
  readonly name: string;
  readonly quantity: number;
  readonly requirement: IngredientRequirement;
  readonly isFree: boolean;
  readonly rate: Rate | null;
  readonly unitCostWl: number;
  readonly totalCostWl: number;
}

export interface ProfitResult {
  readonly modalPerMasakanWl: number;
  readonly totalModalWl: number;
  readonly sellPricePerMasakanWl: number | null;
  readonly totalRevenueWl: number | null;
  readonly profitPerMasakanWl: number | null;
  readonly totalProfitWl: number | null;
  readonly marginPercent: number | null;
  readonly roiPercent: number | null;
  readonly breakdown: readonly IngredientCostBreakdown[];
}
