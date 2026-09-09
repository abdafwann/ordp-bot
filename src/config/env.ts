import { config } from "dotenv";
import { z } from "zod";

config();

export const envSchema = z.object({
  DISCORD_TOKEN: z.string().min(1, "DISCORD_TOKEN is required"),
  DISCORD_CLIENT_ID: z.string().min(1, "DISCORD_CLIENT_ID is required"),
  DISCORD_GUILD_ID: z.string().optional(),

  ROUTER_BASE_URL: z.string().url().default("http://localhost:20128/v1"),
  ROUTER_API_KEY: z.string().default("dummy-key"),
  ROUTER_MODEL: z.string().default("gpt-4o-mini"),

  AI_MAX_CONTEXT_MESSAGES: z.coerce.number().int().positive().default(10),
  AI_MAX_CONTEXT_AGE_MINUTES: z.coerce.number().int().positive().default(30),
  AI_CLEANUP_CRON: z.string().default("0 * * * *"),
  AI_CHANNEL_ID: z.string().optional(),
  BOT_OWNER_ID: z.string().optional(),

  PORT: z.coerce.number().int().positive().default(3000),
  GITHUB_WEBHOOK_SECRET: z.string().optional(),
  GITHUB_DEFAULT_CHANNEL_ID: z.string().optional(),

  DATABASE_URL: z.string().default("file:./dev.db"),
});

export type EnvConfig = z.infer<typeof envSchema>;

export function validateEnv(rawEnv: Record<string, unknown> = process.env): EnvConfig {
  const isTest = process.env.NODE_ENV === "test";
  const source = isTest
    ? {
        DISCORD_TOKEN: "mock_test_token",
        DISCORD_CLIENT_ID: "mock_test_client_id",
        ...rawEnv,
      }
    : rawEnv;

  const result = envSchema.safeParse(source);
  if (!result.success) {
    const errorDetails = result.error.errors
      .map((e) => `${e.path.join(".")}: ${e.message}`)
      .join(", ");
    throw new Error(`Environment validation failed: ${errorDetails}`);
  }
  return result.data;
}

export const env: EnvConfig = (() => {
  try {
    return validateEnv(process.env);
  } catch {
    if (process.env.NODE_ENV === "test") {
      return validateEnv({
        DISCORD_TOKEN: "test_token",
        DISCORD_CLIENT_ID: "test_client_id",
      });
    }
    throw new Error("Missing required environment variables. Please check .env file.");
  }
})();
