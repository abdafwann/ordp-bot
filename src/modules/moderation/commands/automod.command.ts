import {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionFlagsBits,
  ButtonInteraction,
  ChatInputCommandInteraction,
} from "discord.js";
import { Command } from "../../../types/command.js";
import { autoModService } from "../automod.service.js";

export function buildAutoModConfigEmbed(config: {
  antiInvite: boolean;
  antiLinks: boolean;
  antiSpam: boolean;
  maxMentions: number;
  blockedWords: string;
}) {
  let blockedCount = 0;
  try {
    blockedCount = (JSON.parse(config.blockedWords || "[]") as string[]).length;
  } catch {
    blockedCount = 0;
  }

  const embed = new EmbedBuilder()
    .setColor(0x5865f2)
    .setTitle("🛡️ Auto-Mod & Spam Protection Settings")
    .setDescription(
      "Configure your server's automatic moderation, link protection, and spam filters below."
    )
    .addFields(
      {
        name: "Anti-Invite Links",
        value: config.antiInvite ? "🟢 Enabled" : "🔴 Disabled",
        inline: true,
      },
      {
        name: "Anti-General Links",
        value: config.antiLinks ? "🟢 Enabled" : "🔴 Disabled",
        inline: true,
      },
      {
        name: "Anti-Spam (Rate Limit: 5 msg / 10s)",
        value: config.antiSpam ? "🟢 Enabled" : "🔴 Disabled",
        inline: true,
      },
      {
        name: "Max Mentions Threshold",
        value: config.maxMentions > 0 ? `⚠️ Max ${config.maxMentions} mentions` : "🔴 Disabled",
        inline: true,
      },
      {
        name: "Custom Blocked Words",
        value: `📝 ${blockedCount} word(s) configured`,
        inline: true,
      }
    )
    .setFooter({ text: "Use the buttons below to toggle protection modules." })
    .setTimestamp();

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId("automod_toggle_invite")
      .setLabel(config.antiInvite ? "Disable Anti-Invite" : "Enable Anti-Invite")
      .setStyle(config.antiInvite ? ButtonStyle.Danger : ButtonStyle.Success),
    new ButtonBuilder()
      .setCustomId("automod_toggle_links")
      .setLabel(config.antiLinks ? "Disable Anti-Links" : "Enable Anti-Links")
      .setStyle(config.antiLinks ? ButtonStyle.Danger : ButtonStyle.Success),
    new ButtonBuilder()
      .setCustomId("automod_toggle_spam")
      .setLabel(config.antiSpam ? "Disable Anti-Spam" : "Enable Anti-Spam")
      .setStyle(config.antiSpam ? ButtonStyle.Danger : ButtonStyle.Success)
  );

  return { embed, row };
}

