import { describe, it, expect, afterAll } from "vitest";
import { prisma, disconnectDb } from "../../src/core/db.js";

describe("Database Client & Schema CRUD", () => {
  afterAll(async () => {
    // Cleanup test data
    await prisma.guildConfig.deleteMany({ where: { guildId: "test-guild-123" } });
    await prisma.userEconomy.deleteMany({ where: { guildId: "test-guild-123" } });
    await disconnectDb();
  });

  it("should create and fetch GuildConfig", async () => {
    const created = await prisma.guildConfig.upsert({
      where: { guildId: "test-guild-123" },
      create: {
        guildId: "test-guild-123",
        welcomeMessage: "Welcome to the server!",
        githubChannelId: "github-channel-999",
      },
      update: {
        welcomeMessage: "Welcome to the server!",
      },
    });

    expect(created.guildId).toBe("test-guild-123");
    expect(created.welcomeMessage).toBe("Welcome to the server!");

    const fetched = await prisma.guildConfig.findUnique({
      where: { guildId: "test-guild-123" },
    });
    expect(fetched?.githubChannelId).toBe("github-channel-999");
  });

  it("should create and manage UserEconomy", async () => {
    const userEco = await prisma.userEconomy.upsert({
      where: {
        guildId_userId: {
          guildId: "test-guild-123",
          userId: "user-456",
        },
      },
      create: {
        guildId: "test-guild-123",
        userId: "user-456",
        balance: 250,
      },
      update: {
        balance: 250,
      },
    });

    expect(userEco.balance).toBe(250);
  });
});
