import {
  SlashCommandBuilder,
  GuildMember,
  MessageFlags,
} from "discord.js";
import { Command } from "../../../types/command.js";
import { musicService } from "../music.service.js";
import { createNowPlayingEmbed, createQueueEmbed } from "../music.formatter.js";

function getMemberAndQueue(interaction: any) {
  if (!(interaction.member instanceof GuildMember) || !interaction.guildId) {
    return { error: "❌ This command can only be used in a server." };
  }

  const member = interaction.member;
  const voiceChannel = member.voice.channel;

  if (!voiceChannel) {
    return { error: "❌ You need to join a voice channel first!" };
  }

  const queue = musicService.getQueue(interaction.guildId);
  if (!queue) {
    return { error: "❌ No music is currently playing." };
  }

  if (queue.voiceChannelId !== voiceChannel.id) {
    return { error: "❌ You must be in the same voice channel as the bot!" };
  }

  return { member, voiceChannel, queue, guildId: interaction.guildId };
}

export const skipCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Skip the currently playing song"),

  async execute(interaction) {
    const { error, queue, guildId } = getMemberAndQueue(interaction);
    if (error) {
      await interaction.reply({ content: error, flags: MessageFlags.Ephemeral });
      return;
    }

    if (!queue?.isPlaying || !queue.currentTrack) {
      await interaction.reply({ content: "❌ No track is currently playing.", flags: MessageFlags.Ephemeral });
      return;
    }

    const skipped = musicService.skip(guildId!);
    if (skipped) {
      await interaction.reply({ content: "⏭️ Skipped current track." });
    } else {
      await interaction.reply({ content: "❌ Failed to skip track.", flags: MessageFlags.Ephemeral });
    }
  },
};

export const pauseCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("pause")
    .setDescription("Pause the currently playing song"),

  async execute(interaction) {
    const { error, queue, guildId } = getMemberAndQueue(interaction);
    if (error) {
      await interaction.reply({ content: error, flags: MessageFlags.Ephemeral });
      return;
    }

    if (!queue?.isPlaying) {
      await interaction.reply({ content: "❌ No music is currently playing.", flags: MessageFlags.Ephemeral });
      return;
    }

    if (queue.isPaused) {
      await interaction.reply({ content: "⚠️ Music is already paused.", flags: MessageFlags.Ephemeral });
      return;
    }

    const paused = musicService.pause(guildId!);
    if (paused) {
      await interaction.reply({ content: "⏸️ Paused playback." });
    } else {
      await interaction.reply({ content: "❌ Failed to pause playback.", flags: MessageFlags.Ephemeral });
    }
  },
};

export const resumeCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("resume")
    .setDescription("Resume paused music playback"),

  async execute(interaction) {
    const { error, queue, guildId } = getMemberAndQueue(interaction);
    if (error) {
      await interaction.reply({ content: error, flags: MessageFlags.Ephemeral });
      return;
    }

    if (!queue?.isPlaying) {
      await interaction.reply({ content: "❌ No music is currently in the queue.", flags: MessageFlags.Ephemeral });
      return;
    }

    if (!queue.isPaused) {
      await interaction.reply({ content: "⚠️ Music is not paused.", flags: MessageFlags.Ephemeral });
      return;
    }

    const resumed = musicService.resume(guildId!);
    if (resumed) {
      await interaction.reply({ content: "▶️ Resumed playback." });
    } else {
      await interaction.reply({ content: "❌ Failed to resume playback.", flags: MessageFlags.Ephemeral });
    }
  },
};

export const stopCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Stop music playback, clear the queue, and leave voice channel"),

  async execute(interaction) {
    const { error, guildId } = getMemberAndQueue(interaction);
    if (error) {
      await interaction.reply({ content: error, flags: MessageFlags.Ephemeral });
      return;
    }

    musicService.stop(guildId!);
    await interaction.reply({ content: "⏹️ Stopped playback and cleared the queue." });
  },
};

export const queueCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("View the current music queue")
    .addIntegerOption((option) =>
      option
        .setName("page")
        .setDescription("Page number of the queue")
        .setMinValue(1)
        .setRequired(false)
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
    const queue = musicService.getQueue(interaction.guildId);

    if (queue && member.voice.channel && queue.voiceChannelId !== member.voice.channel.id) {
      await interaction.reply({
        content: "❌ You must be in the same voice channel as the bot!",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    const page = interaction.options.getInteger("page") ?? 1;

    if (!queue) {
      const embed = createQueueEmbed(null, [], page);
      await interaction.reply({ embeds: [embed] });
      return;
    }

    const embed = createQueueEmbed(queue.currentTrack, queue.tracks, page);
    await interaction.reply({ embeds: [embed] });
  },
};

export const nowPlayingCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("nowplaying")
    .setDescription("Show information about the currently playing song"),

  async execute(interaction) {
    if (!(interaction.member instanceof GuildMember) || !interaction.guildId) {
      await interaction.reply({
        content: "❌ This command can only be used in a server.",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    const member = interaction.member;
    const queue = musicService.getQueue(interaction.guildId);

    if (!queue || !queue.currentTrack) {
      await interaction.reply({
        content: "❌ Nothing is currently playing.",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    if (member.voice.channel && queue.voiceChannelId !== member.voice.channel.id) {
      await interaction.reply({
        content: "❌ You must be in the same voice channel as the bot!",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    const embed = createNowPlayingEmbed(queue.currentTrack);
    await interaction.reply({ embeds: [embed] });
  },
};
