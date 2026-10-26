import { describe, it, expect } from "vitest";
import { parseOverrides } from "../../../src/modules/profit/domain/overrides.js";
import { InvalidOverrideError } from "../../../src/modules/profit/domain/errors.js";

describe("Overrides Parser", () => {
  it("should return empty map for empty or undefined input", () => {
    expect(parseOverrides()).toEqual(new Map());
    expect(parseOverrides("   ")).toEqual(new Map());
  });

  it("should parse comma and space-delimited overrides", () => {
    const input = "dough:free, cheese:200/120, pepper:skip, vanilla:include";
    const map = parseOverrides(input);

    expect(map.get("dough")).toEqual({ kind: "free" });
    expect(map.get("pepper")).toEqual({ kind: "skip" });
    expect(map.get("vanilla")).toEqual({ kind: "include" });

    const cheese = map.get("cheese");
    expect(cheese?.kind).toBe("rate");
    if (cheese?.kind === "rate") {
      expect(cheese.parsedRate.rate?.items).toBe(200);
      expect(cheese.parsedRate.rate?.wl).toBe(120);
    }
  });

  it("should throw InvalidOverrideError on invalid syntax", () => {
    expect(() => parseOverrides("dough")).toThrow(InvalidOverrideError);
    expect(() => parseOverrides("dough:invalid:rate")).toThrow(InvalidOverrideError);
  });
});
