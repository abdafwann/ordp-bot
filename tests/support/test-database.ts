import { randomUUID } from "node:crypto";
import { tmpdir } from "node:os";
import { join } from "node:path";

export function createTestDatabaseUrl(): string {
  return `file:${join(tmpdir(), `ordp-bot-test-${randomUUID()}.db`)}`;
}
