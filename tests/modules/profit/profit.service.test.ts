import { describe, it, expect, vi, beforeEach, afterAll } from "vitest";

interface FakePriceRow {
  guildId: string;
  name: string;
  items: number;
  wl: number;
  currency: string;
  updatedBy: string;
}

const priceRows = new Map<string, FakePriceRow>();

function rowKey(guildId: string, name: string): string {
  return `${guildId}|${name}`;
}

vi.mock("../../../src/core/db.js", () => {
  return {
    prisma: {
      ingredientPrice: {
        findMany: vi.fn(async ({ where }: any) =>
          Array.from(priceRows.values()).filter(
            (r) =>
              r.guildId === where.guildId &&
              (!where.name?.in || where.name.in.includes(r.name))
          )
        ),
        findUnique: vi.fn(async ({ where }: any) =>
          priceRows.get(
            rowKey(where.guildId_name.guildId, where.guildId_name.name)
          ) ?? null
        ),
        upsert: vi.fn(async ({ where, create, update }: any) => {
          const key = rowKey(where.guildId_name.guildId, where.guildId_name.name);
          const existing = priceRows.get(key);
          if (existing) {
            Object.assign(existing, update);
            return existing;
          }
          const created: FakePriceRow = { ...create };
          priceRows.set(key, created);
          return created;
        }),
        delete: vi.fn(async ({ where }: any) => {
          const key = rowKey(where.guildId_name.guildId, where.guildId_name.name);
          if (!priceRows.delete(key)) {
            throw new Error("Record to delete does not exist.");
          }
        }),
        deleteMany: vi.fn(async ({ where }: any) => {
          let removed = 0;
          for (const [key, row] of priceRows) {
            if (row.guildId === where.guildId) {
              priceRows.delete(key);
              removed += 1;
            }
          }
          return { count: removed };
        }),
      },
    },
    disconnectDb: vi.fn(async () => undefined),
  };
});

import { disconnectDb } from "../../../src/core/db.js";
import { profitService } from "../../../src/modules/profit/profit.service.js";
import { recipeRepository } from "../../../src/modules/profit/data/recipe.repository.js";

const guildId = "test-guild-profit-service";
const userId = "test-user-123";

describe("Profit Service", () => {
  beforeEach(async () => {
    priceRows.clear();
  });

  afterAll(async () => {
    await disconnectDb();
  });

  it("should set, get, list, and remove ingredient prices", async () => {
    const saved = await profitService.setPrice(guildId, "Flour", "200/150", userId);
    expect(saved.name).toBe("flour");
    expect(saved.items).toBe(200);
    expect(saved.wl).toBe(150);

    const price = await profitService.getPrice(guildId, "flour");
    expect(price?.wl).toBe(150);

    const list = await profitService.listPrices(guildId);
    expect(list).toHaveLength(1);

    const removed = await profitService.removePrice(guildId, "flour");
    expect(removed).toBe(true);

    const afterRemove = await profitService.getPrice(guildId, "flour");
    expect(afterRemove).toBeNull();
  });

  it("should snapshot recipe prices in a single guild read", async () => {
    await profitService.setPrice(guildId, "flour", "200/150", userId);
    await profitService.setPrice(guildId, "sugar", "free", userId);
    await profitService.setPrice(guildId, "milk", "2/1dl", userId);

    const berryCrepes = recipeRepository.findByName("Berry Crepes");
    expect(berryCrepes).not.toBeNull();

    const snapshot = await profitService.collectPrices(guildId, berryCrepes!);

    expect(snapshot.get("flour")).toEqual({
      isFree: false,
      rate: { items: 200, wl: 150, currency: "WL" },
    });
    expect(snapshot.get("sugar")).toEqual({ isFree: true, rate: null });
    expect(snapshot.get("milk")).toEqual({
      isFree: false,
      rate: { items: 2, wl: 1, currency: "DL" },
    });
    expect(snapshot.has("blueberry")).toBe(false);
  });

  it("should calculate cook profit with stored guild prices", async () => {
    await profitService.setPrice(guildId, "flour", "200/150", userId);
    await profitService.setPrice(guildId, "egg", "100/50", userId);
    await profitService.setPrice(guildId, "milk", "100/30", userId);
    await profitService.setPrice(guildId, "blueberry", "200/100", userId);

    const result = await profitService.cook({
      guildId,
      dishName: "Berry Crepes",
      sellRateStr: "1/4",
      quantity: 1,
    });

    expect(result.status).toBe("success");
    if (result.status === "success") {
      expect(result.profit.sellPricePerMasakanWl).toBe(4.0);
      expect(result.profit.modalPerMasakanWl).toBeGreaterThan(0);
      expect(result.profit.profitPerMasakanWl).toBeGreaterThan(0);
    }
  });

  it("should return missing_prices status when ingredients lack price", async () => {
    await profitService.setPrice(guildId, "flour", "200/150", userId);

    const result = await profitService.cook({
      guildId,
      dishName: "Berry Crepes",
    });

    expect(result.status).toBe("missing_prices");
    if (result.status === "missing_prices") {
      expect(result.missing).toContain("Egg");
      expect(result.missing).toContain("Milk");
      expect(result.missing).toContain("Blueberry");
      expect(result.suggestedCommands.length).toBeGreaterThanOrEqual(2);
    }
  });
});
