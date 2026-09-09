import { prisma } from "../../core/db.js";

export class LevelingService {
  public calculateLevel(xp: number): number {
    if (xp <= 0) return 1;
    return Math.floor(Math.sqrt(xp / 25)) + 1;
  }

  public xpRequiredForLevel(level: number): number {
    if (level <= 1) return 0;
    return Math.pow(level - 1, 2) * 25;
  }

  public async getUserLevel(guildId: string, userId: string) {
    let user = await prisma.userLevel.findUnique({
      where: {
        guildId_userId: { guildId, userId },
      },
    });

    if (!user) {
      user = await prisma.userLevel.create({
        data: {
          guildId,
          userId,
          xp: 0,
          level: 1,
        },
      });
    }

    return user;
  }

  public async addMessageXp(
    guildId: string,
    userId: string,
    customXpAmount?: number
  ): Promise<{
    awarded: boolean;
    currentXp: number;
    levelUp: boolean;
    newLevel: number;
  }> {
    const user = await this.getUserLevel(guildId, userId);
    const now = new Date();
    const cooldownMs = 60 * 1000;

    // Check cooldown
    if (now.getTime() - user.lastXpAt.getTime() < cooldownMs && user.xp > 0) {
      return {
        awarded: false,
        currentXp: user.xp,
        levelUp: false,
        newLevel: user.level,
      };
    }

    const xpToAdd = customXpAmount ?? Math.floor(Math.random() * 11) + 15; // 15 - 25 XP
    const newXp = user.xp + xpToAdd;
    const newLevel = this.calculateLevel(newXp);
    const levelUp = newLevel > user.level;

    await prisma.userLevel.update({
      where: {
        guildId_userId: { guildId, userId },
      },
      data: {
        xp: newXp,
        level: newLevel,
        lastXpAt: now,
      },
    });

    return {
      awarded: true,
      currentXp: newXp,
      levelUp,
      newLevel,
    };
  }

  public async getLeaderboard(guildId: string, limit = 10) {
    return prisma.userLevel.findMany({
      where: { guildId },
      orderBy: { xp: "desc" },
      take: limit,
    });
  }
}

export const levelingService = new LevelingService();
