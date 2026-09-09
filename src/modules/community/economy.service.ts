import { prisma } from "../../core/db.js";

export class EconomyService {
  public async getAccount(guildId: string, userId: string) {
    let account = await prisma.userEconomy.findUnique({
      where: {
        guildId_userId: { guildId, userId },
      },
    });

    if (!account) {
      account = await prisma.userEconomy.create({
        data: {
          guildId,
          userId,
          balance: 100, // starting balance
        },
      });
    }

    return account;
  }

  public async getBalance(guildId: string, userId: string): Promise<number> {
    const account = await this.getAccount(guildId, userId);
    return account.balance;
  }

  public async claimDaily(
    guildId: string,
    userId: string
  ): Promise<{
    success: boolean;
    reward: number;
    remainingMs?: number;
    newBalance?: number;
  }> {
    const account = await this.getAccount(guildId, userId);
    const now = new Date();
    const cooldownMs = 24 * 60 * 60 * 1000; // 24 hours

    if (account.lastDailyAt && now.getTime() - account.lastDailyAt.getTime() < cooldownMs) {
      const remainingMs = cooldownMs - (now.getTime() - account.lastDailyAt.getTime());
      return {
        success: false,
        reward: 0,
        remainingMs,
      };
    }

    const reward = 100;
    const updated = await prisma.userEconomy.update({
      where: {
        guildId_userId: { guildId, userId },
      },
      data: {
        balance: { increment: reward },
        lastDailyAt: now,
      },
    });

    return {
      success: true,
      reward,
      newBalance: updated.balance,
    };
  }

  public async coinflip(
    guildId: string,
    userId: string,
    amount: number,
    choice: "heads" | "tails"
  ): Promise<{
    success: boolean;
    error?: string;
    won: boolean;
    outcome: "heads" | "tails";
    newBalance: number;
  }> {
    if (amount <= 0) {
      return {
        success: false,
        error: "Bet amount must be greater than 0.",
        won: false,
        outcome: "heads",
        newBalance: 0,
      };
    }

    const account = await this.getAccount(guildId, userId);
    if (account.balance < amount) {
      return {
        success: false,
        error: `Insufficient balance. You currently have ${account.balance} coins.`,
        won: false,
        outcome: "heads",
        newBalance: account.balance,
      };
    }

    const outcome: "heads" | "tails" = Math.random() < 0.5 ? "heads" : "tails";
    const won = outcome === choice;
    const balanceChange = won ? amount : -amount;

    const updated = await prisma.userEconomy.update({
      where: {
        guildId_userId: { guildId, userId },
      },
      data: {
        balance: { increment: balanceChange },
      },
    });

    return {
      success: true,
      won,
      outcome,
      newBalance: updated.balance,
    };
  }

  public async transfer(
    guildId: string,
    senderId: string,
    receiverId: string,
    amount: number
  ): Promise<{ success: boolean; error?: string }> {
    if (amount <= 0) {
      return { success: false, error: "Amount must be positive." };
    }
    if (senderId === receiverId) {
      return { success: false, error: "You cannot transfer coins to yourself." };
    }

    const sender = await this.getAccount(guildId, senderId);
    if (sender.balance < amount) {
      return { success: false, error: "Insufficient balance for this transfer." };
    }

    await this.getAccount(guildId, receiverId); // ensure receiver account exists

    await prisma.$transaction([
      prisma.userEconomy.update({
        where: { guildId_userId: { guildId, userId: senderId } },
        data: { balance: { decrement: amount } },
      }),
      prisma.userEconomy.update({
        where: { guildId_userId: { guildId, userId: receiverId } },
        data: { balance: { increment: amount } },
      }),
    ]);

    return { success: true };
  }
}

export const economyService = new EconomyService();
