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

  const tokens = input
    .split(/[,;\s]+/)
    .map((t) => t.trim())
    .filter(Boolean);

  for (const token of tokens) {
    const colonIndex = token.indexOf(":");
    if (colonIndex === -1 || colonIndex === 0 || colonIndex === token.length - 1) {
      throw new InvalidOverrideError(
        `Invalid override "${token}". Expected format: "<ingredient>:<rate|free|include|skip>"`
      );
    }

    const name = token.slice(0, colonIndex).toLowerCase().trim();
    const actionRaw = token.slice(colonIndex + 1).toLowerCase().trim();

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
      } catch (err) {
        throw new InvalidOverrideError(
          `Invalid override value for "${name}": "${actionRaw}". Use a rate (e.g. 200/150), free, include, or skip.`
        );
      }
    }
  }

  return result;
}
