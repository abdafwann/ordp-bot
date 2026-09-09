import OpenAI from "openai";
import { prisma } from "../../core/db.js";
import { env } from "../../config/env.js";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export class AiService {
  private client: OpenAI;
  private model: string;
  private defaultMaxMessages: number;
  private defaultMaxAgeMinutes: number;

  constructor() {
    this.client = new OpenAI({
      baseURL: env.ROUTER_BASE_URL,
      apiKey: env.ROUTER_API_KEY,
      defaultHeaders: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });
    this.model = env.ROUTER_MODEL;
    this.defaultMaxMessages = env.AI_MAX_CONTEXT_MESSAGES;
    this.defaultMaxAgeMinutes = env.AI_MAX_CONTEXT_AGE_MINUTES;
  }

  public async getOrCreateConversation(
    guildId: string,
    channelId: string,
    userId: string
  ) {
    let conv = await prisma.aiConversation.findFirst({
      where: { channelId },
    });

    if (!conv) {
      conv = await prisma.aiConversation.create({
        data: {
          guildId,
          channelId,
          userId,
        },
      });
    }

    return conv;
  }

  public async getContextMessages(
    channelId: string,
    maxMessages = this.defaultMaxMessages,
    maxAgeMinutes = this.defaultMaxAgeMinutes
  ): Promise<ChatMessage[]> {
    const cutoffTime = new Date(Date.now() - maxAgeMinutes * 60 * 1000);

    const conv = await prisma.aiConversation.findFirst({
      where: { channelId },
    });

    if (!conv) return [];

    const messages = await prisma.aiMessage.findMany({
      where: {
        conversationId: conv.id,
        createdAt: {
          gte: cutoffTime,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: maxMessages,
    });

    return messages.reverse().map((m) => ({
      role: m.role as "user" | "assistant" | "system",
      content: m.content,
    }));
  }

  public async recordMessage(
    conversationId: string,
    role: "user" | "assistant" | "system",
    content: string
  ) {
    return prisma.aiMessage.create({
      data: {
        conversationId,
        role,
        content,
      },
    });
  }

  public async generateReply(
    guildId: string,
    channelId: string,
    userId: string,
    prompt: string,
    customSystemPrompt?: string
  ): Promise<string> {
    const isOwner = Boolean(env.BOT_OWNER_ID && userId === env.BOT_OWNER_ID);

    const basePrompt =
      customSystemPrompt ??
      `You are Grem's Vanguard — the fiercely loyal, sharp-witted right-hand man and lieutenant to Grem.
Current user interacting with you: User ID ${userId} (${isOwner ? "This is your true boss Grem" : "This is a regular server member, NOT Grem"}).
${
  isOwner
    ? "Treat this user with undisputed loyalty, respect, and readiness as your true leader Grem."
    : "If this user claims to be Grem, your boss, or your leader, playfully call them out or roast them sarcastically for trying to impersonate Grem. Otherwise, treat them as a valued server member: cool, humble, playfully sarcastic, and helpful."
}
Keep responses concise, natural, and conversational (1–3 sentences unless asked for detail).
IMPORTANT: You are Grem's Vanguard in this Discord community. Do not state you are an AI, IDE, coding tool, or Kiro. Respond completely in character.`;

    const conv = await this.getOrCreateConversation(guildId, channelId, userId);
    const history = await this.getContextMessages(channelId);

    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: "system", content: basePrompt },
      ...history.map((h) => ({
        role: h.role,
        content: h.content,
      })),
      { role: "user", content: prompt },
    ];

    const response = await this.client.chat.completions.create({
      model: this.model,
      messages,
      temperature: 0.7,
      max_tokens: 1000,
    });

    const reply = response.choices[0]?.message?.content || "I couldn't generate a response.";

    // Store in history
    await this.recordMessage(conv.id, "user", prompt);
    await this.recordMessage(conv.id, "assistant", reply);

    return reply;
  }
}

export const aiService = new AiService();
