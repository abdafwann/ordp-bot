import { prisma } from "../../core/db.js";

interface RateLimitTracker {
  timestamps: number[];
}

export class AutoModService {
  private userMessageHistory = new Map<string, RateLimitTracker>();

  isInvite(content: string): boolean {
    const inviteRegex = /(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li)|discord(app)?\.com\/invite)\/[a-zA-Z0-9_-]+/i;
    return inviteRegex.test(content);
  }

  hasLinks(content: string): boolean {
    const urlRegex = /(https?:\/\/[^\s]+)/i;
    return urlRegex.test(content);
  }

  findBlockedWord(content: string, blockedWords: string[]): string | null {
    if (!blockedWords.length) return null;
    const lower = content.toLowerCase();
    for (const word of blockedWords) {
      const trimmed = word.trim().toLowerCase();
      if (!trimmed) continue;
      const regex = new RegExp(`(^|\\W)${trimmed.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(\\W|$)`, "i");
      if (regex.test(lower)) {
        return trimmed;
      }
    }
    return null;
  }

  isMassMention(mentionCount: number, maxMentions: number): boolean {
    if (maxMentions <= 0) return false;
    return mentionCount > maxMentions;
  }

  checkRateLimit(
    guildId: string,
    userId: string,
    threshold = 5,
    windowMs = 10000
  ): boolean {
    const key = `${guildId}:${userId}`;
    const now = Date.now();
    const history = this.userMessageHistory.get(key) || { timestamps: [] };

    // Filter out timestamps outside window
    history.timestamps = history.timestamps.filter((ts) => now - ts < windowMs);
    history.timestamps.push(now);
    this.userMessageHistory.set(key, history);

    return history.timestamps.length >= threshold;
  }

  async getGuildConfig(guildId: string) {
    const config = await prisma.guildConfig.findUnique({
      where: { guildId },
    });

    if (!config) {
      return prisma.guildConfig.create({
        data: { guildId },
      });
    }

    return config;
  }

  async getBlockedWords(guildId: string): Promise<string[]> {
    const config = await this.getGuildConfig(guildId);
    try {
      return JSON.parse(config.blockedWords || "[]") as string[];
    } catch {
      return [];
    }
  }

  async addBlockedWord(guildId: string, word: string): Promise<string[]> {
    const words = await this.getBlockedWords(guildId);
    const normalized = word.trim().toLowerCase();
    if (!words.includes(normalized)) {
      words.push(normalized);
      await prisma.guildConfig.update({
        where: { guildId },
        data: { blockedWords: JSON.stringify(words) },
      });
    }
    return words;
  }

  async removeBlockedWord(guildId: string, word: string): Promise<string[]> {
    let words = await this.getBlockedWords(guildId);
    const normalized = word.trim().toLowerCase();
    words = words.filter((w) => w !== normalized);
    await prisma.guildConfig.update({
      where: { guildId },
      data: { blockedWords: JSON.stringify(words) },
    });
    return words;
  }

  async updateSettings(
    guildId: string,
    settings: {
      antiInvite?: boolean;
      antiLinks?: boolean;
      antiSpam?: boolean;
      maxMentions?: number;
    }
  ) {
    await this.getGuildConfig(guildId);
    return prisma.guildConfig.update({
      where: { guildId },
      data: {
        ...(settings.antiInvite !== undefined && { antiInvite: settings.antiInvite }),
        ...(settings.antiLinks !== undefined && { antiLinks: settings.antiLinks }),
        ...(settings.antiSpam !== undefined && { antiSpam: settings.antiSpam }),
        ...(settings.maxMentions !== undefined && { maxMentions: settings.maxMentions }),
      },
    });
  }
}

export const autoModService = new AutoModService();

