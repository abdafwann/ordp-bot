import { Events } from "discord.js";
import { ExtendedClient } from "../core/client.js";
import { reportError } from "../modules/audit/error.reporter.js";

// Shard lifecycle events are routine (Discord gateway blips, deploys,
// rolling restarts) and self-healing — log only, never alert.
// Only genuine errors (client error, uncaughtException, unhandledRejection)
// are reported to #sys-alerts.

export function registerErrorReporting(client: ExtendedClient) {
  client.on(Events.Error, (err) => {
    void reportError(client, "[Discord] Client error", err);
  });

  client.on(Events.ShardDisconnect, (_closeEvent, id) => {
    console.warn(`[Shard ${id}] disconnected (will auto-reconnect)`);
  });

  client.on(Events.ShardReconnecting, (id) => {
    console.warn(`[Shard ${id}] reconnecting`);
  });

  client.on(Events.ShardResume, (id) => {
    console.log(`[Shard ${id}] resumed`);
  });
}
