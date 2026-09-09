import {
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
  NoSubscriberBehavior,
  StreamType,
  VoiceConnectionStatus,
  type AudioPlayer,
  type VoiceConnection,
} from "@discordjs/voice";
import type { VoiceBasedChannel, TextBasedChannel } from "discord.js";
import { YouTube, type Video } from "youtube-sr";
import youtubedl from "yt-dlp-exec";
import { formatDuration, createNowPlayingEmbed } from "./music.formatter.js";
import type { Track, SearchResult, GuildQueue } from "./types.js";

const MAX_DURATION_SECONDS = 10800;
const IDLE_TIMEOUT_MS = 300000;
const DISCONNECT_TIMEOUT_MS = 60000;

export class MusicService {
  private queues = new Map<string, GuildQueue>();
  private textChannels = new Map<string, TextBasedChannel>();

  public async search(query: string, limit = 5): Promise<SearchResult[]> {
    try {
      const videos = await YouTube.search(query, { limit, type: "video" });
      return videos
        .filter((video: Video) => !video.live && video.duration > 0 && Math.floor(video.duration / 1000) <= MAX_DURATION_SECONDS)
        .map((video: Video) => ({
          title: video.title ?? "Unknown Title",
          url: video.url,
          duration: formatDuration(Math.floor(video.duration / 1000)),
          durationInSec: Math.floor(video.duration / 1000),
          thumbnail: video.thumbnail?.url,
        }));
    } catch (error) {
      console.error("YouTube search error:", error);
      return [];
    }
  }

  public async resolveTrack(
    queryOrUrl: string,
    requestedBy: string,
    requestedById: string
  ): Promise<Track | null> {
    const isUrl = YouTube.validate(queryOrUrl, "VIDEO");

    if (isUrl) {
      try {
        const video = await YouTube.getVideo(queryOrUrl);
        if (video) {
          const durationInSec = Math.floor(video.duration / 1000);
          if (video.live || durationInSec <= 0 || durationInSec > MAX_DURATION_SECONDS) {
            return null;
          }

          return {
            title: video.title ?? "Unknown Title",
            url: video.url,
            duration: formatDuration(durationInSec),
            durationInSec,
            thumbnail: video.thumbnail?.url,
            requestedBy,
            requestedById,
          };
        }
      } catch {
        return null;
      }
    }

    const searchResults = await this.search(queryOrUrl, 1);
    if (searchResults.length === 0) {
      return null;
    }

    const firstResult = searchResults[0];
    return {
      title: firstResult.title,
      url: firstResult.url,
      duration: firstResult.duration,
      durationInSec: firstResult.durationInSec,
      thumbnail: firstResult.thumbnail,
      requestedBy,
      requestedById,
    };
  }

  public async enqueue(
    guildId: string,
    voiceChannel: VoiceBasedChannel,
    textChannel: TextBasedChannel,
    track: Track
  ): Promise<{ position: number; track: Track }> {
    this.textChannels.set(guildId, textChannel);

    let queue = this.queues.get(guildId);

    if (!queue) {
      const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId,
        adapterCreator: voiceChannel.guild.voiceAdapterCreator,
        selfDeaf: false,
        selfMute: false,
      });

      const player = createAudioPlayer({
        behaviors: {
          noSubscriber: NoSubscriberBehavior.Play,
        },
      });

      connection.subscribe(player);

      connection.on(VoiceConnectionStatus.Disconnected, () => {
        this.stop(guildId);
      });

      connection.on(VoiceConnectionStatus.Destroyed, () => {
        this.stop(guildId);
      });

      player.on("error", (error) => {
        console.error("Audio player error:", error);
        const currentQueue = this.queues.get(guildId);
        if (currentQueue) {
          currentQueue.currentTrack = null;
          this.playNext(guildId);
        }
      });

      player.on(AudioPlayerStatus.Idle, () => {
        const currentQueue = this.queues.get(guildId);
        if (!currentQueue) return;

        currentQueue.isPlaying = false;
        currentQueue.currentTrack = null;

        if (currentQueue.tracks.length > 0) {
          this.playNext(guildId);
        } else {
          currentQueue.idleTimeout = setTimeout(() => {
            this.stop(guildId);
          }, IDLE_TIMEOUT_MS);
        }
      });

      queue = {
        guildId,
        voiceChannelId: voiceChannel.id,
        textChannelId: textChannel.id,
        connection,
        player,
        tracks: [],
        currentTrack: null,
        isPlaying: false,
        isPaused: false,
        idleTimeout: null,
        disconnectTimeout: null,
      };

