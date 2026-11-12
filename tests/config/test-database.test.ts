import { describe, expect, it } from "vitest";
import { createTestDatabaseUrl } from "../support/test-database.js";

describe("test database isolation", () => {
  it("creates a separate SQLite database for each test run", () => {
    const first = createTestDatabaseUrl();
    const second = createTestDatabaseUrl();

    expect(first).toMatch(/^file:/);
    expect(second).not.toBe(first);
    expect(first).not.toContain("prisma/dev.db");
  });

  it("configures test workers to use the temporary database", () => {
    expect(process.env.DATABASE_URL).toMatch(/ordp-bot-test-[\da-f-]+\.db$/);
  });
});
