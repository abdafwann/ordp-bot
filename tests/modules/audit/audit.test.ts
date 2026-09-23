import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import http from "node:http";
import { createHmac } from "node:crypto";
import { writeFileSync, rmSync } from "node:fs";
import type { Client } from "discord.js";
import {
  formatAuditEntry,
  formatAuditEntries,
  formatNarration,
} from "../../../src/modules/audit/audit.formatter.js";

describe("Audit Log Embed Formatter", () => {
  it("should format an info entry with blue color and default severity", () => {
    const embed = formatAuditEntry({
      timestamp: "2026-09-21T10:00:00Z",
      command: "journalctl -b",
      context: "checking boot logs",
    });

    expect(embed.data.title).toBe("[Agent] info");
    expect(embed.data.color).toBe(0x1f6feb);
    expect(embed.data.description).toContain("journalctl -b");
    expect(embed.data.description).toContain("checking boot logs");
  });

  it("should format a warn entry with yellow color", () => {
    const embed = formatAuditEntry({
      timestamp: "2026-09-21T10:00:00Z",
      command: "systemctl status foo",
      severity: "warn",
    });

    expect(embed.data.title).toBe("[Agent] warn");
    expect(embed.data.color).toBe(0xfee75c);
  });

  it("should format an error entry with red color", () => {
    const embed = formatAuditEntry({
      timestamp: "2026-09-21T10:00:00Z",
      command: "pacman -Syu",
      severity: "error",
      context: "package conflict",
    });

    expect(embed.data.title).toBe("[Agent] error");
    expect(embed.data.color).toBe(0xda3633);
    expect(embed.data.description).toContain("package conflict");
  });

  it("should set the embed timestamp from the payload", () => {
    const embed = formatAuditEntry({
      timestamp: "2026-09-21T10:00:00Z",
      command: "uptime",
    });

    expect(embed.data.timestamp).toBe("2026-09-21T10:00:00.000Z");
  });

  it("should render multiple lines for a batched payload", () => {
    const embed = formatAuditEntries([
      { timestamp: "2026-09-21T10:00:00Z", command: "ls -la", severity: "info" },
      { timestamp: "2026-09-21T10:00:01Z", command: "cat /etc/hosts", severity: "warn" },
    ]);

    expect(embed.data.title).toContain("2 entries");
    expect(embed.data.description).toContain("1. `ls -la`");
    expect(embed.data.description).toContain("2. `cat /etc/hosts`");
    expect(embed.data.description?.split("\n")).toHaveLength(2);
  });

  it("should color a batch by its highest severity", () => {
    const embed = formatAuditEntries([
      { timestamp: "2026-09-21T10:00:00Z", command: "ls", severity: "info" },
      { timestamp: "2026-09-21T10:00:01Z", command: "fail", severity: "error" },
    ]);

    expect(embed.data.color).toBe(0xda3633);
  });

  it("should reject an empty batch", () => {
    expect(() => formatAuditEntries([])).toThrow();
  });

  it("should format a narration embed with purple color and default title", () => {
    const embed = formatNarration({
      timestamp: "2026-09-21T10:00:00Z",
      summary: "Reading boot logs to diagnose the network issue — done.",
    });

    expect(embed.data.title).toBe("[Hermes] Activity");
    expect(embed.data.color).toBe(0x8957e5);
    expect(embed.data.description).toContain("Reading boot logs");
  });

  it("should format a narration embed with a custom title", () => {
    const embed = formatNarration({
      timestamp: "2026-09-21T10:00:00Z",
      title: "[Hermes] Task Complete",
      summary: "Upgraded the kernel and rebooted.",
    });

    expect(embed.data.title).toBe("[Hermes] Task Complete");
    expect(embed.data.description).toContain("Upgraded the kernel");
  });
});

// ---- socket server harness ----

