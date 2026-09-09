import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { prisma, disconnectDb } from "../../../src/core/db.js";
import { UtilityService } from "../../../src/modules/community/utility.service.js";

describe("UtilityService", () => {
  let utilityService: UtilityService;
  const guildId = "test-guild-util";
  const userId = "test-user-util";

  beforeEach(async () => {
    utilityService = new UtilityService();
    await prisma.afkStatus.deleteMany({ where: { guildId } });
    await prisma.reminder.deleteMany({ where: { userId } });
    await prisma.poll.deleteMany({ where: { guildId } });
  });

  afterAll(async () => {
    await prisma.afkStatus.deleteMany({ where: { guildId } });
    await prisma.reminder.deleteMany({ where: { userId } });
    await prisma.poll.deleteMany({ where: { guildId } });
    await disconnectDb();
  });

  describe("AFK System", () => {
    it("should set and retrieve AFK status", async () => {
      const afk = await utilityService.setAfk(guildId, userId, "Studying for exams");
      expect(afk.reason).toBe("Studying for exams");

      const fetched = await utilityService.getAfk(guildId, userId);
      expect(fetched).not.toBeNull();
      expect(fetched?.reason).toBe("Studying for exams");
    });

    it("should remove AFK status", async () => {
      await utilityService.setAfk(guildId, userId, "Away");
      const cleared = await utilityService.clearAfk(guildId, userId);
      expect(cleared).toBe(true);

      const fetched = await utilityService.getAfk(guildId, userId);
      expect(fetched).toBeNull();
    });
  });

  describe("Duration Parser", () => {
    it("should parse duration strings into milliseconds", () => {
      expect(utilityService.parseDuration("30s")).toBe(30 * 1000);
      expect(utilityService.parseDuration("10m")).toBe(10 * 60 * 1000);
      expect(utilityService.parseDuration("2h")).toBe(2 * 60 * 60 * 1000);
      expect(utilityService.parseDuration("1d")).toBe(24 * 60 * 60 * 1000);
      expect(utilityService.parseDuration("invalid")).toBeNull();
    });
  });

  describe("Reminder System", () => {
    it("should create and complete reminders", async () => {
      const remindAt = new Date(Date.now() + 10000);
      const reminder = await utilityService.createReminder(
        userId,
        "channel-123",
        "Take a break",
        remindAt,
        guildId
      );

      expect(reminder.message).toBe("Take a break");
      expect(reminder.isCompleted).toBe(false);

      const pending = await utilityService.getDueReminders();
      // Since remindAt is in future, shouldn't be due yet
      expect(pending.filter((r) => r.id === reminder.id).length).toBe(0);

      await utilityService.completeReminder(reminder.id);
      const completedCheck = await prisma.reminder.findUnique({ where: { id: reminder.id } });
      expect(completedCheck?.isCompleted).toBe(true);
    });
  });

  describe("Poll System", () => {
    it("should create a poll, cast votes, and calculate results", async () => {
      const options = ["Option A", "Option B", "Option C"];
      const poll = await utilityService.createPoll(
        "msg-999",
        "channel-123",
        guildId,
        "Which is best?",
        options,
        userId
      );

      expect(poll.question).toBe("Which is best?");

      // User 1 votes for Option A (index 0)
      const afterVote1 = await utilityService.votePoll("msg-999", "user-1", 0);
      expect(afterVote1?.votes["user-1"]).toBe(0);

      // User 2 votes for Option B (index 1)
      const afterVote2 = await utilityService.votePoll("msg-999", "user-2", 1);
      expect(afterVote2?.votes["user-2"]).toBe(1);

      // Calculate tally
      const tally = utilityService.calculatePollResults(options, afterVote2!.votes);
      expect(tally[0].count).toBe(1);
      expect(tally[1].count).toBe(1);
      expect(tally[2].count).toBe(0);
      expect(tally[0].percentage).toBe(50);
    });
  });
});
