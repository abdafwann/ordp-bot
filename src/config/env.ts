import { config } from "dotenv";
import { resolve } from "node:path";
import { z } from "zod";

config({
  path: process.env.DOTENV_CONFIG_PATH ?? resolve(process.cwd(), ".env"),
});

export const envSchema = z
  .object({
    DISCORD_TOKEN: z.string().min(1, "DISCORD_TOKEN is required"),
    DISCORD_CLIENT_ID: z.string().min(1, "DISCORD_CLIENT_ID is required"),
    DISCORD_GUILD_ID: z.string().optional(),

    OMNIROUTE_BASE_URL: z.string().url().optional(),
    OMNIROUTE_API_KEY: z.string().optional(),
    OMNIROUTE_MODEL: z.string().optional(),

    ROUTER_BASE_URL: z.string().url().optional(),
    ROUTER_API_KEY: z.string().optional(),
    ROUTER_MODEL: z.string().optional(),

    AI_MAX_CONTEXT_MESSAGES: z.coerce.number().int().positive().default(10),
    AI_MAX_CONTEXT_AGE_MINUTES: z.coerce.number().int().positive().default(30),
    AI_CLEANUP_CRON: z.string().default("0 * * * *"),
    AI_CHANNEL_ID: z.string().optional(),
    BOT_OWNER_ID: z.string().optional(),

    PORT: z.coerce.number().int().positive().default(3000),
    GITHUB_WEBHOOK_SECRET: z.string().optional(),
    GITHUB_DEFAULT_CHANNEL_ID: z.string().optional(),
    GITHUB_FALLBACK_CHANNEL_ID: z.string().optional(),
    GITHUB_CATEGORY_ID: z.string().optional(),

    AUDIT_LOG_CHANNEL_ID: z.string().optional(),
    NARRATION_CHANNEL_ID: z.string().optional(),
    SYS_ALERTS_CHANNEL_ID: z.string().optional(),
    SERVER_LOGS_CHANNEL_ID: z.string().optional(),
    AUDIT_HMAC_SECRET_FILE: z.string().optional(),
    AUDIT_SOCKET_PATH: z.string().optional(),

    DATABASE_URL: z.string().default("file:./dev.db"),
  })
  .transform((data) => {
    const baseUrl =
      data.OMNIROUTE_BASE_URL ??
      data.ROUTER_BASE_URL ??
      "http://localhost:8000/v1";
    const apiKey =
      data.OMNIROUTE_API_KEY ?? data.ROUTER_API_KEY ?? "dummy-key";
    const model =
      data.OMNIROUTE_MODEL ?? data.ROUTER_MODEL ?? "gpt-4o-mini";

    return {
      ...data,
      OMNIROUTE_BASE_URL: baseUrl,
      OMNIROUTE_API_KEY: apiKey,
      OMNIROUTE_MODEL: model,
      ROUTER_BASE_URL: baseUrl,
      ROUTER_API_KEY: apiKey,
      ROUTER_MODEL: model,
    };
  });

export type EnvConfig = z.infer<typeof envSchema>;

function stripEmptyStrings(
  raw: Record<string, unknown>
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(raw)) {
    out[key] = value === "" ? undefined : value;
  }
  return out;
}

export function validateEnv(rawEnv: Record<string, unknown> = process.env): EnvConfig {
  const isTest = process.env.NODE_ENV === "test";
  const source = stripEmptyStrings(
    isTest
      ? {
          DISCORD_TOKEN: "mock_test_token",
          DISCORD_CLIENT_ID: "mock_test_client_id",
          ...rawEnv,
        }
      : rawEnv
  );

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
