export interface Track {
  title: string;
  url: string;
  duration: string;
  durationInSec: number;
  thumbnail?: string;
  requestedBy: string;
  requestedById: string;
}

export interface SearchResult {
  title: string;
  url: string;
  duration: string;
  durationInSec: number;
  thumbnail?: string;
}

export interface GuildQueue {
  guildId: string;
  voiceChannelId: string;
  textChannelId: string;
  connection: any;
  player: any;
  tracks: Track[];
  currentTrack: Track | null;
  isPlaying: boolean;
  isPaused: boolean;
  idleTimeout: NodeJS.Timeout | null;
  disconnectTimeout: NodeJS.Timeout | null;
}
