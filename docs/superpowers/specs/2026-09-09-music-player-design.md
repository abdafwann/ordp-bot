# YouTube Music Player Design Specification

## 1. Overview
Adds an in-memory, per-guild YouTube music player module to the Discord bot using `@discordjs/voice`, `play-dl`, and `ffmpeg-static`. Supports direct URL playback, interactive keyword search with select menu choices, queue management, audio controls, and auto-idle disconnect.

---

## 2. Architecture & Dependencies

### 2.1 Dependencies
- `@discordjs/voice`: Voice gateway connection, `AudioPlayer` lifecycle, audio resource dispatcher.
- `play-dl`: YouTube video metadata extraction, keyword search, and live audio stream demuxing.
- `ffmpeg-static`: Bundled static FFmpeg binary used for audio stream transcoding.
- `libsodium-wrappers` (or `sodium-native`): Discord voice payload encryption.
- `@discordjs/opus`: Native Opus audio encoding for Discord voice channels.

### 2.2 Discord Gateway Intent
- Update `ExtendedClient` in `src/core/client.ts` to include `GatewayIntentBits.GuildVoiceStates`.

---

## 3. Module Design (`src/modules/music/`)

### 3.1 Data Structures & Models
```ts
export interface Track {
  title: string;
  url: string;
  duration: string;
  thumbnail?: string;
  requestedBy: string; // User ID / display tag
}

export interface GuildQueue {
  guildId: string;
  voiceChannelId: string;
  textChannelId: string;
  connection: VoiceConnection;
  player: AudioPlayer;
  tracks: Track[];
  currentTrack: Track | null;
  isPlaying: boolean;
  isPaused: boolean;
  idleTimeout: NodeJS.Timeout | null;
}
```

### 3.2 `MusicService`
- **`queueMap: Map<string, GuildQueue>`**: Holds active queues indexed by `guildId`.
- **`search(query: string)`**: Searches YouTube using `play-dl`, returning up to 5 video metadata candidates (`title`, `url`, `duration`, `thumbnail`).
- **`joinAndPlay(guildId, voiceChannel, textChannel, track)`**:
  - Connects to the user's voice channel via `joinVoiceChannel` with `selfDeaf: true` (self-deafened like standard music bots).
  - Creates and attaches an `AudioPlayer`.
  - Creates an audio resource with `play-dl.stream(track.url)` and pipes through `createAudioResource`.
  - Listens to player events (`AudioPlayerStatus.Idle`, `AudioPlayerStatus.Playing`, `error`).
  - Advances to next track in `tracks` or starts 5-minute idle timer if queue is empty.
- **`pause(guildId)` / `resume(guildId)`**: Pauses and unpauses the active `AudioPlayer`.
- **`skip(guildId)`**: Stops current track, immediately playing the next track in queue.
- **`stop(guildId)`**: Clears the queue, stops the player, destroys the voice connection, and cleans up the queue map.
- **`getQueue(guildId)`**: Returns current track and pending queue list.

---

## 4. Slash Commands & UI Flow

### 4.1 `/play <query_or_url>`
1. Validates that the executing member is in a voice channel.
2. Checks if `<query_or_url>` is a direct YouTube URL:
   - If **URL**: Fetches video info, enqueues track immediately, responds with an embed (Track Title, Duration, Thumbnail, Position in queue).
   - If **Keyword query**: Searches YouTube for top 5 candidates.
     - Displays a Discord `StringSelectMenuBuilder` with the 5 titles/durations.
     - Ephemeral or channel interaction collector waits for the user's selection (30s timeout).
     - Upon selection, updates message and enqueues chosen track.

### 4.2 Playback Control Commands
- `/pause`: Pauses playback.
- `/resume`: Resumes paused audio.
- `/skip`: Skips to next song.
- `/stop`: Stops playback, clears queue, and leaves voice channel.
- `/queue [page]`: Displays formatted embed of current song + paginated list of upcoming tracks.
- `/nowplaying`: Shows embed with currently playing track, progress, and requester.

---

## 5. Error Handling, Protocols & Edge Cases
1. **User not in Voice Channel:** Returns an ephemeral error message asking the user to join a voice channel first.
2. **Same-Channel Protocol:** If the bot is already active in a voice channel in the guild, reject commands from users who are in a different voice channel.
3. **Bot lacks Voice Permissions:** Checks `Connect` and `Speak` permissions before attempting `joinVoiceChannel`.
4. **Empty Voice Channel Handling (`voiceStateUpdate` event):**
   - When users leave the bot's current voice channel, check if all human members have left (i.e. channel member count without bots <= 0).
   - If empty, start a 60-second disconnect timer. If no user rejoins within 60s, automatically stop playback, clear queue, and leave channel.
   - If a user rejoins before the 60s expires, cancel the disconnect timer.
5. **Manual Kick/Disconnect Safety:** If the bot is forcibly disconnected or moved from voice by a server admin, catch `VoiceConnectionStatus.Destroyed` / `Disconnected` and immediately clean up the guild's queue memory.
6. **Select Menu Expiration Protocol:** The 5-song search dropdown auto-disables after 30 seconds if the user does not make a selection.
7. **Livestream & Extreme Duration Guard:** Rejects livestreams or videos exceeding 3 hours with a friendly notification to prevent memory exhaustion.
8. **Stream Resolution Failure / Age-Restricted:** Catches stream errors gracefully, sends an error embed to the text channel, and attempts to play the next track.
9. **Inactivity Auto-Leave:** Clears state and destroys `VoiceConnection` after 5 minutes of idle queue completion.

---

## 6. Testing Strategy
- Unit tests with `vitest` for `MusicService` queue management:
  - Track enqueuing, popping, skipping, and stopping.
  - Formatter / Embed helper tests.
  - Mocked player event transitions (idle -> next track).
