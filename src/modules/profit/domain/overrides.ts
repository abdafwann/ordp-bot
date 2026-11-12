import { ParsedRate } from "./types.js";
import { parseRate } from "./rate.js";
import { InvalidOverrideError } from "./errors.js";

export type OverrideAction =
  | { kind: "free" }
  | { kind: "rate"; parsedRate: ParsedRate }
  | { kind: "include" }
  | { kind: "skip" };

export function parseOverrides(input?: string): Map<string, OverrideAction> {
  const result = new Map<string, OverrideAction>();
  if (!input || !input.trim()) {
    return result;
  }

  let tokens: string[];
  if (/[,;\n\r]/.test(input)) {
    tokens = input
      .split(/[,;\n\r]+/)
      .map((t) => t.trim())
      .filter(Boolean);
  } else {
    const spaceTokens = input.trim().split(/\s+/);
    if (spaceTokens.length > 1 && spaceTokens.every((t) => t.includes(":") || t.includes("="))) {
      tokens = spaceTokens;
    } else {
      tokens = [input.trim()];
    }
  }

  for (const token of tokens) {
    const colonIndex = token.search(/[:=]/);
    if (colonIndex === -1) {
      throw new InvalidOverrideError(
        `Invalid override "${token}". Expected format: "<ingredient>:<rate|free|include|skip>"`
      );
    }

    const name = token.slice(0, colonIndex).toLowerCase().trim();
    const actionRaw = token.slice(colonIndex + 1).toLowerCase().trim();

    if (!name) {
      throw new InvalidOverrideError(
        `Invalid override "${token}". Expected format: "<ingredient>:<rate|free|include|skip>"`
      );
    }

    if (!actionRaw) {
      continue;
    }

    if (actionRaw === "free") {
      result.set(name, { kind: "free" });
    } else if (actionRaw === "include") {
      result.set(name, { kind: "include" });
    } else if (actionRaw === "skip") {
      result.set(name, { kind: "skip" });
    } else {
      try {
        const parsedRate = parseRate(actionRaw);
        result.set(name, { kind: "rate", parsedRate });
      } catch {
        throw new InvalidOverrideError(
          `Invalid override value for "${name}": "${actionRaw}". Use a rate (e.g. 200/150), free, include, or skip.`
        );
      }
    }
  }

  return result;
}
