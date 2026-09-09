import {
  SlashCommandBuilder,
  EmbedBuilder,
  ChatInputCommandInteraction,
  GuildMember,
} from "discord.js";
import { Command } from "../../../types/command.js";

export const userInfoCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("userinfo")
    .setDescription("Display detailed information about a server member or yourself")
    .addUserOption((opt) =>
      opt.setName("user").setDescription("The user to inspect")
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const targetUser = interaction.options.getUser("user") || interaction.user;
    const member = interaction.guild?.members.cache.get(targetUser.id) as
      | GuildMember
      | undefined;

    const createdAtTimestamp = Math.floor(targetUser.createdTimestamp / 1000);
    const joinedAtTimestamp = member?.joinedTimestamp
      ? Math.floor(member.joinedTimestamp / 1000)
      : null;

    const roles = member?.roles.cache
      .filter((r) => r.id !== interaction.guildId)
      .map((r) => `<@&${r.id}>`)
      .slice(0, 10);

    const embed = new EmbedBuilder()
      .setColor(member?.displayColor || 0x5865f2)
      .setAuthor({
        name: targetUser.tag,
        iconURL: targetUser.displayAvatarURL(),
      })
      .setThumbnail(targetUser.displayAvatarURL({ size: 256 }))
      .addFields(
        { name: "👤 User ID", value: `\`${targetUser.id}\``, inline: true },
        { name: "🤖 Is Bot", value: targetUser.bot ? "Yes" : "No", inline: true },
        {
          name: "📅 Account Created",
          value: `<t:${createdAtTimestamp}:F>\n(<t:${createdAtTimestamp}:R>)`,
          inline: false,
        },
        {
          name: "📥 Joined Server",
          value: joinedAtTimestamp
            ? `<t:${joinedAtTimestamp}:F>\n(<t:${joinedAtTimestamp}:R>)`
            : "Unknown",
          inline: false,
        },
        {
          name: `🏷️ Roles (${member?.roles.cache.size ? member.roles.cache.size - 1 : 0})`,
          value: roles && roles.length > 0 ? roles.join(" ") : "No roles",
          inline: false,
        }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};

export const serverInfoCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("serverinfo")
    .setDescription("Display detailed server statistics and information"),

  async execute(interaction: ChatInputCommandInteraction) {
    const guild = interaction.guild;
    if (!guild) {
      await interaction.reply({ content: "❌ This command must be used in a server.", ephemeral: true });
      return;
    }

    const createdTimestamp = Math.floor(guild.createdTimestamp / 1000);
    const owner = await guild.fetchOwner().catch(() => null);

    const totalMembers = guild.memberCount;
    const channels = guild.channels.cache;
    const textChannels = channels.filter((c) => c.isTextBased()).size;
    const voiceChannels = channels.filter((c) => c.isVoiceBased()).size;
    const rolesCount = guild.roles.cache.size;

    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle(`🏰 ${guild.name}`)
      .setThumbnail(guild.iconURL({ size: 256 }) || null)
      .addFields(
        { name: "👑 Server Owner", value: owner ? `<@${owner.id}>` : "Unknown", inline: true },
        { name: "🆔 Server ID", value: `\`${guild.id}\``, inline: true },
        { name: "👥 Members", value: `**${totalMembers}** members`, inline: true },
        {
          name: "💬 Channels",
          value: `📝 ${textChannels} Text | 🔊 ${voiceChannels} Voice`,
          inline: true,
        },
        { name: "🏷️ Roles", value: `${rolesCount} roles`, inline: true },
        { name: "🚀 Boost Tier", value: `Tier ${guild.premiumTier} (${guild.premiumSubscriptionCount || 0} boosts)`, inline: true },
        {
          name: "📅 Created On",
          value: `<t:${createdTimestamp}:F> (<t:${createdTimestamp}:R>)`,
          inline: false,
        }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
