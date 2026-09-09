import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { prisma, disconnectDb } from "../../../src/core/db.js";
import { ModerationService } from "../../../src/modules/moderation/moderation.service.js";
import { TicketService } from "../../../src/modules/moderation/ticket.service.js";

describe("Moderation & Ticket Services", () => {
  const guildId = "test-guild-mod";
  const userId = "test-user-mod";
  const modId = "test-moderator-mod";

  beforeEach(async () => {
    await prisma.warning.deleteMany({ where: { guildId } });
    await prisma.ticket.deleteMany({ where: { guildId } });
  });

  afterAll(async () => {
    await prisma.warning.deleteMany({ where: { guildId } });
    await prisma.ticket.deleteMany({ where: { guildId } });
    await disconnectDb();
  });

  it("should create and fetch user warnings", async () => {
    const modService = new ModerationService();

    const warn1 = await modService.warnUser(guildId, userId, modId, "Spamming links");
    const warn2 = await modService.warnUser(guildId, userId, modId, "Inappropriate language");

    expect(warn1.reason).toBe("Spamming links");
    expect(warn2.reason).toBe("Inappropriate language");

    const warnings = await modService.getWarnings(guildId, userId);
    expect(warnings.length).toBe(2);
    expect(warnings[0].reason).toBe("Inappropriate language"); // desc order
  });

  it("should clear user warnings", async () => {
    const modService = new ModerationService();

    await modService.warnUser(guildId, userId, modId, "Spamming");
    const clearedCount = await modService.clearWarnings(guildId, userId);
    expect(clearedCount).toBe(1);

    const remaining = await modService.getWarnings(guildId, userId);
    expect(remaining.length).toBe(0);
  });

  it("should handle ticket creation and closing", async () => {
    const ticketService = new TicketService();
    const channelId = "ticket-channel-999";

    const ticket = await ticketService.createTicket(guildId, channelId, userId);
    expect(ticket.status).toBe("OPEN");
    expect(ticket.channelId).toBe(channelId);

    const closed = await ticketService.closeTicket(channelId);
    expect(closed.status).toBe("CLOSED");
    expect(closed.closedAt).toBeInstanceOf(Date);
  });
});
