import {
  SlashCommandBuilder,
  GuildMember,
  PermissionFlagsBits,
  ComponentType,
  MessageFlags,
  type TextBasedChannel,
  type StringSelectMenuInteraction,
} from "discord.js";
import { YouTube } from "youtube-sr";
import { Command } from "../../../types/command.js";
import { musicService } from "../music.service.js";
import {
  createNowPlayingEmbed,
  createAddedToQueueEmbed,
  createSearchResultSelectMenu,
  createSearchResultEmbed,
} from "../music.formatter.js";

export const playCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Plays music from YouTube via URL or search query")
    .addStringOption((option) =>
      option
        .setName("query")
        .setDescription("YouTube video URL or song title/artist")
        .setRequired(true)
    ),

  async execute(interaction) {
    if (!(interaction.member instanceof GuildMember) || !interaction.guildId) {
      await interaction.reply({
        content: "❌ This command can only be used in a server.",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    const member = interaction.member;
    const voiceChannel = member.voice.channel;

    if (!voiceChannel) {
      await interaction.reply({
        content: "❌ You need to join a voice channel first!",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    const existingQueue = musicService.getQueue(interaction.guildId);
    if (existingQueue && existingQueue.voiceChannelId !== voiceChannel.id) {
      await interaction.reply({
        content: "❌ You must be in the same voice channel as the bot!",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    const botUser = interaction.client.user;
    if (botUser) {
      const permissions = voiceChannel.permissionsFor(botUser);
      if (
        !permissions ||
        !permissions.has(PermissionFlagsBits.Connect) ||
        !permissions.has(PermissionFlagsBits.Speak)
      ) {
        await interaction.reply({
          content: "❌ I need permissions to connect and speak in your voice channel!",
          flags: MessageFlags.Ephemeral,
        });
        return;
      }
    }

    const query = interaction.options.getString("query", true);
    const isUrl = YouTube.validate(query, "VIDEO");

    if (isUrl) {
      await interaction.deferReply();

      const track = await musicService.resolveTrack(
        query,
        member.user.username,
        member.id
      );

      if (!track) {
        await interaction.editReply("❌ Could not load video or it exceeds duration limits.");
        return;
      }

      const res = await musicService.enqueue(
        interaction.guildId,
        voiceChannel,
        interaction.channel as TextBasedChannel,
        track
      );

      if (res.position === 0) {
        await interaction.editReply({ embeds: [createNowPlayingEmbed(track)] });
      } else {
        await interaction.editReply({ embeds: [createAddedToQueueEmbed(track, res.position)] });
      }
      return;
    }

    await interaction.deferReply();
    const results = await musicService.search(query, 5);

    if (results.length === 0) {
      await interaction.editReply("❌ No results found for your search query.");
      return;
    }

    const selectCustomId = `music_search_${interaction.id}`;
    const row = createSearchResultSelectMenu(results, selectCustomId);
    const searchEmbed = createSearchResultEmbed(results);

    const response = await interaction.editReply({
      embeds: [searchEmbed],
      components: [row],
    });

    const collector = response.createMessageComponentCollector({
      componentType: ComponentType.StringSelect,
      filter: (i: StringSelectMenuInteraction) => i.user.id === interaction.user.id,
      time: 120_000,
    });

    collector.on("collect", async (i: StringSelectMenuInteraction) => {
      await i.deferUpdate();
      const selectedUrl = i.values[0];

      const track = await musicService.resolveTrack(
        selectedUrl,
        member.user.username,
        member.id
      );

      if (!track) {
        await interaction.editReply({
          content: "❌ Could not load selected video.",
          components: [],
        });
        collector.stop("selected");
        return;
      }

      const res = await musicService.enqueue(
        interaction.guildId!,
        voiceChannel,
        interaction.channel as TextBasedChannel,
        track
      );

      const embed =
        res.position === 0
          ? createNowPlayingEmbed(track)
          : createAddedToQueueEmbed(track, res.position);

      await interaction.editReply({
        embeds: [embed],
        components: [],
      });
      collector.stop("selected");
    });

    collector.on("end", async (_collected, reason) => {
      if (reason !== "selected") {
        await interaction
          .editReply({
            content: "⏱️ Selection expired.",
            components: [],
          })
          .catch(() => {});
      }
    });
  },
};
