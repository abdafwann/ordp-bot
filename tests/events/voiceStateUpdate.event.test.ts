import { describe, it, expect, vi, beforeEach } from "vitest";
import { Events, Collection, type VoiceState, type GuildMember, type VoiceBasedChannel } from "discord.js";
import { registerVoiceStateUpdateEvent } from "../../src/events/voiceStateUpdate.event.js";
import { musicService } from "../../src/modules/music/music.service.js";
import type { ExtendedClient } from "../../src/core/client.js";

vi.mock("../../src/modules/music/music.service.js", () => ({
  musicService: {
    getQueue: vi.fn(),
    handleVoiceStateLeave: vi.fn(),
    handleVoiceStateRejoin: vi.fn(),
  },
}));

describe("VoiceStateUpdate Event", () => {
  let mockClient: ExtendedClient;
  let eventHandler: (oldState: VoiceState, newState: VoiceState) => void;

  beforeEach(() => {
    vi.clearAllMocks();

    mockClient = {
      on: vi.fn((event: string, handler: any) => {
        if (event === Events.VoiceStateUpdate) {
          eventHandler = handler;
        }
      }),
    } as unknown as ExtendedClient;

    registerVoiceStateUpdateEvent(mockClient);
  });

  it("should register VoiceStateUpdate event listener on client", () => {
    expect(mockClient.on).toHaveBeenCalledWith(
      Events.VoiceStateUpdate,
      expect.any(Function)
    );
    expect(eventHandler).toBeDefined();
  });

  it("should do nothing if guild is missing", () => {
    const oldState = { guild: null, channel: null } as unknown as VoiceState;
    const newState = { guild: null, channel: null } as unknown as VoiceState;

    eventHandler(oldState, newState);

    expect(musicService.getQueue).not.toHaveBeenCalled();
    expect(musicService.handleVoiceStateLeave).not.toHaveBeenCalled();
    expect(musicService.handleVoiceStateRejoin).not.toHaveBeenCalled();
  });

  it("should do nothing if bot has no active queue for the guild", () => {
    vi.mocked(musicService.getQueue).mockReturnValue(undefined);

    const oldState = {
      guild: { id: "guild-1" },
      channel: { id: "vc-1" },
    } as unknown as VoiceState;
    const newState = {
      guild: { id: "guild-1" },
      channel: { id: "vc-1" },
    } as unknown as VoiceState;

    eventHandler(oldState, newState);

    expect(musicService.getQueue).toHaveBeenCalledWith("guild-1");
    expect(musicService.handleVoiceStateLeave).not.toHaveBeenCalled();
    expect(musicService.handleVoiceStateRejoin).not.toHaveBeenCalled();
  });

  it("should do nothing if the channel does not match queue.voiceChannelId", () => {
    vi.mocked(musicService.getQueue).mockReturnValue({
      voiceChannelId: "vc-bot",
    } as any);

    const oldState = {
      guild: { id: "guild-1" },
      channel: { id: "vc-other" },
    } as unknown as VoiceState;
    const newState = {
      guild: { id: "guild-1" },
      channel: { id: "vc-other" },
    } as unknown as VoiceState;

    eventHandler(oldState, newState);

    expect(musicService.handleVoiceStateLeave).not.toHaveBeenCalled();
    expect(musicService.handleVoiceStateRejoin).not.toHaveBeenCalled();
  });

  it("should call handleVoiceStateLeave with count 0 when no non-bot members remain", () => {
    vi.mocked(musicService.getQueue).mockReturnValue({
      voiceChannelId: "vc-bot",
    } as any);

    const members = new Collection<string, GuildMember>();
    members.set("bot-1", { user: { bot: true } } as unknown as GuildMember);

    const mockChannel = {
      id: "vc-bot",
      members,
    } as unknown as VoiceBasedChannel;

    const oldState = {
      guild: { id: "guild-1" },
      channel: mockChannel,
    } as unknown as VoiceState;
    const newState = {
      guild: { id: "guild-1" },
      channel: null,
    } as unknown as VoiceState;

    eventHandler(oldState, newState);

    expect(musicService.handleVoiceStateLeave).toHaveBeenCalledWith("vc-bot", 0);
    expect(musicService.handleVoiceStateRejoin).not.toHaveBeenCalled();
  });

  it("should call handleVoiceStateRejoin when non-bot members are present", () => {
    vi.mocked(musicService.getQueue).mockReturnValue({
      voiceChannelId: "vc-bot",
    } as any);

    const members = new Collection<string, GuildMember>();
    members.set("bot-1", { user: { bot: true } } as unknown as GuildMember);
    members.set("user-1", { user: { bot: false } } as unknown as GuildMember);

    const mockChannel = {
      id: "vc-bot",
      members,
    } as unknown as VoiceBasedChannel;

    const oldState = {
      guild: { id: "guild-1" },
      channel: null,
    } as unknown as VoiceState;
    const newState = {
      guild: { id: "guild-1" },
      channel: mockChannel,
    } as unknown as VoiceState;

    eventHandler(oldState, newState);

    expect(musicService.handleVoiceStateRejoin).toHaveBeenCalledWith("vc-bot");
    expect(musicService.handleVoiceStateLeave).not.toHaveBeenCalled();
  });

  it("should find channel in guild cache if not directly in oldState/newState channel property", () => {
    vi.mocked(musicService.getQueue).mockReturnValue({
      voiceChannelId: "vc-bot",
    } as any);

    const members = new Collection<string, GuildMember>();
    members.set("user-1", { user: { bot: false } } as unknown as GuildMember);

    const mockChannel = {
      id: "vc-bot",
      members,
    } as unknown as VoiceBasedChannel;

    const channelCache = new Collection<string, any>();
    channelCache.set("vc-bot", mockChannel);

    const oldState = {
      guild: { id: "guild-1", channels: { cache: channelCache } },
      channel: null,
    } as unknown as VoiceState;
    const newState = {
      guild: { id: "guild-1", channels: { cache: channelCache } },
      channel: null,
    } as unknown as VoiceState;

    eventHandler(oldState, newState);

    expect(musicService.handleVoiceStateRejoin).toHaveBeenCalledWith("vc-bot");
  });
});
