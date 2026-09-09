import { ExtendedClient } from "./core/client.js";
import { registerCommands } from "./core/command-loader.js";
import { registerReadyEvent } from "./events/ready.event.js";
import { registerInteractionCreateEvent } from "./events/interactionCreate.event.js";
import { registerMessageCreateEvent } from "./events/messageCreate.event.js";
import { registerVoiceStateUpdateEvent } from "./events/voiceStateUpdate.event.js";
import { startAiCleanupCron } from "./cron/ai-cleanup.cron.js";
import { startReminderCron } from "./cron/reminder.cron.js";
import { startWebhookServer } from "./server/webhook-server.js";
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

  // 2. Start Background Services
  startAiCleanupCron();
  startReminderCron(client);
  startWebhookServer(client, env.PORT);

  // 3. Login to Discord
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

// Run if directly executed
if (
  process.argv[1]?.endsWith("index.ts") ||
  process.argv[1]?.endsWith("index.js")
) {
  bootstrap().catch((err) => {
    console.error("[Fatal Error] Bot failed to start:", err);
    process.exit(1);
  });
}
