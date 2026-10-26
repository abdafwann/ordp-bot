import { describe, it, expect } from "vitest";
import {
  parseRate,
  pricePerItemWl,
  formatRate,
  formatWl,
} from "../../../src/modules/profit/domain/rate.js";
import { InvalidRateError } from "../../../src/modules/profit/domain/errors.js";

describe("Rate Parser and Normalizer", () => {
  it("should parse standard ratio rates", () => {
    const r1 = parseRate("200/150");
    expect(r1.isFree).toBe(false);
    expect(r1.rate).toEqual({ items: 200, wl: 150, currency: "WL" });
    expect(pricePerItemWl(r1)).toBe(0.75);

    const r2 = parseRate("200/130 wl");
    expect(r2.rate).toEqual({ items: 200, wl: 130, currency: "WL" });
    expect(pricePerItemWl(r2)).toBe(0.65);

    const r3 = parseRate("2/1dl");
    expect(r3.rate).toEqual({ items: 2, wl: 1, currency: "DL" });
    expect(pricePerItemWl(r3)).toBe(100);
  });

  it("should parse free / farmed rate", () => {
    const free = parseRate("free");
    expect(free.isFree).toBe(true);
    expect(free.rate).toBeNull();
    expect(pricePerItemWl(free)).toBe(0);
    expect(formatRate(free)).toBe("FREE");
  });

  it("should parse absolute prices", () => {
    const dl = parseRate("3dl");
    expect(dl.rate).toEqual({ items: 1, wl: 3, currency: "DL" });
    expect(pricePerItemWl(dl)).toBe(600);

    const wl = parseRate("2.5wl");
    expect(wl.rate).toEqual({ items: 1, wl: 2.5, currency: "WL" });
    expect(pricePerItemWl(wl)).toBe(2.5);
  });

  it("should throw InvalidRateError for malformed inputs", () => {
    expect(() => parseRate("")).toThrow(InvalidRateError);
    expect(() => parseRate("0/100")).toThrow(InvalidRateError);
    expect(() => parseRate("-200/100")).toThrow(InvalidRateError);
    expect(() => parseRate("abc/def")).toThrow(InvalidRateError);
  });

  it("should format rates and WL numbers cleanly", () => {
    const r = parseRate("200/150");
    expect(formatRate(r)).toBe("200/150 WL");
    expect(formatWl(1.23456, 4)).toBe("1.2346");
    expect(formatWl(2)).toBe("2.00");
  });
});
