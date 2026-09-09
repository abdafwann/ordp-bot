import {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionFlagsBits,
  ChannelType,
  ButtonInteraction,
  Guild,
  User,
  TextChannel,
} from "discord.js";
import { Command } from "../../../types/command.js";
import { ticketService } from "../ticket.service.js";

export const ticketSetupCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("ticket-setup")
    .setDescription("Send an interactive ticket creation panel")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle("🎫 Support & Help Tickets")
      .setDescription(
        "Need assistance or have a question? Click the button below to create a private support ticket with our team."
      )
      .setFooter({ text: "Our staff will respond as soon as possible." });

    const button = new ButtonBuilder()
      .setCustomId("create_ticket")
      .setLabel("Create Ticket")
      .setEmoji("📩")
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);

    await interaction.reply({ content: "✅ Ticket panel sent!", ephemeral: true });
    if (interaction.channel && interaction.channel.isTextBased()) {
      await (interaction.channel as TextChannel).send({
        embeds: [embed],
        components: [row],
      });
    }
  },
};

export async function handleTicketInteraction(interaction: ButtonInteraction) {
  const { customId, guild, user } = interaction;
  if (!guild) return;

  if (customId === "create_ticket") {
    // Check if user already has an active channel
    const channelName = `ticket-${user.username.toLowerCase().replace(/[^a-z0-9]/g, "")}`;
    const existing = guild.channels.cache.find((c) => c.name === channelName);

    if (existing) {
      await interaction.reply({
        content: `❌ You already have an open ticket: <#${existing.id}>`,
        ephemeral: true,
      });
      return;
    }

    try {
      const ticketChannel = await guild.channels.create({
        name: channelName,
        type: ChannelType.GuildText,
        permissionOverwrites: [
          {
            id: guild.roles.everyone,
            deny: [PermissionFlagsBits.ViewChannel],
          },
          {
            id: user.id,
            allow: [
              PermissionFlagsBits.ViewChannel,
              PermissionFlagsBits.SendMessages,
              PermissionFlagsBits.ReadMessageHistory,
            ],
          },
          {
            id: guild.members.me?.id || user.id,
            allow: [
              PermissionFlagsBits.ViewChannel,
              PermissionFlagsBits.SendMessages,
              PermissionFlagsBits.ManageChannels,
            ],
          },
        ],
      });

      await ticketService.createTicket(guild.id, ticketChannel.id, user.id);

      const welcomeEmbed = new EmbedBuilder()
        .setColor(0x2ecc71)
        .setTitle(`Support Ticket: ${user.username}`)
        .setDescription(
          `Welcome <@${user.id}>! Please explain your issue or request in detail. A staff member will be with you shortly.\n\nTo close this ticket, click the **Close Ticket** button below.`
        )
        .setTimestamp();

      const closeButton = new ButtonBuilder()
        .setCustomId("close_ticket")
        .setLabel("Close Ticket")
        .setEmoji("🔒")
        .setStyle(ButtonStyle.Danger);

      const row = new ActionRowBuilder<ButtonBuilder>().addComponents(closeButton);

      await ticketChannel.send({
        content: `<@${user.id}>`,
        embeds: [welcomeEmbed],
        components: [row],
      });

      await interaction.reply({
        content: `✅ Your ticket has been created: <#${ticketChannel.id}>`,
        ephemeral: true,
      });
    } catch (err) {
      console.error("[Ticket Creation Error]", err);
      await interaction.reply({
        content: "❌ Failed to create ticket channel. Ensure bot has 'Manage Channels' permission.",
        ephemeral: true,
      });
    }
  } else if (customId === "close_ticket") {
    await interaction.reply("🔒 Closing ticket in 5 seconds...");
    await ticketService.closeTicket(interaction.channelId).catch(() => null);

    setTimeout(async () => {
      await interaction.channel?.delete().catch((err) => {
        console.error("Failed to delete ticket channel:", err);
      });
    }, 5000);
  }
}
