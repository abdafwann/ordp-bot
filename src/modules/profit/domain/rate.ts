import { Currency, ParsedRate, Rate } from "./types.js";
import { CURRENCY_MULTIPLIER } from "./constants.js";
import { InvalidRateError } from "./errors.js";

const RATIO_REGEX = /^\s*(\d+)\s*\/\s*(\d+(?:\.\d+)?)\s*(wl|dl|bgl)?\s*$/i;
const ABSOLUTE_REGEX = /^\s*(\d+(?:\.\d+)?)\s*(wl|dl|bgl)\s*$/i;
const FREE_REGEX = /^\s*free\s*$/i;

function normalizeCurrency(raw?: string): Currency {
  if (!raw) return "WL";
  const upper = raw.toUpperCase();
  if (upper === "DL" || upper === "BGL") return upper;
  return "WL";
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

    if (items <= 0) {
      throw new InvalidRateError("Items count in rate must be greater than 0.");
    }
    if (wl === 0) {
      throw new InvalidRateError(
        "Currency amount cannot be zero. Use 'free' for zero-cost ingredients."
      );
    }
    if (wl < 0) {
      throw new InvalidRateError("Currency amount in rate cannot be negative.");
    }

    return {
      isFree: false,
      rate: { items, wl, currency },
    };
  }

  const absoluteMatch = trimmed.match(ABSOLUTE_REGEX);
  if (absoluteMatch) {
    const wl = parseFloat(absoluteMatch[1]);
    const currency = normalizeCurrency(absoluteMatch[2]);

    if (wl === 0) {
      throw new InvalidRateError(
        "Currency amount cannot be zero. Use 'free' for zero-cost ingredients."
      );
    }
    if (wl < 0) {
      throw new InvalidRateError("Currency amount cannot be negative.");
    }

    return {
      isFree: false,
      rate: { items: 1, wl, currency },
    };
  }

  throw new InvalidRateError(
    `Invalid rate format: "${input}". Use format like "200/150", "200/130 wl", "3dl", or "free".`
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
  return value.toFixed(decimals);
}
