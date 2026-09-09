import { Events, Collection, type VoiceState, type GuildMember } from "discord.js";
import type { ExtendedClient } from "../core/client.js";
import { musicService } from "../modules/music/music.service.js";

export function registerVoiceStateUpdateEvent(client: ExtendedClient): void {
  client.on(Events.VoiceStateUpdate, (oldState: VoiceState, newState: VoiceState) => {
    const guildId = newState.guild?.id ?? oldState.guild?.id;
    if (!guildId) return;

    const queue = musicService.getQueue(guildId);
    if (!queue) return;

    const channel =
      (oldState.channel?.id === queue.voiceChannelId ? oldState.channel : null) ??
      (newState.channel?.id === queue.voiceChannelId ? newState.channel : null) ??
      oldState.guild?.channels?.cache?.get(queue.voiceChannelId) ??
      newState.guild?.channels?.cache?.get(queue.voiceChannelId);

    if (!channel || channel.id !== queue.voiceChannelId) return;

    const members = "members" in channel ? channel.members : null;
    if (!members || !(members instanceof Collection)) return;

    const nonBotMembers = members.filter((member: GuildMember) => !member.user?.bot);
    const nonBotCount = nonBotMembers.size;

    if (nonBotCount === 0) {
      musicService.handleVoiceStateLeave(channel.id, 0);
    } else {
      musicService.handleVoiceStateRejoin(channel.id);
    }
  });
}
