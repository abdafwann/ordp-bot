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
import youtubedl, { create } from "yt-dlp-exec";
import { formatDuration, createNowPlayingEmbed } from "./music.formatter.js";
import type { Track, SearchResult, GuildQueue } from "./types.js";

const MAX_DURATION_SECONDS = 10800;
const IDLE_TIMEOUT_MS = 300000;
const DISCONNECT_TIMEOUT_MS = 60000;

export class MusicService {
  private queues = new Map<string, GuildQueue>();
  private textChannels = new Map<string, TextBasedChannel>();
  private downloader: { exec: (url: string, flags?: any, opts?: any) => any };

  constructor(downloader?: { exec: (url: string, flags?: any, opts?: any) => any }) {
    if (downloader) {
      this.downloader = downloader;
    } else {
      const binaryPath = process.env.YT_DLP_PATH || "/usr/bin/yt-dlp";
      const createFn = (youtubedl as any)?.create ?? create;
      this.downloader = typeof createFn === "function" ? createFn(binaryPath) : youtubedl;
    }
  }

  private cleanupProcess(queue: GuildQueue): void {
    if (queue.currentProcess) {
      try {
        queue.currentProcess.kill("SIGKILL");
      } catch {}
      queue.currentProcess = null;
    }
  }

  private advanceQueue(guildId: string, sessionId?: number): void {
    const queue = this.queues.get(guildId);
    if (!queue) return;

    if (sessionId !== undefined) {
      if (sessionId !== queue.currentSessionId) {
        return;
      }
      if (queue.advancedSessionId === sessionId) {
        return;
      }
      queue.advancedSessionId = sessionId;
    }

    this.cleanupProcess(queue);
    queue.isPlaying = false;
    queue.currentTrack = null;

    if (queue.tracks.length > 0) {
      void this.playNext(guildId);
    } else {
      queue.idleTimeout = setTimeout(() => {
        this.stop(guildId);
      }, IDLE_TIMEOUT_MS);
    }
  }

  private formatUserErrorMessage(title: string, error: any): string {
    if (error?.code === "ENOENT") {
      return `Failed to play "${title}": Audio downloader is not available.`;
    }
    return `Failed to play "${title}": Could not stream audio.`;
  }

  private async waitForProcessStartup(subprocess: any): Promise<void> {
    if (typeof subprocess.stdout?.once !== "function") {
      return;
    }

    return new Promise<void>((resolve, reject) => {
      let settled = false;

      const onSuccess = () => {
        if (settled) return;
        settled = true;
        cleanup();
        resolve();
      };

      const onFailure = (err: any) => {
        if (settled) return;
        settled = true;
        cleanup();
        reject(err);
      };

      const cleanup = () => {
        if (typeof subprocess.removeListener === "function") {
          subprocess.removeListener("error", onFailure);
          subprocess.removeListener("close", onClose);
        }
        if (subprocess.stdout && typeof subprocess.stdout.removeListener === "function") {
          subprocess.stdout.removeListener("data", onSuccess);
          subprocess.stdout.removeListener("error", onFailure);
        }
      };

      const onClose = (code: number | null) => {
        if (code !== 0 && code !== null) {
          onFailure(new Error(`Downloader exited with code ${code}`));
        }
      };

      subprocess.stdout.once("data", onSuccess);
      subprocess.stdout.once("error", onFailure);
      if (typeof subprocess.once === "function") {
        subprocess.once("error", onFailure);
        subprocess.once("close", onClose);
      }
      if (typeof subprocess.catch === "function") {
        subprocess.catch(onFailure);
      }
    });
  }

  private async handleStartupFailure(
    guildId: string,
    sessionId: number,
    track: Track,
    error: any
  ): Promise<void> {
    const textChannel = this.textChannels.get(guildId);
    if (textChannel && "send" in textChannel) {
      const userMessage = this.formatUserErrorMessage(track.title, error);
      await textChannel.send({ content: userMessage }).catch(() => {});
    }
    this.advanceQueue(guildId, sessionId);
  }

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
          this.advanceQueue(guildId, (player as any).currentSessionId ?? currentQueue.currentSessionId);
        }
      });

      player.on(AudioPlayerStatus.Idle, () => {
        const currentQueue = this.queues.get(guildId);
        if (!currentQueue) return;
        this.advanceQueue(guildId, (player as any).currentSessionId ?? currentQueue.currentSessionId);
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

    const currentTrack = queue.currentTrack;
    this.cleanupProcess(queue);

    queue.currentSessionId = (queue.currentSessionId || 0) + 1;
    const sessionId = queue.currentSessionId;

    queue.isPlaying = true;
    queue.isPaused = false;

    let subprocess: any;
    try {
      const execFn = (this.downloader as any)?.exec || this.downloader;
      subprocess = execFn(currentTrack.url, {
        output: "-",
        format: "bestaudio/best",
        limitRate: "2M",
      });

      if (!subprocess || !subprocess.stdout) {
        throw new Error("No stdout stream available from yt-dlp");
      }

      queue.currentProcess = subprocess;
    } catch (error) {
      console.error("Failed to spawn downloader:", error);
      await this.handleStartupFailure(guildId, sessionId, currentTrack, error);
      return;
    }

    const startupPromise = this.waitForProcessStartup(subprocess);
    let isStarted = false;

    if (typeof subprocess.catch === "function") {
      subprocess.catch((error: any) => {
        if (isStarted) {
          console.error("yt-dlp stream error:", error);
          this.advanceQueue(guildId, sessionId);
        }
      });
    }

    if (typeof subprocess.on === "function") {
      subprocess.on("error", (error: any) => {
        if (isStarted) {
          console.error("yt-dlp process error:", error);
          this.advanceQueue(guildId, sessionId);
        }
      });
    }

    subprocess.stderr?.on?.("data", (data: Buffer) => {
      const message = data.toString();
      if (message.includes("ERROR:")) {
        console.error("yt-dlp error:", message);
      }
    });

    try {
      const resource = createAudioResource(subprocess.stdout, {
        inputType: StreamType.Arbitrary,
      });

      queue.player.play(resource);

      await startupPromise;
      isStarted = true;
      (queue.player as any).currentSessionId = sessionId;

      const textChannel = this.textChannels.get(guildId);
      if (textChannel && "send" in textChannel) {
        const embed = createNowPlayingEmbed(currentTrack);
        await textChannel.send({ embeds: [embed] }).catch(() => {});
      }
    } catch (error) {
      console.error("Failed to stream audio:", error);
      await this.handleStartupFailure(guildId, sessionId, currentTrack, error);
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

    this.cleanupProcess(queue);
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

    this.cleanupProcess(queue);

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
