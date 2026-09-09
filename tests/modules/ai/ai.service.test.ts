import { describe, it, expect, beforeEach, afterAll, vi } from "vitest";
import { prisma, disconnectDb } from "../../../src/core/db.js";
import { AiService } from "../../../src/modules/ai/ai.service.js";
import { cleanupExpiredAiMessages } from "../../../src/cron/ai-cleanup.cron.js";

describe("AI Service & Context Management", () => {
  const guildId = "test-guild-ai";
  const channelId = "test-channel-ai";
  const userId = "test-user-ai";

  beforeEach(async () => {
    await prisma.aiMessage.deleteMany({});
    await prisma.aiConversation.deleteMany({ where: { channelId } });
  });

  afterAll(async () => {
    await prisma.aiMessage.deleteMany({});
    await prisma.aiConversation.deleteMany({ where: { channelId } });
    await disconnectDb();
  });

  it("should retrieve only recent messages within maxAgeMinutes and maxMessages", async () => {
    const aiService = new AiService();

    const conversation = await prisma.aiConversation.create({
      data: {
        guildId,
        channelId,
        userId,
      },
    });

    const now = new Date();
    const fortyMinsAgo = new Date(now.getTime() - 40 * 60 * 1000);
    const tenMinsAgo = new Date(now.getTime() - 10 * 60 * 1000);
    const twoMinsAgo = new Date(now.getTime() - 2 * 60 * 1000);

    // Old expired message (> 30 mins)
    await prisma.aiMessage.create({
      data: {
        conversationId: conversation.id,
        role: "user",
        content: "Old message that should be skipped",
        createdAt: fortyMinsAgo,
      },
    });

    // Recent message 1
    await prisma.aiMessage.create({
      data: {
        conversationId: conversation.id,
        role: "user",
        content: "Recent message 1",
        createdAt: tenMinsAgo,
      },
    });

    // Recent message 2
    await prisma.aiMessage.create({
      data: {
        conversationId: conversation.id,
        role: "assistant",
        content: "Recent message 2",
        createdAt: twoMinsAgo,
      },
    });

    const context = await aiService.getContextMessages(channelId, 10, 30);
    expect(context.length).toBe(2);
    expect(context[0].content).toBe("Recent message 1");
    expect(context[1].content).toBe("Recent message 2");
  });

  it("should respect maxMessages limit when messages exceed count", async () => {
    const aiService = new AiService();

    const conversation = await prisma.aiConversation.create({
      data: {
        guildId,
        channelId,
        userId,
      },
    });

    // Create 5 recent messages
    for (let i = 1; i <= 5; i++) {
      await prisma.aiMessage.create({
        data: {
          conversationId: conversation.id,
          role: i % 2 === 0 ? "assistant" : "user",
          content: `Message ${i}`,
          createdAt: new Date(Date.now() - (6 - i) * 1000),
        },
      });
    }

    // Request max 3 messages
    const context = await aiService.getContextMessages(channelId, 3, 30);
    expect(context.length).toBe(3);
    expect(context[0].content).toBe("Message 3");
    expect(context[1].content).toBe("Message 4");
    expect(context[2].content).toBe("Message 5");
  });

  it("should hard delete expired messages in cleanup cron", async () => {
    const conversation = await prisma.aiConversation.create({
      data: {
        guildId,
        channelId,
        userId,
      },
    });

    const sixtyMinsAgo = new Date(Date.now() - 60 * 60 * 1000);
    await prisma.aiMessage.create({
      data: {
        conversationId: conversation.id,
        role: "user",
        content: "Expired message to be deleted by cron",
        createdAt: sixtyMinsAgo,
      },
    });

    await prisma.aiMessage.create({
      data: {
        conversationId: conversation.id,
        role: "user",
        content: "Active message to keep",
        createdAt: new Date(),
      },
    });

    const deletedCount = await cleanupExpiredAiMessages(30);
    expect(deletedCount).toBeGreaterThanOrEqual(1);

    const remaining = await prisma.aiMessage.findMany({
      where: { conversationId: conversation.id },
    });
    expect(remaining.length).toBe(1);
    expect(remaining[0].content).toBe("Active message to keep");
  });
});