const AUDIT_SECRET = "test-secret";
process.env.AUDIT_HMAC_SECRET_FILE = "/tmp/ordp-audit-hmac.key";
process.env.AUDIT_SOCKET_PATH = "/tmp/ordp-audit-test.sock";
process.env.AUDIT_LOG_CHANNEL_ID = "audit-channel-id";
process.env.NARRATION_CHANNEL_ID = "narration-channel-id";
writeFileSync("/tmp/ordp-audit-hmac.key", AUDIT_SECRET, { mode: 0o600 });

const sentEmbeds: Array<{ data: { title?: string; description?: string } }> = [];
const sentAlerts: Array<{ content?: string; embeds: unknown[] }> = [];

const fakeClient = {
  user: { tag: "bot#0001" },
  channels: {
    fetch: vi.fn(async (id: string) => {
      if (id !== "audit-channel-id" && id !== "narration-channel-id") return null;
      if (id === "narration-channel-id") {
        return {
          isTextBased: () => true,
          send: async (message: { embeds: unknown[] }) => {
            sentEmbeds.push(...(message.embeds as typeof sentEmbeds));
          },
        };
      }
      return {
        isTextBased: () => true,
        send: async (message: { embeds: unknown[] }) => {
          sentEmbeds.push(...(message.embeds as typeof sentEmbeds));
        },
      };
    }),
  },
} as unknown as Client;

const { createAuditSocketServer } = await import(
  "../../../src/modules/audit/audit.server.js"
);

function sign(body: string): string {
  return createHmac("sha256", AUDIT_SECRET).update(body).digest("hex");
}

function postSocket(socketPath: string, body: unknown, signature?: string) {
  return new Promise<{ status: number; data: string }>((resolve, reject) => {
    const payload = JSON.stringify(body);
    const req = http.request(
      {
        socketPath,
        path: "/api/audit-log",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(signature ? { "x-audit-signature": signature } : {}),
        },
      },
      (res) => {
        let data = "";
        res.on("data", (c) => (data += c));
        res.on("end", () => resolve({ status: res.statusCode ?? 0, data }));
      }
    );
    req.on("error", reject);
    req.write(payload);
    req.end();
  });
}

describe("Audit Log Socket Endpoint", () => {
  let server: ReturnType<typeof createAuditSocketServer>;

  beforeAll(async () => {
    rmSync("/tmp/ordp-audit-test.sock", { force: true });
    server = createAuditSocketServer(fakeClient);
    await new Promise<void>((resolve) =>
      server.listen("/tmp/ordp-audit-test.sock", resolve)
    );
  });

  afterAll(async () => {
    await new Promise<void>((resolve) => server.close(() => resolve()));
    rmSync("/tmp/ordp-audit-test.sock", { force: true });
  });

  it("accepts a signed single entry", async () => {
    const before = sentEmbeds.length;
    const body = { timestamp: "2026-09-21T10:00:00Z", command: "ls", severity: "info" };
    const res = await postSocket("/tmp/ordp-audit-test.sock", body, sign(JSON.stringify(body)));
    expect(res.status).toBe(200);
    expect(sentEmbeds).toHaveLength(before + 1);
  });

  it("rejects a request with no signature (401)", async () => {
    const body = { timestamp: "2026-09-21T10:00:00Z", command: "ls" };
    const res = await postSocket("/tmp/ordp-audit-test.sock", body);
    expect(res.status).toBe(401);
  });

  it("rejects a request with a bad signature (401)", async () => {
    const body = { timestamp: "2026-09-21T10:00:00Z", command: "ls" };
    const res = await postSocket("/tmp/ordp-audit-test.sock", body, "deadbeef");
    expect(res.status).toBe(401);
  });

  it("accepts a signed narration payload", async () => {
    const body = { kind: "narration", timestamp: "2026-09-21T10:05:00Z", summary: "done." };
    const res = await postSocket("/tmp/ordp-audit-test.sock", body, sign(JSON.stringify(body)));
    expect(res.status).toBe(200);
  });

  it("rejects a malformed signed entry (400)", async () => {
    const body = { timestamp: "2026-09-21T10:00:00Z" };
    const res = await postSocket("/tmp/ordp-audit-test.sock", body, sign(JSON.stringify(body)));
    expect(res.status).toBe(400);
  });
});
