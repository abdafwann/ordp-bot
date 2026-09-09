import { describe, it, expect } from "vitest";
import { envSchema } from "../../src/config/env.js";

describe("Environment Config Validation", () => {
  it("should validate and parse valid environment variables", () => {
    const rawEnv = {
      DISCORD_TOKEN: "mock_discord_token_123",
      DISCORD_CLIENT_ID: "123456789012345678",
      ROUTER_BASE_URL: "https://api.9router.com/v1",
      ROUTER_API_KEY: "mock_router_key",
      ROUTER_MODEL: "gpt-4o-mini",
      AI_MAX_CONTEXT_MESSAGES: "15",
      AI_MAX_CONTEXT_AGE_MINUTES: "45",
      PORT: "4000",
      DATABASE_URL: "file:./test.db",
    };

    const parsed = envSchema.parse(rawEnv);
    expect(parsed.DISCORD_TOKEN).toBe("mock_discord_token_123");
    expect(parsed.PORT).toBe(4000);
    expect(parsed.AI_MAX_CONTEXT_MESSAGES).toBe(15);
    expect(parsed.AI_MAX_CONTEXT_AGE_MINUTES).toBe(45);
  });

  it("should use defaults when optional values are omitted", () => {
    const rawEnv = {
      DISCORD_TOKEN: "mock_token",
      DISCORD_CLIENT_ID: "mock_client",
    };

    const parsed = envSchema.parse(rawEnv);
    expect(parsed.PORT).toBe(3000);
    expect(parsed.AI_MAX_CONTEXT_MESSAGES).toBe(10);
    expect(parsed.AI_MAX_CONTEXT_AGE_MINUTES).toBe(30);
    expect(parsed.DATABASE_URL).toBe("file:./dev.db");
  });

  it("should throw validation error when required keys are missing", () => {
    const rawEnv = {};
    expect(() => envSchema.parse(rawEnv)).toThrow();
  });
});
