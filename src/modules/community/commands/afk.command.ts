import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import { Command } from "../../../types/command.js";
import { utilityService } from "../utility.service.js";

export const afkCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("afk")
    .setDescription("Set your AFK status. The bot will notify others if they mention you.")
    .addStringOption((opt) =>
      opt.setName("reason").setDescription("Reason for being AFK").setMaxLength(100)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    if (!interaction.guildId) {
      await interaction.reply({ content: "❌ This command can only be used in a server.", ephemeral: true });
      return;
    }

    const reason = interaction.options.getString("reason") || "AFK";
    await utilityService.setAfk(interaction.guildId, interaction.user.id, reason);

    await interaction.reply({
      content: `💤 <@${interaction.user.id}> is now AFK: **${reason}**. Send a message anytime to remove your status.`,
    });
  },
};
