import http, { IncomingMessage, ServerResponse } from "node:http";
import { readFileSync, existsSync, unlinkSync, chmodSync } from "node:fs";
import { Client, TextChannel } from "discord.js";
import { env } from "../../config/env.js";
import { verifyAuditSignature } from "./audit.verifier.js";
import {
  formatAuditEntry,
  formatAuditEntries,
  formatNarration,
  AuditLogPayload,
  AuditSeverity,
} from "./audit.formatter.js";

const AUDIT_SEVERITIES: readonly AuditSeverity[] = ["info", "warn", "error"];

function parseAuditEntry(entry: unknown): AuditLogPayload {
  if (typeof entry !== "object" || entry === null || Array.isArray(entry)) {
    throw new Error("Audit entry must be a JSON object");
  }
  const record = entry as Record<string, unknown>;
  if (typeof record.timestamp !== "string" || record.timestamp.trim() === "") {
    throw new Error("`timestamp` is required and must be a non-empty string");
  }
  if (typeof record.command !== "string" || record.command.trim() === "") {
    throw new Error("`command` is required and must be a non-empty string");
  }
  if (record.severity !== undefined && !AUDIT_SEVERITIES.includes(record.severity as AuditSeverity)) {
    throw new Error("`severity` must be one of: info, warn, error");
  }
  if (record.context !== undefined && typeof record.context !== "string") {
    throw new Error("`context` must be a string");
  }
  return {
    timestamp: record.timestamp,
    command: record.command,
    severity: record.severity as AuditSeverity | undefined,
    context: record.context as string | undefined,
  };
}

function parseAuditPayload(body: unknown): AuditLogPayload[] {
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    throw new Error("Request body must be a JSON object");
  }
  const record = body as Record<string, unknown>;
  if ("entries" in record) {
    if (!Array.isArray(record.entries) || record.entries.length === 0) {
      throw new Error("`entries` must be a non-empty array");
    }
    return record.entries.map(parseAuditEntry);
  }
  return [parseAuditEntry(record)];
}

type AuditKind = "audit" | "narration";

interface ParsedAuditRequest {
  kind: AuditKind;
  entries: AuditLogPayload[];
  narration?: { timestamp: string; summary: string; title?: string };
}

function parseAuditRequest(body: unknown): ParsedAuditRequest {
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    throw new Error("Request body must be a JSON object");
  }
  const record = body as Record<string, unknown>;
  const kind: AuditKind = record.kind === "narration" ? "narration" : "audit";
  if (kind === "narration") {
    if (typeof record.summary !== "string" || record.summary.trim() === "") {
      throw new Error("`summary` is required for narration entries");
    }
    if (typeof record.timestamp !== "string" || record.timestamp.trim() === "") {
      throw new Error("`timestamp` is required and must be a non-empty string");
    }
    return {
      kind,
      entries: [],
      narration: {
        timestamp: record.timestamp,
        summary: record.summary,
        title: typeof record.title === "string" ? record.title : undefined,
      },
    };
  }
  return { kind, entries: parseAuditPayload(body) };
}

function shouldAlert(entries: AuditLogPayload[]): boolean {
  return entries.some((e) => e.severity === "warn" || e.severity === "error");
}

function isError(entries: AuditLogPayload[]): boolean {
  return entries.some((e) => e.severity === "error");
}

export function readAuditSecret(): string | null {
  const file = env.AUDIT_HMAC_SECRET_FILE;
  if (!file) return null;
  try {
    if (!existsSync(file)) return null;
    return readFileSync(file, "utf-8").trim() || null;
  } catch {
    return null;
  }
}

export function createAuditSocketServer(client: Client): http.Server {
  const secret = readAuditSecret();
  if (!secret) {
    throw new Error("AUDIT_HMAC_SECRET_FILE is not configured or unreadable");
  }

  return http.createServer(async (req: IncomingMessage, res: ServerResponse) => {
    if (req.method !== "POST" || req.url !== "/api/audit-log") {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Not found" }));
      return;
    }

    const chunks: Uint8Array[] = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", async () => {
      const rawBody = Buffer.concat(chunks).toString("utf-8");
      const signature = req.headers["x-audit-signature"] as string | undefined;

      if (!verifyAuditSignature(rawBody, signature, secret)) {
        res.writeHead(401, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Invalid signature" }));
        return;
      }

      let parsed: ParsedAuditRequest;
      try {
        parsed = parseAuditRequest(JSON.parse(rawBody));
      } catch (err) {
        console.error("[Audit Socket] Rejected malformed payload:", err);
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Bad request" }));
        return;
      }

      try {
        if (parsed.kind === "narration") {
          if (!env.NARRATION_CHANNEL_ID) {
            res.writeHead(503, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "NARRATION_CHANNEL_ID is not configured" }));
            return;
          }
          const narrationChannel = await client.channels
            .fetch(env.NARRATION_CHANNEL_ID)
            .catch(() => null);
          if (!narrationChannel || !narrationChannel.isTextBased()) {
            res.writeHead(502, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Narration channel unavailable" }));
            return;
          }
          await (narrationChannel as TextChannel).send({
            embeds: [formatNarration(parsed.narration!)],
          });
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ success: true, kind: "narration" }));
          return;
        }

        if (!env.AUDIT_LOG_CHANNEL_ID) {
          res.writeHead(503, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "AUDIT_LOG_CHANNEL_ID is not configured" }));
          return;
        }
        const entries = parsed.entries;
        const feedChannel = await client.channels
          .fetch(env.AUDIT_LOG_CHANNEL_ID)
          .catch(() => null);
        if (!feedChannel || !feedChannel.isTextBased()) {
          res.writeHead(502, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Audit log channel unavailable" }));
          return;
        }
        const embed =
          entries.length === 1 ? formatAuditEntry(entries[0]) : formatAuditEntries(entries);
        await (feedChannel as TextChannel).send({ embeds: [embed] });

        if (shouldAlert(entries) && env.SYS_ALERTS_CHANNEL_ID) {
          const alertsChannel = await client.channels
            .fetch(env.SYS_ALERTS_CHANNEL_ID)
            .catch(() => null);
          if (alertsChannel && alertsChannel.isTextBased()) {
            const ping = isError(entries) && env.BOT_OWNER_ID ? `<@${env.BOT_OWNER_ID}> ` : "";
            await (alertsChannel as TextChannel)
              .send({ content: ping, embeds: [embed] })
              .catch((err) => console.error("[Audit Socket] Failed to send alert:", err));
          }
        }

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true, entries: entries.length }));
      } catch (err) {
        console.error("[Audit Socket Server Error]", err);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Internal server error" }));
      }
    });
  });
}

export function startAuditSocketServer(client: Client): http.Server | null {
  const secret = readAuditSecret();
  if (!secret) {
    console.warn("[Audit Socket] Skipping: AUDIT_HMAC_SECRET_FILE not configured.");
    return null;
  }
  const socketPath = env.AUDIT_SOCKET_PATH ?? "/home/afwan/.config/ordp/audit.sock";
  const server = createAuditSocketServer(client);
  try {
    unlinkSync(socketPath);
  } catch {
    /* no stale socket */
  }
  server.listen(socketPath, () => {
    chmodSync(socketPath, 0o600);
    console.log(`[Audit Socket] Listening on ${socketPath}`);
  });
  return server;
}