export const automodCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("automod")
    .setDescription("Manage Auto-Mod and Spam Protection settings (Admin only)")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((sub) =>
      sub.setName("config").setDescription("View and toggle Auto-Mod protection settings")
    )
    .addSubcommand((sub) =>
      sub
        .setName("add-word")
        .setDescription("Add a word or phrase to the server blocklist")
        .addStringOption((opt) =>
          opt
            .setName("word")
            .setDescription("The word or phrase to block")
            .setRequired(true)
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName("remove-word")
        .setDescription("Remove a word or phrase from the server blocklist")
        .addStringOption((opt) =>
          opt
            .setName("word")
            .setDescription("The word or phrase to unblock")
            .setRequired(true)
        )
    )
    .addSubcommand((sub) =>
      sub.setName("list-words").setDescription("List all custom blocked words for this server")
    )
    .addSubcommand((sub) =>
      sub
        .setName("set-mentions")
        .setDescription("Set max allowable mentions per message (0 to disable)")
        .addIntegerOption((opt) =>
          opt
            .setName("limit")
            .setDescription("Max mentions threshold")
            .setRequired(true)
            .setMinValue(0)
            .setMaxValue(50)
        )
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    if (!interaction.guildId || !interaction.guild) {
      await interaction.reply({
        content: "❌ This command can only be used in a server.",
        ephemeral: true,
      });
      return;
    }

    // Permission double-check
    const member = interaction.guild.members.cache.get(interaction.user.id);
    const hasAdmin =
      member?.permissions.has(PermissionFlagsBits.Administrator) ||
      member?.permissions.has(PermissionFlagsBits.ManageGuild);

    if (!hasAdmin) {
      await interaction.reply({
        content: "❌ You do not have permission to manage Auto-Mod settings.",
        ephemeral: true,
      });
      return;
    }

    const subcommand = interaction.options.getSubcommand();

    if (subcommand === "config") {
      const config = await autoModService.getGuildConfig(interaction.guildId);
      const { embed, row } = buildAutoModConfigEmbed(config);
      await interaction.reply({
        embeds: [embed],
        components: [row],
        ephemeral: true,
      });
      return;
    }

    if (subcommand === "add-word") {
      const word = interaction.options.getString("word", true);
      const words = await autoModService.addBlockedWord(interaction.guildId, word);
      await interaction.reply({
        content: `✅ Added \`${word.toLowerCase()}\` to the server blocklist. Total blocked words: ${words.length}.`,
        ephemeral: true,
      });
      return;
    }

    if (subcommand === "remove-word") {
      const word = interaction.options.getString("word", true);
      const words = await autoModService.removeBlockedWord(interaction.guildId, word);
      await interaction.reply({
        content: `✅ Removed \`${word.toLowerCase()}\` from the blocklist. Total blocked words: ${words.length}.`,
        ephemeral: true,
      });
      return;
    }

    if (subcommand === "list-words") {
      const words = await autoModService.getBlockedWords(interaction.guildId);
      if (words.length === 0) {
        await interaction.reply({
          content: "ℹ️ No blocked words currently configured for this server.",
          ephemeral: true,
        });
        return;
      }

      const embed = new EmbedBuilder()
        .setColor(0x5865f2)
        .setTitle("📝 Blocked Words List")
        .setDescription(words.map((w, i) => `${i + 1}. \`${w}\``).join("\n"))
        .setFooter({ text: "Messages containing these words will be automatically removed." });

      await interaction.reply({
        embeds: [embed],
        ephemeral: true,
      });
      return;
    }

    if (subcommand === "set-mentions") {
      const limit = interaction.options.getInteger("limit", true);
      await autoModService.updateSettings(interaction.guildId, { maxMentions: limit });
      await interaction.reply({
        content:
          limit > 0
            ? `✅ Max mentions threshold set to **${limit}** mentions per message.`
            : "✅ Mass mentions protection disabled (set to 0).",
        ephemeral: true,
      });
    }
  },
};

export async function handleAutoModInteraction(interaction: ButtonInteraction) {
  const { customId, guild, user } = interaction;
  if (!guild) return;

  if (!customId.startsWith("automod_toggle_")) return;

  const member = guild.members.cache.get(user.id);
  const hasAdmin =
    member?.permissions.has(PermissionFlagsBits.Administrator) ||
    member?.permissions.has(PermissionFlagsBits.ManageGuild);

  if (!hasAdmin) {
    await interaction.reply({
      content: "❌ You do not have permission to modify Auto-Mod settings.",
      ephemeral: true,
    });
    return;
  }

  const currentConfig = await autoModService.getGuildConfig(guild.id);

  let updated;
  if (customId === "automod_toggle_invite") {
    updated = await autoModService.updateSettings(guild.id, {
      antiInvite: !currentConfig.antiInvite,
    });
  } else if (customId === "automod_toggle_links") {
    updated = await autoModService.updateSettings(guild.id, {
      antiLinks: !currentConfig.antiLinks,
    });
  } else if (customId === "automod_toggle_spam") {
    updated = await autoModService.updateSettings(guild.id, {
      antiSpam: !currentConfig.antiSpam,
    });
  }

  if (updated) {
    const { embed, row } = buildAutoModConfigEmbed(updated);
    await interaction.update({
      embeds: [embed],
      components: [row],
    });
  }
}
