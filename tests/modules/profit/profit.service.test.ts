import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { prisma, disconnectDb } from "../../../src/core/db.js";
import { profitService } from "../../../src/modules/profit/profit.service.js";

describe("Profit Service Integration", () => {
  const guildId = "test-guild-profit-service";
  const userId = "test-user-123";

  beforeEach(async () => {
    await prisma.ingredientPrice.deleteMany({ where: { guildId } });
  });

  afterAll(async () => {
    await prisma.ingredientPrice.deleteMany({ where: { guildId } });
    await disconnectDb();
  });

  it("should set, get, list, and remove ingredient prices", async () => {
    const saved = await profitService.setPrice(guildId, "Dough", "200/150", userId);
    expect(saved.name).toBe("dough");
    expect(saved.items).toBe(200);
    expect(saved.wl).toBe(150);

    const price = await profitService.getPrice(guildId, "dough");
    expect(price?.wl).toBe(150);

    const list = await profitService.listPrices(guildId);
    expect(list).toHaveLength(1);

    const removed = await profitService.removePrice(guildId, "dough");
    expect(removed).toBe(true);

    const afterRemove = await profitService.getPrice(guildId, "dough");
    expect(afterRemove).toBeNull();
  });

  it("should calculate cook profit with stored guild prices", async () => {
    await profitService.setPrice(guildId, "dough", "200/150", userId);
    await profitService.setPrice(guildId, "cheese", "100/50", userId);
    await profitService.setPrice(guildId, "tomato", "100/30", userId);

    const result = await profitService.cook({
      guildId,
      dishName: "Pizza",
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
    // Only set dough, cheese and tomato missing
    await profitService.setPrice(guildId, "dough", "200/150", userId);

    const result = await profitService.cook({
      guildId,
      dishName: "Pizza",
    });

    expect(result.status).toBe("missing_prices");
    if (result.status === "missing_prices") {
      expect(result.missing).toContain("Cheese");
      expect(result.missing).toContain("Tomato");
      expect(result.suggestedCommands.length).toBeGreaterThanOrEqual(2);
    }
  });
});
