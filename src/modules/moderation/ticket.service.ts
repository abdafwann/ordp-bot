import { prisma } from "../../core/db.js";

export class TicketService {
  public async createTicket(guildId: string, channelId: string, userId: string) {
    return prisma.ticket.create({
      data: {
        guildId,
        channelId,
        userId,
        status: "OPEN",
      },
    });
  }

  public async getTicketByChannel(channelId: string) {
    return prisma.ticket.findUnique({
      where: { channelId },
    });
  }

  public async closeTicket(channelId: string) {
    return prisma.ticket.update({
      where: { channelId },
      data: {
        status: "CLOSED",
        closedAt: new Date(),
      },
    });
  }
}

export const ticketService = new TicketService();