      this.queues.set(guildId, queue);
    }

    queue.voiceChannelId = voiceChannel.id;
    queue.textChannelId = textChannel.id;

    if (queue.idleTimeout) {
      clearTimeout(queue.idleTimeout);
      queue.idleTimeout = null;
    }

    if (queue.isPlaying) {
      queue.tracks.push(track);
      return { position: queue.tracks.length, track };
    }

    queue.currentTrack = track;
    queue.isPlaying = true;
    await this.playNext(guildId);
    return { position: 0, track };
  }

  public async playNext(guildId: string): Promise<void> {
    const queue = this.queues.get(guildId);
    if (!queue) return;

    if (queue.idleTimeout) {
      clearTimeout(queue.idleTimeout);
      queue.idleTimeout = null;
    }

    if (!queue.currentTrack) {
      if (queue.tracks.length > 0) {
        queue.currentTrack = queue.tracks.shift() ?? null;
      } else {
        queue.isPlaying = false;
        queue.currentTrack = null;
        queue.idleTimeout = setTimeout(() => {
          this.stop(guildId);
        }, IDLE_TIMEOUT_MS);
        return;
      }
    }

    if (!queue.currentTrack) return;

    queue.isPlaying = true;
    queue.isPaused = false;

    try {
      const execFn = (youtubedl as any).exec || youtubedl;
      const subprocess = execFn(queue.currentTrack.url, {
        output: "-",
        format: "bestaudio/best",
        limitRate: "2M",
      });

      if (!subprocess.stdout) {
        throw new Error("No stdout stream available from yt-dlp");
      }

      subprocess.stderr?.on("data", (data: Buffer) => {
        const message = data.toString();
        if (message.includes("ERROR:")) {
          console.error("yt-dlp error:", message);
        }
      });

      const resource = createAudioResource(subprocess.stdout, {
        inputType: StreamType.Arbitrary,
      });

      queue.player.play(resource);

      const textChannel = this.textChannels.get(guildId);
      if (textChannel && "send" in textChannel) {
        const embed = createNowPlayingEmbed(queue.currentTrack);
        await textChannel.send({ embeds: [embed] }).catch(() => {});
      }
    } catch (error) {
      console.error("Failed to stream audio:", error);
      queue.currentTrack = null;
      await this.playNext(guildId);
    }
  }

  public pause(guildId: string): boolean {
    const queue = this.queues.get(guildId);
    if (!queue || !queue.isPlaying || queue.isPaused) {
      return false;
    }

    const paused = queue.player.pause();
    if (paused) {
      queue.isPaused = true;
    }
    return paused;
  }

  public resume(guildId: string): boolean {
    const queue = this.queues.get(guildId);
    if (!queue || !queue.isPlaying || !queue.isPaused) {
      return false;
    }

    const resumed = queue.player.unpause();
    if (resumed) {
      queue.isPaused = false;
    }
    return resumed;
  }

  public skip(guildId: string): boolean {
    const queue = this.queues.get(guildId);
    if (!queue || !queue.isPlaying) {
      return false;
    }

    queue.currentTrack = null;
    queue.player.stop();
    return true;
  }

  public stop(guildId: string): boolean {
    const queue = this.queues.get(guildId);
    if (!queue) {
      return false;
    }

    if (queue.idleTimeout) {
      clearTimeout(queue.idleTimeout);
      queue.idleTimeout = null;
    }

    if (queue.disconnectTimeout) {
      clearTimeout(queue.disconnectTimeout);
      queue.disconnectTimeout = null;
    }

    queue.tracks = [];
    queue.currentTrack = null;
    queue.isPlaying = false;
    queue.isPaused = false;

    try {
      queue.player.stop(true);
    } catch {}

    try {
      queue.connection.destroy();
    } catch {}

    this.queues.delete(guildId);
    this.textChannels.delete(guildId);
    return true;
  }

  public getQueue(guildId: string): GuildQueue | undefined {
    return this.queues.get(guildId);
  }

  public handleVoiceStateLeave(channelId: string, humanCount: number): void {
    for (const [guildId, queue] of this.queues.entries()) {
      if (queue.voiceChannelId === channelId) {
        if (humanCount === 0) {
          if (!queue.disconnectTimeout) {
            queue.disconnectTimeout = setTimeout(() => {
              this.stop(guildId);
            }, DISCONNECT_TIMEOUT_MS);
          }
        }
      }
    }
  }

  public handleVoiceStateRejoin(channelId: string): void {
    for (const [, queue] of this.queues.entries()) {
      if (queue.voiceChannelId === channelId) {
        if (queue.disconnectTimeout) {
          clearTimeout(queue.disconnectTimeout);
          queue.disconnectTimeout = null;
        }
      }
    }
  }
}

export const musicService = new MusicService();
