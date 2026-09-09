import { PrismaClient } from "../generated/client/index.js";

export const prisma = new PrismaClient();

export async function disconnectDb(): Promise<void> {
  await prisma.$disconnect();
}
