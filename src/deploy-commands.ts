import { REST, Routes } from "discord.js";
import { env } from "./config/env.js";
import { allCommands } from "./core/command-loader.js";

const commandsData = allCommands.map((command) => command.data.toJSON());
const rest = new REST({ version: "10" }).setToken(env.DISCORD_TOKEN);

export async function deploySlashCommands() {
  try {
    const isClearGuild = process.argv.includes("--clear-guild");
    const isClearGlobal = process.argv.includes("--clear-global");
    const isForceGlobal = process.argv.includes("--global");

    const guildIds = env.DISCORD_GUILD_ID
      ? env.DISCORD_GUILD_ID.split(",").map((id) => id.trim()).filter(Boolean)
      : [];

    if (isClearGuild) {
      for (const guildId of guildIds) {
        await rest.put(
          Routes.applicationGuildCommands(env.DISCORD_CLIENT_ID, guildId),
          { body: [] }
        );
        console.log(`[Deploy] Cleared guild commands for guild: ${guildId}`);
      }
      return;
    }

    if (isClearGlobal) {
      await rest.put(Routes.applicationCommands(env.DISCORD_CLIENT_ID), {
        body: []
      });
      console.log(`[Deploy] Cleared all global application commands.`);
      return;
    }

    console.log(`[Deploy] Registering ${commandsData.length} application (/) commands...`);

    if (isForceGlobal || guildIds.length === 0) {
      // Clear guild commands to avoid duplicates, then register globally
      for (const guildId of guildIds) {
        await rest.put(
          Routes.applicationGuildCommands(env.DISCORD_CLIENT_ID, guildId),
          { body: [] }
        );
        console.log(`[Deploy] Cleared guild-specific commands for guild: ${guildId}`);
      }

      await rest.put(Routes.applicationCommands(env.DISCORD_CLIENT_ID), {
        body: commandsData,
      });
      console.log(`[Deploy] Successfully registered global application commands to all servers.`);
    } else {
      // Clear global commands first to prevent duplicate commands
      console.log(`[Deploy] Cleaning up global commands to avoid duplicates...`);
      await rest.put(Routes.applicationCommands(env.DISCORD_CLIENT_ID), { body: [] });

      for (const guildId of guildIds) {
        console.log(`[Deploy] Registering commands to guild: ${guildId}...`);
        await rest.put(
          Routes.applicationGuildCommands(env.DISCORD_CLIENT_ID, guildId),
          { body: commandsData }
        );
        console.log(`[Deploy] Successfully registered commands to guild: ${guildId}`);
      }
    }
  } catch (error) {
    console.error("[Deploy Error] Failed to register slash commands:", error);
  }
}

if (process.argv[1]?.endsWith("deploy-commands.ts") || process.argv[1]?.endsWith("deploy-commands.js")) {
  deploySlashCommands();
}
