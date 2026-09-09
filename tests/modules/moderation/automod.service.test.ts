import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { prisma, disconnectDb } from "../../../src/core/db.js";
import { AutoModService } from "../../../src/modules/moderation/automod.service.js";
import { buildAutoModConfigEmbed } from "../../../src/modules/moderation/commands/automod.command.js";

describe("AutoModService", () => {
  const guildId = "test-guild-automod";
  let autoModService: AutoModService;

  beforeEach(async () => {
    autoModService = new AutoModService();
    await prisma.guildConfig.deleteMany({ where: { guildId } });
  });

  afterAll(async () => {
    await prisma.guildConfig.deleteMany({ where: { guildId } });
    await disconnectDb();
  });

  describe("Detection utilities", () => {
    it("should detect Discord invite links", () => {
      expect(autoModService.isInvite("Check out discord.gg/xyz")).toBe(true);
      expect(autoModService.isInvite("https://discord.com/invite/abcdef")).toBe(true);
      expect(autoModService.isInvite("Just chatting here")).toBe(false);
      expect(autoModService.isInvite("https://google.com")).toBe(false);
    });

    it("should detect general URLs", () => {
      expect(autoModService.hasLinks("Visit https://example.com now")).toBe(true);
      expect(autoModService.hasLinks("http://insecure-site.org/test")).toBe(true);
      expect(autoModService.hasLinks("no links here")).toBe(false);
    });

    it("should detect blocked words", () => {
      const blocked = ["badword", "scam"];
      expect(autoModService.findBlockedWord("This is a badword here", blocked)).toBe("badword");
      expect(autoModService.findBlockedWord("Check out this SCAM!", blocked)).toBe("scam");
      expect(autoModService.findBlockedWord("Completely safe message", blocked)).toBeNull();
    });

    it("should detect mass mentions", () => {
      expect(autoModService.isMassMention(6, 5)).toBe(true);
      expect(autoModService.isMassMention(5, 5)).toBe(false);
      expect(autoModService.isMassMention(10, 0)).toBe(false); // 0 means disabled
    });

    it("should enforce message rate limit (10s window)", () => {
      const userId = "test-spammer-1";
      const limit = 5;
      const windowMs = 10000;

      for (let i = 0; i < limit - 1; i++) {
        expect(autoModService.checkRateLimit(guildId, userId, limit, windowMs)).toBe(false);
      }
      // 5th message triggers rate limit
      expect(autoModService.checkRateLimit(guildId, userId, limit, windowMs)).toBe(true);
    });
  });

  describe("Guild Blocklist management", () => {
    it("should add and remove blocked words for a guild", async () => {
      const wordsAfterAdd = await autoModService.addBlockedWord(guildId, "toxic");
      expect(wordsAfterAdd).toContain("toxic");

      const wordsList = await autoModService.getBlockedWords(guildId);
      expect(wordsList).toEqual(["toxic"]);

      const wordsAfterRemove = await autoModService.removeBlockedWord(guildId, "toxic");
      expect(wordsAfterRemove).not.toContain("toxic");
    });

    it("should toggle automod settings for a guild", async () => {
      const updated = await autoModService.updateSettings(guildId, {
        antiInvite: true,
        antiSpam: true,
        maxMentions: 5,
      });

      expect(updated.antiInvite).toBe(true);
      expect(updated.antiSpam).toBe(true);
      expect(updated.maxMentions).toBe(5);
      expect(updated.antiLinks).toBe(false);
    });
  });

  describe("AutoMod UI Embed Builder", () => {
    it("should build config embed and action buttons correctly", () => {
      const { embed, row } = buildAutoModConfigEmbed({
        antiInvite: true,
        antiLinks: false,
        antiSpam: true,
        maxMentions: 3,
        blockedWords: JSON.stringify(["testword"]),
      });

      expect(embed.data.title).toBe("🛡️ Auto-Mod & Spam Protection Settings");
      expect(row.components.length).toBe(3);
    });
  });
});
