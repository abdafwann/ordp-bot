import { describe, it, expect } from "vitest";
import { envSchema } from "../../src/config/env.js";

describe("Environment Config Validation", () => {
  it("should validate and parse valid environment variables with OmniRoute", () => {
    const rawEnv = {
      DISCORD_TOKEN: "mock_discord_token_123",
      DISCORD_CLIENT_ID: "123456789012345678",
      OMNIROUTE_BASE_URL: "http://localhost:8000/v1",
      OMNIROUTE_API_KEY: "mock_omniroute_key",
      OMNIROUTE_MODEL: "claude-3-5-sonnet",
      AI_MAX_CONTEXT_MESSAGES: "15",
      AI_MAX_CONTEXT_AGE_MINUTES: "45",
      PORT: "4000",
      DATABASE_URL: "file:./test.db",
    };

    const parsed = envSchema.parse(rawEnv);
    expect(parsed.DISCORD_TOKEN).toBe("mock_discord_token_123");
    expect(parsed.OMNIROUTE_BASE_URL).toBe("http://localhost:8000/v1");
    expect(parsed.OMNIROUTE_API_KEY).toBe("mock_omniroute_key");
    expect(parsed.OMNIROUTE_MODEL).toBe("claude-3-5-sonnet");
    expect(parsed.PORT).toBe(4000);
    expect(parsed.AI_MAX_CONTEXT_MESSAGES).toBe(15);
    expect(parsed.AI_MAX_CONTEXT_AGE_MINUTES).toBe(45);
  });

  it("should fallback to legacy ROUTER_* variables if OMNIROUTE_* are not provided", () => {
    const rawEnv = {
      DISCORD_TOKEN: "mock_discord_token_123",
      DISCORD_CLIENT_ID: "123456789012345678",
      ROUTER_BASE_URL: "https://api.9router.com/v1",
      ROUTER_API_KEY: "mock_router_key",
      ROUTER_MODEL: "gpt-4o-mini",
    };

    const parsed = envSchema.parse(rawEnv);
    expect(parsed.OMNIROUTE_BASE_URL).toBe("https://api.9router.com/v1");
    expect(parsed.OMNIROUTE_API_KEY).toBe("mock_router_key");
    expect(parsed.OMNIROUTE_MODEL).toBe("gpt-4o-mini");
    expect(parsed.ROUTER_BASE_URL).toBe("https://api.9router.com/v1");
  });

  it("should use defaults when optional values are omitted", () => {
    const rawEnv = {
      DISCORD_TOKEN: "mock_token",
      DISCORD_CLIENT_ID: "mock_client",
    };

    const parsed = envSchema.parse(rawEnv);
    expect(parsed.OMNIROUTE_BASE_URL).toBe("http://localhost:8000/v1");
    expect(parsed.OMNIROUTE_API_KEY).toBe("dummy-key");
    expect(parsed.OMNIROUTE_MODEL).toBe("gpt-4o-mini");
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
