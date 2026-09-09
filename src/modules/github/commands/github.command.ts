import {
  SlashCommandBuilder,
  EmbedBuilder,
  ChannelType,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
} from "discord.js";
import { Command } from "../../../types/command.js";
import { prisma } from "../../../core/db.js";
import { env } from "../../../config/env.js";
import { formatPushEvent } from "../github.formatter.js";

export const githubCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("github")
    .setDescription("Manage GitHub webhook integration and notifications (Owner/Admin only)")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((sub) =>
      sub
        .setName("set-channel")
        .setDescription("Set the channel where GitHub repository alerts are sent")
        .addChannelOption((opt) =>
          opt
            .setName("channel")
            .setDescription("Target text channel")
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
        )
    )
    .addSubcommand((sub) =>
      sub.setName("status").setDescription("Check GitHub webhook listener status and alert targets")
    )
    .addSubcommand((sub) =>
      sub.setName("test").setDescription("Send a sample GitHub push event embed to test alerts")
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const isOwner = env.BOT_OWNER_ID && interaction.user.id === env.BOT_OWNER_ID;
    const member = interaction.guild?.members.cache.get(interaction.user.id);
    const isAdmin =
      member?.permissions.has(PermissionFlagsBits.Administrator) ||
      member?.permissions.has(PermissionFlagsBits.ManageGuild);

    if (!isOwner && !isAdmin) {
      await interaction.reply({
        content: "❌ You do not have permission to use GitHub configuration commands.",
        ephemeral: true,
      });
      return;
    }

    const subcommand = interaction.options.getSubcommand();

    if (subcommand === "set-channel") {
      if (!interaction.guildId) {
        await interaction.reply({ content: "❌ This command must be run in a server.", ephemeral: true });
        return;
      }

      const channel = interaction.options.getChannel("channel", true);

      await prisma.guildConfig.upsert({
        where: { guildId: interaction.guildId },
        update: { githubChannelId: channel.id },
        create: {
          guildId: interaction.guildId,
          githubChannelId: channel.id,
        },
      });

      await interaction.reply({
        content: `✅ GitHub webhook notifications will now be routed to <#${channel.id}>.`,
        ephemeral: true,
      });
      return;
    }

    if (subcommand === "status") {
      const guildConfig = interaction.guildId
        ? await prisma.guildConfig.findUnique({ where: { guildId: interaction.guildId } })
        : null;

      const embed = new EmbedBuilder()
        .setColor(0x2b3137)
        .setTitle("🐙 GitHub Webhook Integration Status")
        .addFields(
          {
            name: "Webhook Listener",
            value: `🟢 Active on Port \`${env.PORT}\` (\`/api/webhooks/github\`)`,
          },
          {
            name: "Secret Verification",
            value: env.GITHUB_WEBHOOK_SECRET ? "🔒 Enabled (HMAC SHA-256)" : "⚠️ No secret configured",
            inline: true,
          },
          {
            name: "Direct DM Alerts",
            value: env.BOT_OWNER_ID ? `🟢 Active for Owner (<@${env.BOT_OWNER_ID}>)` : "🔴 Inactive",
            inline: true,
          },
          {
            name: "Current Guild Channel",
            value: guildConfig?.githubChannelId ? `<#${guildConfig.githubChannelId}>` : "Not configured",
            inline: true,
          }
        )
        .setFooter({ text: "Add webhook URL to your GitHub Repo: Settings > Webhooks" })
        .setTimestamp();

      await interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    if (subcommand === "test") {
      const testPushPayload = {
        ref: "refs/heads/main",
        repository: {
          name: "ordp-bot",
          full_name: "your-org/ordp-bot",
          html_url: "https://github.com",
        },
        pusher: { name: interaction.user.username },
        sender: {
          avatar_url: interaction.user.displayAvatarURL(),
        },
        commits: [
          {
            id: "e4d909f28c0b",
            message: "test: webhook alert verification",
            author: { name: interaction.user.username },
            url: "https://github.com",
          },
        ],
        compare: "https://github.com",
      };

      const testEmbed = formatPushEvent(testPushPayload);

      // Send to channel or DM
      await interaction.reply({
        content: "🚀 Sent sample GitHub push notification:",
        embeds: [testEmbed],
        ephemeral: true,
      });
    }
  },
};
