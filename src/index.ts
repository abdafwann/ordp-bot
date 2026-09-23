import { ExtendedClient } from "./core/client.js";
import { registerCommands } from "./core/command-loader.js";
import { registerReadyEvent } from "./events/ready.event.js";
import { registerInteractionCreateEvent } from "./events/interactionCreate.event.js";
import { registerMessageCreateEvent } from "./events/messageCreate.event.js";
import { registerVoiceStateUpdateEvent } from "./events/voiceStateUpdate.event.js";
import { registerServerLogsEvents } from "./events/serverlogs.event.js";
import { startAiCleanupCron } from "./cron/ai-cleanup.cron.js";
import { startReminderCron } from "./cron/reminder.cron.js";
import { startWebhookServer } from "./server/webhook-server.js";
import { startAuditSocketServer } from "./modules/audit/audit.server.js";
import { registerErrorReporting } from "./events/error.event.js";
import { reportError } from "./modules/audit/error.reporter.js";
import { env } from "./config/env.js";

export async function bootstrap() {
  console.log("🚀 Initializing Modular Discord Bot...");

  const client = new ExtendedClient();

  // 1. Register commands and event listeners
  registerCommands(client);
  registerReadyEvent(client);
  registerInteractionCreateEvent(client);
  registerMessageCreateEvent(client);
  registerVoiceStateUpdateEvent(client);
  registerErrorReporting(client);
  registerServerLogsEvents(client);

  // 2. Start Background Services
  startAiCleanupCron();
  startReminderCron(client);
  startWebhookServer(client, env.PORT);
  startAuditSocketServer(client);

  // 3. Process-level fatal handlers (best-effort report, then exit)
  process.on("uncaughtException", (err) => {
    void reportError(client, "[Fatal] Uncaught exception", err).finally(() => {
      process.exit(1);
    });
  });

  process.on("unhandledRejection", (reason) => {
    void reportError(client, "[Fatal] Unhandled rejection", reason);
  });

  // 4. Login to Discord
  await client.login(env.DISCORD_TOKEN);
}

// Graceful shutdown handlers
process.on("SIGINT", () => {
  console.log("\n[Shutdown] Gracefully shutting down...");
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("\n[Shutdown] Gracefully shutting down...");
  process.exit(0);
});

bootstrap().catch((err) => {
  console.error("[Fatal Error] Bot failed to start:", err);
  process.exit(1);
});
