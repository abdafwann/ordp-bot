import {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  GuildMember,
  TextChannel,
} from "discord.js";
import { Command } from "../../../types/command.js";
import { moderationService } from "../moderation.service.js";

export const warnCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("warn")
    .setDescription("Issue a formal warning to a user")
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption((option) =>
      option.setName("user").setDescription("The user to warn").setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("reason").setDescription("Reason for warning").setRequired(true)
    ),

  async execute(interaction) {
    const target = interaction.options.getUser("user", true);
    const reason = interaction.options.getString("reason", true);
    const guildId = interaction.guildId || "dm";

    if (target.id === interaction.user.id) {
      await interaction.reply({ content: "❌ You cannot warn yourself.", ephemeral: true });
      return;
    }

    await moderationService.warnUser(guildId, target.id, interaction.user.id, reason);

    const embed = new EmbedBuilder()
      .setColor(0xe67e22)
      .setTitle("⚠️ Warning Issued")
      .setDescription(`<@${target.id}> has been warned by <@${interaction.user.id}>.`)
      .addFields({ name: "Reason", value: reason })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};

export const warningsCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("warnings")
    .setDescription("View warning history for a user")
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption((option) =>
      option.setName("user").setDescription("The user whose warnings to check").setRequired(true)
    ),

  async execute(interaction) {
    const target = interaction.options.getUser("user", true);
    const guildId = interaction.guildId || "dm";

    const warnings = await moderationService.getWarnings(guildId, target.id);

    if (warnings.length === 0) {
      await interaction.reply({
        content: `✅ <@${target.id}> has no recorded warnings.`,
        ephemeral: true,
      });
      return;
    }

    const warningList = warnings
      .map(
        (w, i) =>
          `**${i + 1}.** Reason: *${w.reason}* (By: <@${w.moderatorId}> on <t:${Math.floor(
            w.createdAt.getTime() / 1000
          )}:d>)`
      )
      .join("\n");

    const embed = new EmbedBuilder()
      .setColor(0xe74c3c)
      .setTitle(`📋 Warnings for ${target.username} (${warnings.length} total)`)
      .setDescription(warningList)
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};

export const timeoutCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("timeout")
    .setDescription("Timeout/mute a member for a specified duration")
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption((option) =>
      option.setName("user").setDescription("The user to timeout").setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("minutes")
        .setDescription("Duration of timeout in minutes")
        .setMinValue(1)
        .setMaxValue(40320) // max 28 days
        .setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("reason").setDescription("Reason for timeout").setRequired(false)
    ),

  async execute(interaction) {
    const targetUser = interaction.options.getUser("user", true);
    const minutes = interaction.options.getInteger("minutes", true);
    const reason = interaction.options.getString("reason") || "No reason provided";

    const member = interaction.guild?.members.cache.get(targetUser.id);
    if (!member) {
      await interaction.reply({ content: "❌ Member not found in this guild.", ephemeral: true });
      return;
    }

    try {
      await member.timeout(minutes * 60 * 1000, reason);
      await interaction.reply({
        content: `⏳ <@${targetUser.id}> has been timed out for **${minutes} minutes**. Reason: ${reason}`,
      });
    } catch (err) {
      console.error(err);
      await interaction.reply({
        content: "❌ Failed to timeout member. Ensure the bot has higher role permissions.",
        ephemeral: true,
      });
    }
  },
};

export const kickCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kick a member from the server")
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .addUserOption((option) =>
      option.setName("user").setDescription("The user to kick").setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("reason").setDescription("Reason for kick").setRequired(false)
    ),

  async execute(interaction) {
    const targetUser = interaction.options.getUser("user", true);
    const reason = interaction.options.getString("reason") || "No reason provided";

    const member = interaction.guild?.members.cache.get(targetUser.id);
    if (!member) {
      await interaction.reply({ content: "❌ Member not found in this guild.", ephemeral: true });
      return;
    }

    try {
      await member.kick(reason);
      await interaction.reply({
        content: `👢 Successfully kicked <@${targetUser.id}>. Reason: ${reason}`,
      });
    } catch (err) {
      console.error(err);
      await interaction.reply({
        content: "❌ Failed to kick member. Ensure the bot has higher role permissions.",
        ephemeral: true,
      });
    }
  },
};

export const banCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Ban a user from the server")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addUserOption((option) =>
      option.setName("user").setDescription("The user to ban").setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("reason").setDescription("Reason for ban").setRequired(false)
    ),

  async execute(interaction) {
    const targetUser = interaction.options.getUser("user", true);
    const reason = interaction.options.getString("reason") || "No reason provided";

    try {
      await interaction.guild?.members.ban(targetUser, { reason });
      await interaction.reply({
        content: `🔨 Successfully banned <@${targetUser.id}>. Reason: ${reason}`,
      });
    } catch (err) {
      console.error(err);
      await interaction.reply({
        content: "❌ Failed to ban user. Ensure the bot has higher role permissions.",
        ephemeral: true,
      });
    }
  },
};

export const clearCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Bulk delete recent messages in this channel")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("Number of messages to delete (1-100)")
        .setMinValue(1)
        .setMaxValue(100)
        .setRequired(true)
    ),

  async execute(interaction) {
    const amount = interaction.options.getInteger("amount", true);
    const channel = interaction.channel;

    if (!channel || !channel.isTextBased() || !("bulkDelete" in channel)) {
      await interaction.reply({
        content: "❌ Cannot bulk delete messages in this channel type.",
        ephemeral: true,
      });
      return;
    }

    try {
      const deleted = await (channel as TextChannel).bulkDelete(amount, true);
      await interaction.reply({
        content: `🧹 Successfully deleted **${deleted.size}** messages.`,
        ephemeral: true,
      });
    } catch (err) {
      console.error(err);
      await interaction.reply({
        content: "❌ Failed to delete messages (messages older than 14 days cannot be bulk deleted).",
        ephemeral: true,
      });
    }
  },
};
