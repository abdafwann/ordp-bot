import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import { Command } from "../../../types/command.js";
import { utilityService } from "../utility.service.js";

export const remindCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("remindme")
    .setDescription("Set a scheduled reminder (e.g. 10m, 2h, 1d)")
    .addStringOption((opt) =>
      opt
        .setName("time")
        .setDescription("Time duration (e.g. 30s, 10m, 2h, 1d)")
        .setRequired(true)
    )
    .addStringOption((opt) =>
      opt
        .setName("message")
        .setDescription("What would you like to be reminded of?")
        .setRequired(true)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const timeStr = interaction.options.getString("time", true);
    const message = interaction.options.getString("message", true);

    const durationMs = utilityService.parseDuration(timeStr);
    if (!durationMs || durationMs <= 0) {
      await interaction.reply({
        content: "❌ Invalid time format. Please use formats like `30s`, `15m`, `2h`, or `1d`.",
        ephemeral: true,
      });
      return;
    }

    const remindAt = new Date(Date.now() + durationMs);
    const targetTimestamp = Math.floor(remindAt.getTime() / 1000);

    await utilityService.createReminder(
      interaction.user.id,
      interaction.channelId,
      message,
      remindAt,
      interaction.guildId || undefined
    );

    await interaction.reply({
      content: `⏰ Reminder set! I will remind you <t:${targetTimestamp}:R> for: **${message}**.`,
      ephemeral: true,
    });
  },
};
