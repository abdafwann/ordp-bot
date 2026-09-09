import { SlashCommandBuilder } from "discord.js";
import { Command } from "../../../types/command.js";
import { aiService } from "../ai.service.js";

export const askCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("ask")
    .setDescription("Ask the AI assistant a question")
    .addStringOption((option) =>
      option
        .setName("prompt")
        .setDescription("What would you like to ask?")
        .setRequired(true)
    ),

  async execute(interaction) {
    const prompt = interaction.options.getString("prompt", true);
    await interaction.deferReply();

    try {
      const reply = await aiService.generateReply(
        interaction.guildId || "dm",
        interaction.channelId,
        interaction.user.id,
        prompt
      );

      if (reply.length > 2000) {
        // Discord message limit is 2000 characters
        const chunks = reply.match(/[\s\S]{1,1900}/g) || [reply];
        await interaction.editReply(chunks[0]);
        for (let i = 1; i < chunks.length; i++) {
          await interaction.followUp(chunks[i]);
        }
      } else {
        await interaction.editReply(reply);
      }
    } catch (error) {
      console.error("[Ask Command Error]", error);
      await interaction.editReply(
        "Sorry, I encountered an error communicating with the AI service."
      );
    }
  },
};
