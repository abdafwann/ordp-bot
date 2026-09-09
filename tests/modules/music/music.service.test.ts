import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { MusicService } from "../../../src/modules/music/music.service.js";
import type { VoiceBasedChannel, TextBasedChannel } from "discord.js";
import { YouTube } from "youtube-sr";
import youtubedl from "yt-dlp-exec";
import * as voice from "@discordjs/voice";

vi.mock("youtube-sr", () => ({
  YouTube: {
    search: vi.fn(),
    validate: vi.fn(),
    getVideo: vi.fn(),
  },
  default: {
    search: vi.fn(),
    validate: vi.fn(),
    getVideo: vi.fn(),
  },
}));

vi.mock("yt-dlp-exec", () => {
  const execFn = vi.fn(() => ({
    stdout: { pipe: vi.fn(), on: vi.fn() },
    stderr: { on: vi.fn() },
  }));
  return {
    exec: execFn,
    default: {
      exec: execFn,
    },
  };
});

vi.mock("@discordjs/voice", () => {
  return {
    joinVoiceChannel: vi.fn(),
    createAudioPlayer: vi.fn(),
    createAudioResource: vi.fn(),
    StreamType: {
      Arbitrary: "arbitrary",
      Raw: "raw",
      Opus: "opus",
    },
    AudioPlayerStatus: {
      Idle: "idle",
      Playing: "playing",
      Paused: "paused",
      AutoPaused: "autopaused",
      Buffering: "buffering",
    },
    VoiceConnectionStatus: {
      Signalling: "signalling",
      Connecting: "connecting",
      Ready: "ready",
      Disconnected: "disconnected",
      Destroyed: "destroyed",
    },
    NoSubscriberBehavior: {
      Pause: "pause",
      Play: "play",
      Stop: "stop",
    },
  };
});

