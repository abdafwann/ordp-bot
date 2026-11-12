import {
  SlashCommandBuilder,
  EmbedBuilder,
  ChannelType,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
  MessageFlags,
} from "discord.js";
import { Command } from "../../../types/command.js";
import { prisma } from "../../../core/db.js";
import { env } from "../../../config/env.js";

const REPO_PATTERN = /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/;

function normalizeRepo(raw: string): string {
  return raw.trim().toLowerCase();
}

function channelNameFor(repo: string): string {
  return `github-${repo.replace(/\//g, "-")}`;
}

function isOwner(interaction: ChatInputCommandInteraction): boolean {
  return env.BOT_OWNER_ID !== undefined && interaction.user.id === env.BOT_OWNER_ID;
}

async function findOrCreateChannel(
  interaction: ChatInputCommandInteraction,
  repo: string
): Promise<{ id: string } | null> {
  if (!interaction.guild) return null;

  const explicit = interaction.options.getChannel("channel", false);
  if (explicit) return { id: explicit.id };

  const name = channelNameFor(repo);
  const existing = interaction.guild.channels.cache.find(
    (c) => c.name.toLowerCase() === name.toLowerCase() && c.type === ChannelType.GuildText
  );
  if (existing) return { id: existing.id };

  const githubCategory =
    (env.GITHUB_CATEGORY_ID &&
      interaction.guild.channels.cache.find(
        (c) => c.type === ChannelType.GuildCategory && c.id === env.GITHUB_CATEGORY_ID
      )) ||
    interaction.guild.channels.cache.find(
      (c) => c.type === ChannelType.GuildCategory && c.name.toLowerCase() === "github"
    );

  const created = await interaction.guild.channels.create({
    name,
    type: ChannelType.GuildText,
    parent: githubCategory?.id ?? undefined,
  });

  return { id: created.id };
}

export const repoCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("repo")
    .setDescription("Map GitHub repositories to Discord channels (Owner only)")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((sub) =>
      sub
        .setName("add")
        .setDescription("Route a repository's events to a channel")
        .addStringOption((opt) =>
          opt
            .setName("repo")
            .setDescription("Repository as owner/repo (e.g. acme/website)")
            .setRequired(true)
        )
        .addChannelOption((opt) =>
          opt
            .setName("channel")
            .setDescription("Target text channel (defaults to a new #github-owner-repo channel)")
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(false)
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName("remove")
        .setDescription("Remove a repository's channel mapping")
        .addStringOption((opt) =>
          opt
            .setName("repo")
            .setDescription("Repository as owner/repo")
            .setRequired(true)
        )
    )
    .addSubcommand((sub) =>
      sub.setName("list").setDescription("List all repository channel mappings")
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    if (!isOwner(interaction)) {
      await interaction.reply({
        content: "❌ You do not have permission to manage repository mappings.",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    if (!interaction.guildId) {
      await interaction.reply({ content: "❌ This command must be run in a server.", flags: MessageFlags.Ephemeral });
      return;
    }

    const subcommand = interaction.options.getSubcommand();

    if (subcommand === "add") {
      const rawRepo = interaction.options.getString("repo", true);
      const repo = normalizeRepo(rawRepo);

      if (!REPO_PATTERN.test(repo)) {
        await interaction.reply({
          content: "❌ Invalid repository. Use the format `owner/repo`.",
          flags: MessageFlags.Ephemeral,
        });
        return;
      }

      const channel = await findOrCreateChannel(interaction, repo);
      if (!channel) {
        await interaction.reply({
          content: "❌ Could not determine a target channel.",
          flags: MessageFlags.Ephemeral,
        });
        return;
      }

      await prisma.repoChannel.upsert({
        where: { repoFullName: repo },
        update: { channelId: channel.id },
        create: { repoFullName: repo, channelId: channel.id },
      });

      await interaction.reply({
        content: `✅ Events for \`${repo}\` now route to <#${channel.id}>.`,
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    if (subcommand === "remove") {
      const rawRepo = interaction.options.getString("repo", true);
      const repo = normalizeRepo(rawRepo);

      const existing = await prisma.repoChannel.findUnique({ where: { repoFullName: repo } });
      if (!existing) {
        await interaction.reply({
          content: `❌ No mapping found for \`${repo}\`.`,
          flags: MessageFlags.Ephemeral,
        });
        return;
      }

      await prisma.repoChannel.delete({ where: { repoFullName: repo } });

      await interaction.reply({
        content: `🗑️ Removed mapping for \`${repo}\` (was <#${existing.channelId}>).`,
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    if (subcommand === "list") {
      const mappings = await prisma.repoChannel.findMany({
        orderBy: { repoFullName: "asc" },
      });

      if (mappings.length === 0) {
        await interaction.reply({
          content: "No repository mappings yet. Use `/repo add owner/repo`.",
          flags: MessageFlags.Ephemeral,
        });
        return;
      }

      const lines = mappings
        .map((m) => `• \`${m.repoFullName}\` → <#${m.channelId}>`)
        .join("\n");

      const embed = new EmbedBuilder()
        .setColor(0x2b3137)
        .setTitle("🐙 Repository Channel Mappings")
        .setDescription(lines)
        .setTimestamp();

      await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
    }
  },
};
