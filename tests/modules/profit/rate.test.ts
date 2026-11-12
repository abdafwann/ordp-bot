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

  it("should parse absolute prices and plain numbers defaulting to WL", () => {
    const dl = parseRate("3dl");
    expect(dl.rate).toEqual({ items: 1, wl: 3, currency: "DL" });
    expect(pricePerItemWl(dl)).toBe(600);

    const wl = parseRate("2.5wl");
    expect(wl.rate).toEqual({ items: 1, wl: 2.5, currency: "WL" });
    expect(pricePerItemWl(wl)).toBe(2.5);

    // Plain numbers default to 1 item for X WL
    const plain = parseRate("2");
    expect(plain.rate).toEqual({ items: 1, wl: 2, currency: "WL" });
    expect(pricePerItemWl(plain)).toBe(2);

    const plainDec = parseRate("0.5");
    expect(plainDec.rate).toEqual({ items: 1, wl: 0.5, currency: "WL" });
    expect(pricePerItemWl(plainDec)).toBe(0.5);
  });

  it("should throw InvalidRateError for malformed inputs", () => {
    expect(() => parseRate("")).toThrow(InvalidRateError);
    expect(() => parseRate("0/100")).toThrow(InvalidRateError);
    expect(() => parseRate("-200/100")).toThrow(InvalidRateError);
    expect(() => parseRate("abc/def")).toThrow(InvalidRateError);
  });

  it("should reject numerators beyond the Prisma Int range", () => {
    expect(() => parseRate("99999999999/1")).toThrow(InvalidRateError);
    expect(() => parseRate(`2147483648/1`)).toThrow(InvalidRateError);
    expect(parseRate("2147483647/1").rate?.items).toBe(2147483647);
  });

  it("should reject non-finite currency amounts", () => {
    expect(() => parseRate(`1/${"9".repeat(400)}`)).toThrow(InvalidRateError);
    expect(() => parseRate(`${"9".repeat(400)}wl`)).toThrow(InvalidRateError);
  });

  it("should reject zero currency amount unless marked free", () => {
    expect(() => parseRate("200/0")).toThrow(InvalidRateError);
    expect(() => parseRate("200/0")).toThrow(
      "Currency amount cannot be zero. Use 'free' for zero-cost ingredients."
    );
    expect(() => parseRate("0wl")).toThrow(InvalidRateError);
    expect(() => parseRate("0")).toThrow(InvalidRateError);
    expect(parseRate("free").isFree).toBe(true);
  });

  it("should format rates and WL numbers cleanly", () => {
    const r = parseRate("200/150");
    expect(formatRate(r)).toBe("200/150 WL");
    expect(formatWl(1.23456, 4)).toBe("1.235");
    expect(formatWl(7, 4)).toBe("7.00");
    expect(formatWl(2.5, 4)).toBe("2.5");
    expect(formatWl(4.6733, 4)).toBe("4.673");
    expect(formatWl(2)).toBe("2.00");
  });

  it("should not render tiny nonzero values as zero", () => {
    expect(formatWl(0.0001, 4)).toBe("<0.001");
    expect(formatWl(-0.0001, 4)).toBe("-<0.001");
    expect(formatWl(0.004, 2)).toBe("<0.01");
    expect(formatWl(0, 4)).toBe("0.00");
    expect(formatWl(-7, 4)).toBe("-7.00");
  });
});
