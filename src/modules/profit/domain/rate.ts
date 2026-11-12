import { Currency, ParsedRate, Rate } from "./types.js";
import { CURRENCY_MULTIPLIER } from "./constants.js";
import { InvalidRateError } from "./errors.js";

const RATIO_REGEX = /^\s*(\d+)\s*\/\s*(\d+(?:\.\d+)?)\s*(wl|dl|bgl)?\s*$/i;
const ABSOLUTE_REGEX = /^\s*(\d+(?:\.\d+)?)\s*(wl|dl|bgl)?\s*$/i;
const FREE_REGEX = /^\s*free\s*$/i;

export const MAX_RATE_ITEMS = 2147483647;

function normalizeCurrency(raw?: string): Currency {
  if (!raw) return "WL";
  const upper = raw.toUpperCase();
  if (upper === "DL" || upper === "BGL") return upper;
  return "WL";
}

function assertValidItems(items: number): void {
  if (!Number.isSafeInteger(items) || items < 1 || items > MAX_RATE_ITEMS) {
    throw new InvalidRateError(
      "Items count in rate must be a whole number greater than 0."
    );
  }
}

function assertValidAmount(wl: number): void {
  if (!Number.isFinite(wl)) {
    throw new InvalidRateError("Rate value is too large.");
  }
  if (wl === 0) {
    throw new InvalidRateError(
      "Currency amount cannot be zero. Use 'free' for zero-cost ingredients."
    );
  }
  if (wl < 0) {
    throw new InvalidRateError("Currency amount in rate cannot be negative.");
  }
}

export function parseRate(input: string): ParsedRate {
  const trimmed = input.trim();
  if (!trimmed) {
    throw new InvalidRateError("Rate cannot be empty.");
  }

  if (FREE_REGEX.test(trimmed)) {
    return { isFree: true, rate: null };
  }

  const ratioMatch = trimmed.match(RATIO_REGEX);
  if (ratioMatch) {
    const items = parseInt(ratioMatch[1], 10);
    const wl = parseFloat(ratioMatch[2]);
    const currency = normalizeCurrency(ratioMatch[3]);

    assertValidItems(items);
    assertValidAmount(wl);

    return {
      isFree: false,
      rate: { items, wl, currency },
    };
  }

  const absoluteMatch = trimmed.match(ABSOLUTE_REGEX);
  if (absoluteMatch) {
    const wl = parseFloat(absoluteMatch[1]);
    const currency = normalizeCurrency(absoluteMatch[2]);

    assertValidAmount(wl);

    return {
      isFree: false,
      rate: { items: 1, wl, currency },
    };
  }

  throw new InvalidRateError(
    `Invalid rate format. Use a format like "200/150", "200/130 wl", "3dl", or "free".`
  );
}

export function pricePerItemWl(parsed: ParsedRate): number {
  if (parsed.isFree || !parsed.rate) {
    return 0;
  }
  const { items, wl, currency } = parsed.rate;
  const multiplier = CURRENCY_MULTIPLIER[currency];
  return (wl * multiplier) / items;
}

export function formatRate(parsed: ParsedRate): string {
  if (parsed.isFree || !parsed.rate) {
    return "FREE";
  }
  const { items, wl, currency } = parsed.rate;
  return `${items}/${wl} ${currency}`;
}

export function formatWl(value: number, decimals = 2): string {
  const digits = Math.min(decimals, 3);
  const rounded = Number(value.toFixed(digits));
  if (rounded === 0 && value !== 0) {
    return `${value < 0 ? "-" : ""}<${(1 / 10 ** digits).toFixed(digits)}`;
  }
  return Number.isInteger(rounded) ? rounded.toFixed(2) : String(rounded);
}
