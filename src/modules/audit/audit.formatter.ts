import { EmbedBuilder } from "discord.js";

export type AuditSeverity = "info" | "warn" | "error";
export type AuditKind = "audit" | "narration";

export interface AuditLogPayload {
  timestamp: string;
  command: string;
  severity?: AuditSeverity;
  context?: string;
}

export interface NarrationPayload {
  timestamp: string;
  summary: string;
  title?: string;
}

const SEVERITY_COLORS: Record<AuditSeverity, number> = {
  info: 0x1f6feb, // blue
  warn: 0xfee75c, // yellow
  error: 0xda3633, // red
};

const SEVERITY_ORDER: AuditSeverity[] = ["info", "warn", "error"];
const MAX_DESCRIPTION_LENGTH = 4000;

function resolveSeverity(severity?: string): AuditSeverity {
  return severity === "warn" || severity === "error" ? severity : "info";
}

function parseTimestamp(timestamp?: string): Date | null {
  if (!timestamp) return null;
  const date = new Date(timestamp);
  return Number.isNaN(date.getTime()) ? null : date;
}

function truncate(text: string): string {
  if (text.length <= MAX_DESCRIPTION_LENGTH) return text;
  return `${text.slice(0, MAX_DESCRIPTION_LENGTH - 14)}\n…(truncated)`;
}

function formatEntryLine(entry: AuditLogPayload): string {
  const severity = resolveSeverity(entry.severity);
  const context = entry.context ? ` — ${entry.context}` : "";
  return `\`${entry.command}\` **(${severity})**${context}`;
}

export function formatAuditEntry(payload: AuditLogPayload): EmbedBuilder {
  const severity = resolveSeverity(payload.severity);

  const lines = [`**Command:** \`${payload.command}\``];
  if (payload.context) {
    lines.push(`**Context:** ${payload.context}`);
  }

  const embed = new EmbedBuilder()
    .setColor(SEVERITY_COLORS[severity])
    .setTitle(`[Agent] ${severity}`)
    .setDescription(truncate(lines.join("\n")));

  const timestamp = parseTimestamp(payload.timestamp);
  if (timestamp) {
    embed.setTimestamp(timestamp);
  }

  return embed;
}

export function formatAuditEntries(entries: AuditLogPayload[]): EmbedBuilder {
  if (entries.length === 0) {
    throw new Error("Cannot format an empty audit batch");
  }

  const highestSeverity = entries
    .map((entry) => resolveSeverity(entry.severity))
    .reduce(
      (highest, severity) =>
        SEVERITY_ORDER.indexOf(severity) > SEVERITY_ORDER.indexOf(highest)
          ? severity
          : highest,
      "info" as AuditSeverity
    );

  const description = entries
    .map((entry, index) => `${index + 1}. ${formatEntryLine(entry)}`)
    .join("\n");

  const embed = new EmbedBuilder()
    .setColor(SEVERITY_COLORS[highestSeverity])
    .setTitle(`[Agent] Audit Log (${entries.length} ${entries.length === 1 ? "entry" : "entries"})`)
    .setDescription(truncate(description));

  const latestTimestamp = parseTimestamp(
    entries[entries.length - 1]?.timestamp
  );
  if (latestTimestamp) {
    embed.setTimestamp(latestTimestamp);
  }

  return embed;
}

export function formatNarration(payload: NarrationPayload): EmbedBuilder {
  const embed = new EmbedBuilder()
    .setColor(0x8957e5) // purple, distinct from audit colors
    .setTitle(payload.title ?? "[Hermes] Activity")
    .setDescription(truncate(payload.summary));

  const timestamp = parseTimestamp(payload.timestamp);
  if (timestamp) {
    embed.setTimestamp(timestamp);
  }

  return embed;
}
