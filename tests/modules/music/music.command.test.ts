import { describe, it, expect, vi, beforeEach } from "vitest";
import { GuildMember, PermissionFlagsBits, MessageFlags } from "discord.js";
import { YouTube } from "youtube-sr";
import { musicService } from "../../../src/modules/music/music.service.js";
import { playCommand } from "../../../src/modules/music/commands/play.command.js";
import {
  skipCommand,
  pauseCommand,
  resumeCommand,
  stopCommand,
  queueCommand,
  nowPlayingCommand,
} from "../../../src/modules/music/commands/music-controls.command.js";

vi.mock("youtube-sr", () => ({
  YouTube: {
    validate: vi.fn(),
  },
  default: {
    validate: vi.fn(),
  },
}));

vi.mock("../../../src/modules/music/music.service.js", () => {
  const service = {
    search: vi.fn(),
    resolveTrack: vi.fn(),
    enqueue: vi.fn(),
    pause: vi.fn(),
    resume: vi.fn(),
    skip: vi.fn(),
    stop: vi.fn(),
    getQueue: vi.fn(),
  };
  return {
    musicService: service,
  };
});

function createMockMember(
  voiceChannelId?: string,
  permissions = [PermissionFlagsBits.Connect, PermissionFlagsBits.Speak]
) {
  const member = Object.create(GuildMember.prototype);
  Object.defineProperty(member, "id", { value: "user-123", writable: true, configurable: true });
  Object.defineProperty(member, "user", {
    value: { id: "user-123", username: "TestUser" },
    writable: true,
    configurable: true,
  });
  Object.defineProperty(member, "voice", {
    value: {
      channel: voiceChannelId
        ? {
            id: voiceChannelId,
            permissionsFor: vi.fn().mockReturnValue({
              has: vi.fn((perm) => permissions.includes(perm)),
            }),
          }
        : null,
    },
    writable: true,
    configurable: true,
  });
  return member;
}

function createMockInteraction(options: Record<string, any> = {}, member = createMockMember("vc-123")) {
  const collectorListeners: Record<string, Function> = {};
  const mockCollector = {
    on: vi.fn((event: string, handler: Function) => {
      collectorListeners[event] = handler;
      return mockCollector;
    }),
    stop: vi.fn((reason?: string) => {
      collectorListeners["end"]?.(new Map(), reason);
    }),
  };

  const responseMessage = {
    createMessageComponentCollector: vi.fn(() => mockCollector),
  };

  return {
    guildId: "guild-123",
    member,
    user: member.user,
    id: "interaction-123",
    client: { user: { id: "bot-123" } },
    channel: { id: "tc-123", isTextBased: () => true },
    options: {
      getString: vi.fn((name: string) => options[name] ?? null),
      getInteger: vi.fn((name: string) => options[name] ?? null),
    },
    reply: vi.fn().mockResolvedValue({}),
    deferReply: vi.fn().mockResolvedValue({}),
    editReply: vi.fn().mockResolvedValue(responseMessage),
    _collectorListeners: collectorListeners,
    _mockCollector: mockCollector,
  };
}

