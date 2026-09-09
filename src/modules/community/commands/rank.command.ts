import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { Command } from "../../../types/command.js";
import { levelingService } from "../leveling.service.js";

export const rankCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("rank")
    .setDescription("Check your or another member's rank and XP level")
    .addUserOption((option) =>
      option.setName("user").setDescription("The user whose rank to check").setRequired(false)
    ),

  async execute(interaction) {
    const targetUser = interaction.options.getUser("user") || interaction.user;
    const guildId = interaction.guildId || "dm";

    const userLevel = await levelingService.getUserLevel(guildId, targetUser.id);
    const xpNeeded = levelingService.xpRequiredForLevel(userLevel.level + 1);
    const xpCurrentBase = levelingService.xpRequiredForLevel(userLevel.level);

    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle(`📊 Rank: ${targetUser.username}`)
      .setThumbnail(targetUser.displayAvatarURL())
      .addFields(
        { name: "Level", value: `${userLevel.level}`, inline: true },
        { name: "Total XP", value: `${userLevel.xp}`, inline: true },
        { name: "Next Level", value: `${userLevel.xp}/${xpNeeded} XP`, inline: true }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};

export const leaderboardCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("View the top 10 most active members by XP"),

  async execute(interaction) {
    const guildId = interaction.guildId || "dm";
    const topUsers = await levelingService.getLeaderboard(guildId, 10);

    if (topUsers.length === 0) {
      await interaction.reply("No members on the leaderboard yet. Start chatting to earn XP!");
      return;
    }

    const leaderboardLines = topUsers
      .map((u, i) => `**#${i + 1}** <@${u.userId}> - Level **${u.level}** (${u.xp} XP)`)
      .join("\n");

    const embed = new EmbedBuilder()
      .setColor(0xf1c40f)
      .setTitle("🏆 Server XP Leaderboard")
      .setDescription(leaderboardLines)
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
