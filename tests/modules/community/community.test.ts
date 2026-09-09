import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { prisma, disconnectDb } from "../../../src/core/db.js";
import { LevelingService } from "../../../src/modules/community/leveling.service.js";
import { EconomyService } from "../../../src/modules/community/economy.service.js";

describe("Leveling & XP Service", () => {
  const guildId = "test-guild-comm";
  const userId = "test-user-comm";

  beforeEach(async () => {
    await prisma.userLevel.deleteMany({ where: { guildId } });
    await prisma.userEconomy.deleteMany({ where: { guildId } });
  });

  afterAll(async () => {
    await prisma.userLevel.deleteMany({ where: { guildId } });
    await prisma.userEconomy.deleteMany({ where: { guildId } });
    await disconnectDb();
  });

  it("should calculate correct level from XP", () => {
    const levelingService = new LevelingService();
    expect(levelingService.calculateLevel(0)).toBe(1);
    expect(levelingService.calculateLevel(25)).toBe(2);
    expect(levelingService.calculateLevel(100)).toBe(3);
    expect(levelingService.calculateLevel(225)).toBe(4);
  });

  it("should award XP on message and respect 60s cooldown", async () => {
    const levelingService = new LevelingService();

    // First message should award XP
    const result1 = await levelingService.addMessageXp(guildId, userId, 20);
    expect(result1.awarded).toBe(true);
    expect(result1.currentXp).toBe(20);

    // Second immediate message should be blocked by cooldown
    const result2 = await levelingService.addMessageXp(guildId, userId, 20);
    expect(result2.awarded).toBe(false);
    expect(result2.currentXp).toBe(20);
  });

  it("should detect level up correctly", async () => {
    const levelingService = new LevelingService();

    // Seed initial XP right below level 2 threshold (25 XP)
    await prisma.userLevel.create({
      data: {
        guildId,
        userId: "user-level-up",
        xp: 20,
        level: 1,
        lastXpAt: new Date(Date.now() - 70 * 1000), // cooldown passed
      },
    });

    const result = await levelingService.addMessageXp(guildId, "user-level-up", 10);
    expect(result.awarded).toBe(true);
    expect(result.currentXp).toBe(30);
    expect(result.levelUp).toBe(true);
    expect(result.newLevel).toBe(2);
  });
});

describe("Economy Service", () => {
  const guildId = "test-guild-comm";
  const userId1 = "user-eco-1";
  const userId2 = "user-eco-2";

  beforeEach(async () => {
    await prisma.userEconomy.deleteMany({ where: { guildId } });
  });

  it("should award daily reward and enforce 24-hour cooldown", async () => {
    const ecoService = new EconomyService();

    const daily1 = await ecoService.claimDaily(guildId, userId1);
    expect(daily1.success).toBe(true);
    expect(daily1.reward).toBe(100);

    const balance = await ecoService.getBalance(guildId, userId1);
    expect(balance).toBe(200); // 100 default + 100 daily

    const daily2 = await ecoService.claimDaily(guildId, userId1);
    expect(daily2.success).toBe(false);
  });

  it("should process coinflip winnings and losses correctly", async () => {
    const ecoService = new EconomyService();

    await ecoService.getBalance(guildId, userId1); // ensures account created with 100

    // Coinflip with forced random roll via helper or standard game
    const result = await ecoService.coinflip(guildId, userId1, 50, "heads");
    expect(["heads", "tails"]).toContain(result.outcome);
    if (result.won) {
      expect(result.newBalance).toBe(150);
    } else {
      expect(result.newBalance).toBe(50);
    }
  });

  it("should transfer coins atomically between two users", async () => {
    const ecoService = new EconomyService();

    // User 1 has 100, User 2 has 100
    await ecoService.getBalance(guildId, userId1);
    await ecoService.getBalance(guildId, userId2);

    const transfer = await ecoService.transfer(guildId, userId1, userId2, 40);
    expect(transfer.success).toBe(true);

    const bal1 = await ecoService.getBalance(guildId, userId1);
    const bal2 = await ecoService.getBalance(guildId, userId2);

    expect(bal1).toBe(60);
    expect(bal2).toBe(140);
  });
});
