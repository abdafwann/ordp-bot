import { prisma } from "../../core/db.js";

export class ModerationService {
  public async warnUser(
    guildId: string,
    userId: string,
    moderatorId: string,
    reason: string
  ) {
    return prisma.warning.create({
      data: {
        guildId,
        userId,
        moderatorId,
        reason,
      },
    });
  }

  public async getWarnings(guildId: string, userId: string) {
    return prisma.warning.findMany({
      where: { guildId, userId },
      orderBy: { createdAt: "desc" },
    });
  }

  public async clearWarnings(guildId: string, userId: string): Promise<number> {
    const result = await prisma.warning.deleteMany({
      where: { guildId, userId },
    });
    return result.count;
  }
}

export const moderationService = new ModerationService();