describe("Music Slash Commands", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(musicService.getQueue).mockReturnValue(undefined);
  });

  describe("playCommand", () => {
    it("should reject if not in a server or not a GuildMember", async () => {
      const interaction = createMockInteraction();
      interaction.member = null as any;

      await playCommand.execute(interaction as any);

    expect(interaction.reply).toHaveBeenCalledWith({
      content: "❌ This command can only be used in a server.",
      flags: MessageFlags.Ephemeral,
    });
    });

    it("should reject if user is not in a voice channel", async () => {
      const memberWithoutVoice = createMockMember();
      const interaction = createMockInteraction({ query: "song" }, memberWithoutVoice);

      await playCommand.execute(interaction as any);

    expect(interaction.reply).toHaveBeenCalledWith({
      content: "❌ You need to join a voice channel first!",
      flags: MessageFlags.Ephemeral,
    });
    });

    it("should reject if user is in a different voice channel than the bot", async () => {
      vi.mocked(musicService.getQueue).mockReturnValue({
        voiceChannelId: "bot-vc",
      } as any);

      const interaction = createMockInteraction({ query: "song" }, createMockMember("user-vc"));

      await playCommand.execute(interaction as any);

    expect(interaction.reply).toHaveBeenCalledWith({
      content: "❌ You must be in the same voice channel as the bot!",
      flags: MessageFlags.Ephemeral,
    });
    });

    it("should reject if bot lacks voice channel permissions", async () => {
      const member = createMockMember("vc-123", []);
      const interaction = createMockInteraction({ query: "song" }, member);

      await playCommand.execute(interaction as any);

    expect(interaction.reply).toHaveBeenCalledWith({
      content: "❌ I need permissions to connect and speak in your voice channel!",
      flags: MessageFlags.Ephemeral,
    });
    });

    it("should play direct URL and show Now Playing embed when enqueued at position 0", async () => {
      vi.mocked(YouTube.validate).mockReturnValue(true);
      const mockTrack = {
        title: "Test Track",
        url: "https://youtube.com/watch?v=direct",
        duration: "03:00",
        durationInSec: 180,
        requestedBy: "TestUser",
        requestedById: "user-123",
      };
      vi.mocked(musicService.resolveTrack).mockResolvedValue(mockTrack);
      vi.mocked(musicService.enqueue).mockResolvedValue({ position: 0, track: mockTrack });

      const interaction = createMockInteraction({ query: "https://youtube.com/watch?v=direct" });

      await playCommand.execute(interaction as any);

      expect(interaction.deferReply).toHaveBeenCalled();
      expect(musicService.resolveTrack).toHaveBeenCalledWith(
        "https://youtube.com/watch?v=direct",
        "TestUser",
        "user-123"
      );
      expect(interaction.editReply).toHaveBeenCalledWith(
        expect.objectContaining({
          embeds: expect.any(Array),
        })
      );
    });

    it("should play direct URL and show Added to Queue embed when enqueued at position > 0", async () => {
      vi.mocked(YouTube.validate).mockReturnValue(true);
      const mockTrack = {
        title: "Test Track 2",
        url: "https://youtube.com/watch?v=direct2",
        duration: "02:30",
        durationInSec: 150,
        requestedBy: "TestUser",
        requestedById: "user-123",
      };
      vi.mocked(musicService.resolveTrack).mockResolvedValue(mockTrack);
      vi.mocked(musicService.enqueue).mockResolvedValue({ position: 2, track: mockTrack });

      const interaction = createMockInteraction({ query: "https://youtube.com/watch?v=direct2" });

      await playCommand.execute(interaction as any);

      expect(interaction.deferReply).toHaveBeenCalled();
      expect(interaction.editReply).toHaveBeenCalledWith(
        expect.objectContaining({
          embeds: expect.any(Array),
        })
      );
    });

    it("should handle failed track resolution for direct URL", async () => {
      vi.mocked(YouTube.validate).mockReturnValue(true);
      vi.mocked(musicService.resolveTrack).mockResolvedValue(null);

      const interaction = createMockInteraction({ query: "https://youtube.com/watch?v=invalid" });

      await playCommand.execute(interaction as any);

      expect(interaction.editReply).toHaveBeenCalledWith(
        "❌ Could not load video or it exceeds duration limits."
      );
    });

    it("should handle keyword search with no results", async () => {
      vi.mocked(YouTube.validate).mockReturnValue(false);
      vi.mocked(musicService.search).mockResolvedValue([]);

      const interaction = createMockInteraction({ query: "nonexistent query" });

      await playCommand.execute(interaction as any);

      expect(interaction.editReply).toHaveBeenCalledWith(
        "❌ No results found for your search query."
      );
    });

    it("should handle keyword search, show select menu, and handle track selection", async () => {
      vi.mocked(YouTube.validate).mockReturnValue(false);
      const searchResults = [
        {
          title: "Search Result 1",
          url: "https://youtube.com/watch?v=res1",
          duration: "03:15",
          durationInSec: 195,
        },
      ];
      vi.mocked(musicService.search).mockResolvedValue(searchResults);

      const mockTrack = {
        title: "Search Result 1",
        url: "https://youtube.com/watch?v=res1",
        duration: "03:15",
        durationInSec: 195,
        requestedBy: "TestUser",
        requestedById: "user-123",
      };
      vi.mocked(musicService.resolveTrack).mockResolvedValue(mockTrack);
      vi.mocked(musicService.enqueue).mockResolvedValue({ position: 0, track: mockTrack });

      const interaction = createMockInteraction({ query: "search query" });

      await playCommand.execute(interaction as any);

      expect(interaction.editReply).toHaveBeenCalledWith(
        expect.objectContaining({
          embeds: expect.any(Array),
          components: expect.any(Array),
        })
      );

      const selectInteraction = {
        user: { id: "user-123" },
        values: ["https://youtube.com/watch?v=res1"],
        deferUpdate: vi.fn().mockResolvedValue({}),
      };

      await interaction._collectorListeners["collect"](selectInteraction);

      expect(selectInteraction.deferUpdate).toHaveBeenCalled();
      expect(musicService.resolveTrack).toHaveBeenCalledWith(
        "https://youtube.com/watch?v=res1",
        "TestUser",
        "user-123"
      );
      expect(interaction.editReply).toHaveBeenLastCalledWith(
        expect.objectContaining({
          embeds: expect.any(Array),
          components: [],
        })
      );
    });

    it("should handle select menu expiration timeout", async () => {
      vi.mocked(YouTube.validate).mockReturnValue(false);
      vi.mocked(musicService.search).mockResolvedValue([
        {
          title: "Track",
          url: "https://youtube.com/watch?v=1",
          duration: "01:00",
          durationInSec: 60,
        },
      ]);

      const interaction = createMockInteraction({ query: "timeout query" });
      await playCommand.execute(interaction as any);

      await interaction._collectorListeners["end"](new Map(), "time");

      expect(interaction.editReply).toHaveBeenCalledWith({
        content: "⏱️ Selection expired.",
        components: [],
      });
    });
  });

  describe("skipCommand", () => {
    it("should reject if no music is playing", async () => {
      vi.mocked(musicService.getQueue).mockReturnValue(undefined);

      const interaction = createMockInteraction();
      await skipCommand.execute(interaction as any);

    expect(interaction.reply).toHaveBeenCalledWith({
      content: "❌ No music is currently playing.",
      flags: MessageFlags.Ephemeral,
    });
    });

    it("should skip track when music is playing", async () => {
      vi.mocked(musicService.getQueue).mockReturnValue({
        voiceChannelId: "vc-123",
        isPlaying: true,
        currentTrack: { title: "Track 1" },
      } as any);
      vi.mocked(musicService.skip).mockReturnValue(true);

      const interaction = createMockInteraction();
      await skipCommand.execute(interaction as any);

      expect(musicService.skip).toHaveBeenCalledWith("guild-123");
      expect(interaction.reply).toHaveBeenCalledWith({
        content: "⏭️ Skipped current track.",
      });
    });
  });

  describe("pauseCommand and resumeCommand", () => {
    it("should pause playback if currently playing", async () => {
      vi.mocked(musicService.getQueue).mockReturnValue({
        voiceChannelId: "vc-123",
        isPlaying: true,
        isPaused: false,
      } as any);
      vi.mocked(musicService.pause).mockReturnValue(true);

      const interaction = createMockInteraction();
      await pauseCommand.execute(interaction as any);

      expect(musicService.pause).toHaveBeenCalledWith("guild-123");
      expect(interaction.reply).toHaveBeenCalledWith({
        content: "⏸️ Paused playback.",
      });
    });

    it("should warn if already paused", async () => {
      vi.mocked(musicService.getQueue).mockReturnValue({
        voiceChannelId: "vc-123",
        isPlaying: true,
        isPaused: true,
      } as any);

      const interaction = createMockInteraction();
      await pauseCommand.execute(interaction as any);

    expect(interaction.reply).toHaveBeenCalledWith({
      content: "⚠️ Music is already paused.",
      flags: MessageFlags.Ephemeral,
    });
    });

    it("should resume playback if paused", async () => {
      vi.mocked(musicService.getQueue).mockReturnValue({
        voiceChannelId: "vc-123",
        isPlaying: true,
        isPaused: true,
      } as any);
      vi.mocked(musicService.resume).mockReturnValue(true);

      const interaction = createMockInteraction();
      await resumeCommand.execute(interaction as any);

      expect(musicService.resume).toHaveBeenCalledWith("guild-123");
      expect(interaction.reply).toHaveBeenCalledWith({
        content: "▶️ Resumed playback.",
      });
    });

    it("should warn if resuming when not paused", async () => {
      vi.mocked(musicService.getQueue).mockReturnValue({
        voiceChannelId: "vc-123",
        isPlaying: true,
        isPaused: false,
      } as any);

      const interaction = createMockInteraction();
      await resumeCommand.execute(interaction as any);

    expect(interaction.reply).toHaveBeenCalledWith({
      content: "⚠️ Music is not paused.",
      flags: MessageFlags.Ephemeral,
    });
    });
  });

  describe("stopCommand", () => {
    it("should stop music and clear queue", async () => {
      vi.mocked(musicService.getQueue).mockReturnValue({
        voiceChannelId: "vc-123",
      } as any);

      const interaction = createMockInteraction();
      await stopCommand.execute(interaction as any);

      expect(musicService.stop).toHaveBeenCalledWith("guild-123");
      expect(interaction.reply).toHaveBeenCalledWith({
        content: "⏹️ Stopped playback and cleared the queue.",
      });
    });
  });

  describe("queueCommand", () => {
    it("should display empty queue embed when no queue exists", async () => {
      vi.mocked(musicService.getQueue).mockReturnValue(undefined);

      const interaction = createMockInteraction();
      await queueCommand.execute(interaction as any);

      expect(interaction.reply).toHaveBeenCalledWith(
        expect.objectContaining({
          embeds: expect.any(Array),
        })
      );
    });

    it("should display populated queue embed", async () => {
      vi.mocked(musicService.getQueue).mockReturnValue({
        voiceChannelId: "vc-123",
        currentTrack: {
          title: "Playing Now",
          url: "https://youtube.com/watch?v=now",
          duration: "03:00",
          requestedBy: "Alice",
        },
        tracks: [
          {
            title: "Next Song",
            url: "https://youtube.com/watch?v=next",
            duration: "04:00",
            requestedBy: "Bob",
          },
        ],
      } as any);

      const interaction = createMockInteraction();
      await queueCommand.execute(interaction as any);

      expect(interaction.reply).toHaveBeenCalledWith(
        expect.objectContaining({
          embeds: expect.any(Array),
        })
      );
    });
  });

  describe("nowPlayingCommand", () => {
    it("should warn if nothing is currently playing", async () => {
      vi.mocked(musicService.getQueue).mockReturnValue(undefined);

      const interaction = createMockInteraction();
      await nowPlayingCommand.execute(interaction as any);

    expect(interaction.reply).toHaveBeenCalledWith({
      content: "❌ Nothing is currently playing.",
      flags: MessageFlags.Ephemeral,
    });
    });

    it("should display now playing embed", async () => {
      vi.mocked(musicService.getQueue).mockReturnValue({
        voiceChannelId: "vc-123",
        currentTrack: {
          title: "Playing Song",
          url: "https://youtube.com/watch?v=playing",
          duration: "03:30",
          durationInSec: 210,
          requestedBy: "Alice",
          requestedById: "111",
        },
      } as any);

      const interaction = createMockInteraction();
      await nowPlayingCommand.execute(interaction as any);

      expect(interaction.reply).toHaveBeenCalledWith(
        expect.objectContaining({
          embeds: expect.any(Array),
        })
      );
    });
  });
});
