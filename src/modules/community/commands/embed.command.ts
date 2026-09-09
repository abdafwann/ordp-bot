import {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
  ColorResolvable,
} from "discord.js";
import { Command } from "../../../types/command.js";

export const embedCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("embed")
    .setDescription("Create and send a custom rich embed announcement")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addStringOption((opt) =>
      opt.setName("title").setDescription("Embed title").setRequired(true)
    )
    .addStringOption((opt) =>
      opt.setName("description").setDescription("Embed content/description").setRequired(true)
    )
    .addStringOption((opt) =>
      opt.setName("color").setDescription("Hex color code (e.g. #5865f2 or #e74c3c)")
    )
    .addStringOption((opt) =>
      opt.setName("image").setDescription("Image URL to display in embed")
    )
    .addStringOption((opt) =>
      opt.setName("footer").setDescription("Footer text")
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const title = interaction.options.getString("title", true);
    const description = interaction.options.getString("description", true);
    const colorHex = interaction.options.getString("color") || "#5865f2";
    const imageUrl = interaction.options.getString("image");
    const footerText = interaction.options.getString("footer");

    let parsedColor: number = 0x5865f2;
    if (colorHex.startsWith("#")) {
      const parsed = parseInt(colorHex.replace("#", ""), 16);
      if (!isNaN(parsed)) parsedColor = parsed;
    }

    const embed = new EmbedBuilder()
      .setColor(parsedColor)
      .setTitle(title)
      .setDescription(description.replace(/\\n/g, "\n"))
      .setTimestamp();

    if (imageUrl && imageUrl.startsWith("http")) {
      embed.setImage(imageUrl);
    }

    if (footerText) {
      embed.setFooter({ text: footerText });
    }

    await interaction.reply({ content: "✅ Embed sent!", ephemeral: true });
    if (interaction.channel && "send" in interaction.channel) {
      await interaction.channel.send({ embeds: [embed] });
    }
  },
};