describe("MusicService", () => {
  let service: MusicService;
  let mockVoiceChannel: VoiceBasedChannel;
  let mockTextChannel: TextBasedChannel;
  let mockConnection: any;
  let mockPlayer: any;
  let connectionListeners: Record<string, Function>;
  let playerListeners: Record<string, Function>;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();

    connectionListeners = {};
    playerListeners = {};

    mockConnection = {
      subscribe: vi.fn(),
      destroy: vi.fn(),
      on: vi.fn((event: string, handler: Function) => {
        connectionListeners[event] = handler;
        return mockConnection;
      }),
    };

    mockPlayer = {
      play: vi.fn(),
      pause: vi.fn(() => true),
      unpause: vi.fn(() => true),
      stop: vi.fn(),
      on: vi.fn((event: string, handler: Function) => {
        playerListeners[event] = handler;
        return mockPlayer;
      }),
    };

    vi.mocked(voice.joinVoiceChannel).mockReturnValue(mockConnection);
    vi.mocked(voice.createAudioPlayer).mockReturnValue(mockPlayer);
    vi.mocked(voice.createAudioResource).mockReturnValue({} as any);

    mockVoiceChannel = {
      id: "vc-123",
      guild: {
        id: "guild-123",
        voiceAdapterCreator: {} as any,
      },
    } as unknown as VoiceBasedChannel;

    mockTextChannel = {
      id: "tc-123",
      send: vi.fn().mockResolvedValue({}),
    } as unknown as TextBasedChannel;

    service = new MusicService();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("search", () => {
    it("should return formatted search results and filter out invalid/live/overlong videos", async () => {
      vi.mocked(YouTube.search).mockResolvedValue([
        {
          title: "Valid Video",
          url: "https://youtube.com/watch?v=1",
          duration: 200000,
          live: false,
          thumbnail: { url: "https://example.com/1.jpg" },
        } as any,
        {
          title: "Live Stream",
          url: "https://youtube.com/watch?v=2",
          duration: 0,
          live: true,
          thumbnail: undefined,
        } as any,
        {
          title: "Too Long Video (4 hours)",
          url: "https://youtube.com/watch?v=3",
          duration: 14400000,
          live: false,
          thumbnail: undefined,
        } as any,
      ]);

      const results = await service.search("test query", 5);

      expect(results).toHaveLength(1);
      expect(results[0]).toEqual({
        title: "Valid Video",
        url: "https://youtube.com/watch?v=1",
        duration: "03:20",
        durationInSec: 200,
        thumbnail: "https://example.com/1.jpg",
      });
      expect(YouTube.search).toHaveBeenCalledWith("test query", {
        limit: 5,
        type: "video",
      });
    });
  });

  describe("resolveTrack", () => {
    it("should resolve direct youtube video URL", async () => {
      vi.mocked(YouTube.validate).mockReturnValue(true);
      vi.mocked(YouTube.getVideo).mockResolvedValue({
        title: "Direct Video",
        url: "https://youtube.com/watch?v=direct",
        duration: 180000,
        live: false,
        thumbnail: { url: "https://example.com/direct.jpg" },
      } as any);

      const track = await service.resolveTrack(
        "https://youtube.com/watch?v=direct",
        "Alice",
        "alice-id"
      );

      expect(track).toEqual({
        title: "Direct Video",
        url: "https://youtube.com/watch?v=direct",
        duration: "03:00",
        durationInSec: 180,
        thumbnail: "https://example.com/direct.jpg",
        requestedBy: "Alice",
        requestedById: "alice-id",
      });
    });

    it("should return null if direct video is live or over 3 hours", async () => {
      vi.mocked(YouTube.validate).mockReturnValue(true);
      vi.mocked(YouTube.getVideo).mockResolvedValue({
        title: "Too Long",
        url: "https://youtube.com/watch?v=long",
        duration: 20000000,
        live: false,
      } as any);

      const track = await service.resolveTrack(
        "https://youtube.com/watch?v=long",
        "Alice",
        "alice-id"
      );

      expect(track).toBeNull();
    });

    it("should perform search and return first result if query is not a video URL", async () => {
      vi.mocked(YouTube.validate).mockReturnValue(false);
      vi.mocked(YouTube.search).mockResolvedValue([
        {
          title: "Searched Video",
          url: "https://youtube.com/watch?v=search1",
          duration: 240000,
          live: false,
          thumbnail: { url: "https://example.com/thumb.jpg" },
        } as any,
      ]);

      const track = await service.resolveTrack("some song name", "Bob", "bob-id");

      expect(track).toEqual({
        title: "Searched Video",
        url: "https://youtube.com/watch?v=search1",
        duration: "04:00",
        durationInSec: 240,
        thumbnail: "https://example.com/thumb.jpg",
        requestedBy: "Bob",
        requestedById: "bob-id",
      });
    });

    it("should return null if search finds nothing", async () => {
      vi.mocked(YouTube.validate).mockReturnValue(false);
      vi.mocked(YouTube.search).mockResolvedValue([]);

      const track = await service.resolveTrack("nonexistent", "Bob", "bob-id");
      expect(track).toBeNull();
    });
  });

  describe("enqueue and playNext", () => {
    const track1 = {
      title: "Song 1",
      url: "https://youtube.com/watch?v=1",
      duration: "03:00",
      durationInSec: 180,
      requestedBy: "Alice",
      requestedById: "111",
    };

    const track2 = {
      title: "Song 2",
      url: "https://youtube.com/watch?v=2",
      duration: "04:00",
      durationInSec: 240,
      requestedBy: "Bob",
      requestedById: "222",
    };

    it("should create queue and immediately play first track (position 0)", async () => {
      const result = await service.enqueue(
        "guild-123",
        mockVoiceChannel,
        mockTextChannel,
        track1
      );

      expect(result.position).toBe(0);
      expect(result.track).toBe(track1);

      const queue = service.getQueue("guild-123");
      expect(queue).toBeDefined();
      expect(queue?.isPlaying).toBe(true);
      expect(queue?.currentTrack).toEqual(track1);
      expect(queue?.tracks).toHaveLength(0);

      expect(voice.joinVoiceChannel).toHaveBeenCalledWith({
        channelId: "vc-123",
        guildId: "guild-123",
        adapterCreator: expect.any(Object),
        selfDeaf: false,
        selfMute: false,
      });
      expect(mockConnection.subscribe).toHaveBeenCalledWith(mockPlayer);
      expect(youtubedl.exec).toHaveBeenCalledWith(track1.url, expect.any(Object));
      expect(mockPlayer.play).toHaveBeenCalled();
      expect(mockTextChannel.send).toHaveBeenCalled();
    });

    it("should append subsequent track to queue with correct position", async () => {
      await service.enqueue("guild-123", mockVoiceChannel, mockTextChannel, track1);

      const result = await service.enqueue(
        "guild-123",
        mockVoiceChannel,
        mockTextChannel,
        track2
      );

      expect(result.position).toBe(1);
      expect(result.track).toBe(track2);

      const queue = service.getQueue("guild-123");
      expect(queue?.tracks).toHaveLength(1);
      expect(queue?.tracks[0]).toEqual(track2);
    });

    it("should automatically play next track when player becomes idle", async () => {
      await service.enqueue("guild-123", mockVoiceChannel, mockTextChannel, track1);
      await service.enqueue("guild-123", mockVoiceChannel, mockTextChannel, track2);

      // Trigger Idle event
      playerListeners["idle"]?.();
      await Promise.resolve();

      const queue = service.getQueue("guild-123");
      expect(queue?.currentTrack).toEqual(track2);
      expect(queue?.tracks).toHaveLength(0);
      expect(youtubedl.exec).toHaveBeenCalledWith(track2.url, expect.any(Object));
    });

    it("should start 5-minute idle timeout when last track finishes", async () => {
      await service.enqueue("guild-123", mockVoiceChannel, mockTextChannel, track1);

      // Trigger Idle event when no upcoming tracks exist
      playerListeners["idle"]?.();

      const queue = service.getQueue("guild-123");
      expect(queue?.isPlaying).toBe(false);
      expect(queue?.currentTrack).toBeNull();
      expect(queue?.idleTimeout).not.toBeNull();

      // Fast-forward 5 minutes (300000ms)
      vi.advanceTimersByTime(300000);

      // Queue should now be destroyed and removed
      expect(service.getQueue("guild-123")).toBeUndefined();
      expect(mockConnection.destroy).toHaveBeenCalled();
    });
  });

  describe("pause and resume", () => {
    const track = {
      title: "Song 1",
      url: "https://youtube.com/watch?v=1",
      duration: "03:00",
      durationInSec: 180,
      requestedBy: "Alice",
      requestedById: "111",
    };

    it("should pause playback if playing and unpause when resuming", async () => {
      await service.enqueue("guild-123", mockVoiceChannel, mockTextChannel, track);

      expect(service.pause("guild-123")).toBe(true);
      const queue = service.getQueue("guild-123");
      expect(queue?.isPaused).toBe(true);
      expect(mockPlayer.pause).toHaveBeenCalled();

      // Pausing again when already paused returns false
      expect(service.pause("guild-123")).toBe(false);

      expect(service.resume("guild-123")).toBe(true);
      expect(queue?.isPaused).toBe(false);
      expect(mockPlayer.unpause).toHaveBeenCalled();

      // Resuming again when not paused returns false
      expect(service.resume("guild-123")).toBe(false);
    });

    it("should return false if no active queue exists", () => {
      expect(service.pause("non-existent")).toBe(false);
      expect(service.resume("non-existent")).toBe(false);
    });
  });

  describe("skip", () => {
    const track1 = {
      title: "Song 1",
      url: "https://youtube.com/watch?v=1",
      duration: "03:00",
      durationInSec: 180,
      requestedBy: "Alice",
      requestedById: "111",
    };

    it("should stop player to skip current song", async () => {
      await service.enqueue("guild-123", mockVoiceChannel, mockTextChannel, track1);

      expect(service.skip("guild-123")).toBe(true);
      expect(mockPlayer.stop).toHaveBeenCalled();
    });

    it("should return false when skipping non-existent queue", () => {
      expect(service.skip("unknown")).toBe(false);
    });
  });

  describe("stop", () => {
    const track1 = {
      title: "Song 1",
      url: "https://youtube.com/watch?v=1",
      duration: "03:00",
      durationInSec: 180,
      requestedBy: "Alice",
      requestedById: "111",
    };

    it("should clear tracks, stop player, destroy connection, and remove queue", async () => {
      await service.enqueue("guild-123", mockVoiceChannel, mockTextChannel, track1);

      expect(service.stop("guild-123")).toBe(true);
      expect(service.getQueue("guild-123")).toBeUndefined();
      expect(mockPlayer.stop).toHaveBeenCalledWith(true);
      expect(mockConnection.destroy).toHaveBeenCalled();

      // Stopping again returns false
      expect(service.stop("guild-123")).toBe(false);
    });
  });

  describe("voice state listeners and disconnect timeout", () => {
    const track1 = {
      title: "Song 1",
      url: "https://youtube.com/watch?v=1",
      duration: "03:00",
      durationInSec: 180,
      requestedBy: "Alice",
      requestedById: "111",
    };

    it("should set a 60-second disconnect timeout when humanCount is 0, and stop when expired", async () => {
      await service.enqueue("guild-123", mockVoiceChannel, mockTextChannel, track1);

      service.handleVoiceStateLeave("vc-123", 0);

      const queue = service.getQueue("guild-123");
      expect(queue?.disconnectTimeout).not.toBeNull();

      // Fast-forward 60s
      vi.advanceTimersByTime(60000);

      expect(service.getQueue("guild-123")).toBeUndefined();
      expect(mockConnection.destroy).toHaveBeenCalled();
    });

    it("should clear disconnect timeout if a user rejoins before timeout expires", async () => {
      await service.enqueue("guild-123", mockVoiceChannel, mockTextChannel, track1);

      service.handleVoiceStateLeave("vc-123", 0);
      let queue = service.getQueue("guild-123");
      expect(queue?.disconnectTimeout).not.toBeNull();

      // Rejoin at 30 seconds
      vi.advanceTimersByTime(30000);
      service.handleVoiceStateRejoin("vc-123");

      queue = service.getQueue("guild-123");
      expect(queue?.disconnectTimeout).toBeNull();

      // Advance another 60s - queue should still be alive
      vi.advanceTimersByTime(60000);
      expect(service.getQueue("guild-123")).toBeDefined();
    });

    it("should automatically stop when connection emits Disconnected or Destroyed", async () => {
      await service.enqueue("guild-123", mockVoiceChannel, mockTextChannel, track1);

      connectionListeners["disconnected"]?.();
      expect(service.getQueue("guild-123")).toBeUndefined();
    });
  });
});
