import cron from "node-cron";
import { prisma } from "../core/db.js";
import { env } from "../config/env.js";

export async function cleanupExpiredAiMessages(
  maxAgeMinutes = env.AI_MAX_CONTEXT_AGE_MINUTES
): Promise<number> {
  const cutoff = new Date(Date.now() - maxAgeMinutes * 60 * 1000);
  const result = await prisma.aiMessage.deleteMany({
    where: {
      createdAt: {
        lt: cutoff,
      },
    },
  });
  return result.count;
}

export function startAiCleanupCron(cronPattern = env.AI_CLEANUP_CRON) {
  return cron.schedule(cronPattern, async () => {
    try {
      const deleted = await cleanupExpiredAiMessages();
      if (deleted > 0) {
        console.log(`[AI Cleanup Cron] Purged ${deleted} expired AI context messages.`);
      }
    } catch (error) {
      console.error("[AI Cleanup Cron] Error purging expired AI messages:", error);
    }
  });
}
