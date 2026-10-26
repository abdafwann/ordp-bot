import { Currency } from "./types.js";

export const WL_PER_DL = 200;
export const DL_PER_BGL = 200;
export const WL_PER_BGL = WL_PER_DL * DL_PER_BGL; // 40,000

export const CURRENCY_MULTIPLIER: Record<Currency, number> = {
  WL: 1,
  DL: WL_PER_DL,
  BGL: WL_PER_BGL,
};
