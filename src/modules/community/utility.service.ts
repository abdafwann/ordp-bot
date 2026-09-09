import { prisma } from "../../core/db.js";

export interface PollResult {
  option: string;
  count: number;
  percentage: number;
}

export class UtilityService {
  // --- AFK System ---
  async setAfk(guildId: string, userId: string, reason = "AFK") {
    return prisma.afkStatus.upsert({
      where: {
        guildId_userId: { guildId, userId },
      },
      update: { reason, createdAt: new Date() },
      create: { guildId, userId, reason },
    });
  }

  async getAfk(guildId: string, userId: string) {
    return prisma.afkStatus.findUnique({
      where: {
        guildId_userId: { guildId, userId },
      },
    });
  }

  async clearAfk(guildId: string, userId: string): Promise<boolean> {
    try {
      await prisma.afkStatus.delete({
        where: {
          guildId_userId: { guildId, userId },
        },
      });
      return true;
    } catch {
      return false;
    }
  }

  // --- Duration Parser ---
  parseDuration(durationStr: string): number | null {
    const match = durationStr.trim().match(/^(\d+)\s*([smhd])$/i);
    if (!match) return null;

    const value = parseInt(match[1], 10);
    const unit = match[2].toLowerCase();

    switch (unit) {
      case "s":
        return value * 1000;
      case "m":
        return value * 60 * 1000;
      case "h":
        return value * 60 * 60 * 1000;
      case "d":
        return value * 24 * 60 * 60 * 1000;
      default:
        return null;
    }
  }

  // --- Reminder System ---
  async createReminder(
    userId: string,
    channelId: string,
    message: string,
    remindAt: Date,
    guildId?: string
  ) {
    return prisma.reminder.create({
      data: {
        userId,
        channelId,
        message,
        remindAt,
        guildId,
      },
    });
  }

  async getDueReminders() {
    return prisma.reminder.findMany({
      where: {
        remindAt: { lte: new Date() },
        isCompleted: false,
      },
    });
  }

  async completeReminder(id: string) {
    return prisma.reminder.update({
      where: { id },
      data: { isCompleted: true },
    });
  }

  // --- Poll System ---
  async createPoll(
    messageId: string,
    channelId: string,
    guildId: string,
    question: string,
    options: string[],
    creatorId: string
  ) {
    return prisma.poll.create({
      data: {
        messageId,
        channelId,
        guildId,
        question,
        options: JSON.stringify(options),
        votes: "{}",
        creatorId,
      },
    });
  }

  async getPoll(messageId: string) {
    return prisma.poll.findUnique({
      where: { messageId },
    });
  }

  async votePoll(messageId: string, userId: string, optionIndex: number) {
    const poll = await this.getPoll(messageId);
    if (!poll) return null;

    let votes: Record<string, number> = {};
    try {
      votes = JSON.parse(poll.votes || "{}");
    } catch {
      votes = {};
    }

    // Toggle vote or switch option
    if (votes[userId] === optionIndex) {
      delete votes[userId];
    } else {
      votes[userId] = optionIndex;
    }

    const updated = await prisma.poll.update({
      where: { messageId },
      data: { votes: JSON.stringify(votes) },
    });

    return {
      poll: updated,
      options: JSON.parse(updated.options) as string[],
      votes,
    };
  }

  calculatePollResults(options: string[], votes: Record<string, number>): PollResult[] {
    const counts = new Array(options.length).fill(0);
    let totalVotes = 0;

    for (const optIdx of Object.values(votes)) {
      if (optIdx >= 0 && optIdx < counts.length) {
        counts[optIdx]++;
        totalVotes++;
      }
    }

    return options.map((opt, idx) => ({
      option: opt,
      count: counts[idx],
      percentage: totalVotes > 0 ? Math.round((counts[idx] / totalVotes) * 100) : 0,
    }));
  }
}

export const utilityService = new UtilityService();
