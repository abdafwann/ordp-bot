import {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
  Role,
  MessageFlags,
} from "discord.js";
import { Command } from "../../../types/command.js";

export function checkRoleHierarchy(
  executorHighestPos: number,
  botHighestPos: number,
  targetRolePos: number,
  isOwner = false
): { ok: boolean; reason?: string } {
  if (botHighestPos <= targetRolePos) {
    return {
      ok: false,
      reason: "❌ I cannot manage this role because it is higher than or equal to my highest role.",
    };
  }
  if (!isOwner && executorHighestPos <= targetRolePos) {
    return {
      ok: false,
      reason: "❌ You cannot manage this role because it is higher than or equal to your highest role.",
    };
  }
  return { ok: true };
}

export const roleCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("role")
    .setDescription("Manage server roles for members (Admin/Manage Roles only)")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .addSubcommand((sub) =>
      sub
        .setName("add")
        .setDescription("Add a role to a member")
        .addUserOption((opt) => opt.setName("user").setDescription("The target member").setRequired(true))
        .addRoleOption((opt) => opt.setName("role").setDescription("The role to add").setRequired(true))
    )
    .addSubcommand((sub) =>
      sub
        .setName("remove")
        .setDescription("Remove a role from a member")
        .addUserOption((opt) => opt.setName("user").setDescription("The target member").setRequired(true))
        .addRoleOption((opt) => opt.setName("role").setDescription("The role to remove").setRequired(true))
    )
    .addSubcommand((sub) =>
      sub
        .setName("info")
        .setDescription("View information about a specific role")
        .addRoleOption((opt) => opt.setName("role").setDescription("The role to inspect").setRequired(true))
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    if (!interaction.guild) {
      await interaction.reply({ content: "❌ This command can only be used in a server.", flags: MessageFlags.Ephemeral });
      return;
    }

    const executor = interaction.guild.members.cache.get(interaction.user.id);
    const botMember = interaction.guild.members.me;

    const hasPermission =
      executor?.permissions.has(PermissionFlagsBits.ManageRoles) ||
      executor?.permissions.has(PermissionFlagsBits.Administrator);

    if (!hasPermission) {
      await interaction.reply({
        content: "❌ You do not have permission to manage roles.",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    const subcommand = interaction.options.getSubcommand();

    if (subcommand === "info") {
      const role = interaction.options.getRole("role", true) as Role;
      const createdTimestamp = Math.floor(role.createdTimestamp / 1000);

      const embed = new EmbedBuilder()
        .setColor(role.color || 0x5865f2)
        .setTitle(`🏷️ Role: ${role.name}`)
        .addFields(
          { name: "🆔 Role ID", value: `\`${role.id}\``, inline: true },
          { name: "🎨 Color", value: role.hexColor, inline: true },
          { name: "👥 Members", value: `${role.members.size} member(s)`, inline: true },
          { name: "📌 Mentionable", value: role.mentionable ? "Yes" : "No", inline: true },
          { name: "⚡ Hoisted (Separated)", value: role.hoist ? "Yes" : "No", inline: true },
          { name: "📊 Position", value: `${role.position}`, inline: true },
          {
            name: "📅 Created On",
            value: `<t:${createdTimestamp}:F> (<t:${createdTimestamp}:R>)`,
            inline: false,
          }
        )
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
      return;
    }

    const targetUser = interaction.options.getUser("user", true);
    const targetRole = interaction.options.getRole("role", true) as Role;

    const targetMember = await interaction.guild.members.fetch(targetUser.id).catch(() => null);
    if (!targetMember) {
      await interaction.reply({ content: "❌ Target member not found in this server.", flags: MessageFlags.Ephemeral });
      return;
    }

    const isOwner = interaction.guild.ownerId === interaction.user.id;
    const hierarchy = checkRoleHierarchy(
      executor?.roles.highest.position || 0,
      botMember?.roles.highest.position || 0,
      targetRole.position,
      isOwner
    );

    if (!hierarchy.ok) {
      await interaction.reply({ content: hierarchy.reason!, flags: MessageFlags.Ephemeral });
      return;
    }

    try {
      if (subcommand === "add") {
        if (targetMember.roles.cache.has(targetRole.id)) {
          await interaction.reply({
            content: `ℹ️ <@${targetUser.id}> already has the <@&${targetRole.id}> role.`,
            flags: MessageFlags.Ephemeral,
          });
          return;
        }

        await targetMember.roles.add(targetRole);
        await interaction.reply({
          content: `✅ Successfully added <@&${targetRole.id}> to <@${targetUser.id}>.`,
        });
        return;
      }

      if (subcommand === "remove") {
        if (!targetMember.roles.cache.has(targetRole.id)) {
          await interaction.reply({
            content: `ℹ️ <@${targetUser.id}> does not have the <@&${targetRole.id}> role.`,
            flags: MessageFlags.Ephemeral,
          });
          return;
        }

        await targetMember.roles.remove(targetRole);
        await interaction.reply({
          content: `✅ Successfully removed <@&${targetRole.id}> from <@${targetUser.id}>.`,
        });
      }
    } catch (err) {
      console.error("[Role Command Error]", err);
      await interaction.reply({
        content: "❌ Failed to modify roles. Please verify bot permissions and role hierarchy.",
        flags: MessageFlags.Ephemeral,
      });
    }
  },
};
