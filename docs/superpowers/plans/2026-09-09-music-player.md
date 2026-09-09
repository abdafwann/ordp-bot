# YouTube Music Player Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a fully featured, per-guild YouTube music player module in the Discord bot with search dropdowns, queue management, audio playback controls, and auto-idle/empty-channel voice state safety.

**Architecture:** A centralized in-memory `MusicService` manages active `GuildQueue` instances and orchestrates `@discordjs/voice` `AudioPlayer` connections, streaming YouTube audio via `play-dl` and `ffmpeg-static`. User-facing interactions use Discord slash commands and `StringSelectMenuBuilder`.

**Tech Stack:** TypeScript (ESM), `discord.js` v14, `@discordjs/voice`, `play-dl`, `ffmpeg-static`, `libsodium-wrappers`, `@discordjs/opus`, `vitest`.

**Spec:** `docs/superpowers/specs/2026-09-09-music-player-design.md`

## Global Constraints
- Node.js ESM with strict TypeScript.
- Clean code architecture: decoupled services, handlers, and formatters.
- Zero extra comments in source code unless requested.
- Self-deafened bot join (`selfDeaf: true`).
- Max video duration limit (3 hours) & livestream guard.
- 60s empty voice channel timer; 5m queue idle timer.

---

### Task 1: Install Dependencies & Update Voice Gateway Intents

**Files:**
- Modify: `package.json`
- Modify: `src/core/client.ts:9-16`

**Interfaces:**
- Produces: Installed `@discordjs/voice`, `play-dl`, `ffmpeg-static`, `libsodium-wrappers`, `@discordjs/opus`, `@types/libsodium-wrappers`.
- Produces: `GatewayIntentBits.GuildVoiceStates` enabled on `ExtendedClient`.

- [ ] **Step 1: Install required packages**

Run:
```bash
npm install @discordjs/voice play-dl ffmpeg-static libsodium-wrappers @discordjs/opus
npm install -D @types/libsodium-wrappers
```

- [ ] **Step 2: Update ExtendedClient intents in `src/core/client.ts`**

Add `GatewayIntentBits.GuildVoiceStates` to `src/core/client.ts`.

- [ ] **Step 3: Verify build and typecheck**

Run: `npm run typecheck`
Expected: PASS with 0 errors.

---

### Task 2: Music Types and Embed Formatters

**Files:**
- Create: `src/modules/music/types.ts`
- Create: `src/modules/music/music.formatter.ts`
- Create: `tests/modules/music/music.formatter.test.ts`

**Interfaces:**
- Produces: `Track`, `GuildQueue`, `SearchResult` interfaces.
- Produces: `formatDuration(seconds: number): string`, `createNowPlayingEmbed(track: Track)`, `createQueueEmbed(current: Track | null, tracks: Track[], page: number)`, `createSearchResultSelectMenu(results: SearchResult[])`.

- [ ] **Step 1: Write failing test in `tests/modules/music/music.formatter.test.ts`**

Test duration formatting and queue embed rendering.

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/modules/music/music.formatter.test.ts`
Expected: FAIL

- [ ] **Step 3: Implement `types.ts` and `music.formatter.ts`**

Create type definitions and embed/component builder functions.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/modules/music/music.formatter.test.ts`
Expected: PASS

---

### Task 3: Music Service & Queue Management

**Files:**
- Create: `src/modules/music/music.service.ts`
- Create: `tests/modules/music/music.service.test.ts`

**Interfaces:**
- Produces: `MusicService` singleton with methods:
  - `search(query: string): Promise<SearchResult[]>`
  - `resolveTrack(queryOrUrl: string, requestedBy: string): Promise<Track | null>`
  - `enqueue(guildId: string, voiceChannel: VoiceBasedChannel, textChannel: TextBasedChannel, track: Track): Promise<{ position: number; track: Track }>`
  - `pause(guildId: string): boolean`
  - `resume(guildId: string): boolean`
  - `skip(guildId: string): boolean`
  - `stop(guildId: string): boolean`
  - `getQueue(guildId: string): GuildQueue | undefined`
  - `handleVoiceStateLeave(channelId: string, memberCount: number): void`
  - `handleVoiceStateRejoin(channelId: string): void`

- [ ] **Step 1: Write unit tests in `tests/modules/music/music.service.test.ts`**

Test queue operations, enqueueing, popping next song, skip, stop, and timer triggers.

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/modules/music/music.service.test.ts`
Expected: FAIL

- [ ] **Step 3: Implement `MusicService` in `src/modules/music/music.service.ts`**

Implement queue management, `@discordjs/voice` player lifecycle, and `play-dl` stream handling.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/modules/music/music.service.test.ts`
Expected: PASS

---

### Task 4: Voice State Event Listener

**Files:**
- Create: `src/events/voiceStateUpdate.event.ts`
- Modify: `src/index.ts`

**Interfaces:**
- Consumes: `musicService.handleVoiceStateLeave`, `musicService.handleVoiceStateRejoin`
- Produces: `registerVoiceStateUpdateEvent(client: ExtendedClient)` listener for channel leave/join cleanup.

- [ ] **Step 1: Implement `src/events/voiceStateUpdate.event.ts`**

Listens to `Events.VoiceStateUpdate`, checks human member count in the bot's channel, and dispatches to `musicService`.

- [ ] **Step 2: Register voice state update in `src/index.ts`**

Call `registerVoiceStateUpdateEvent(client)` during bot initialization.

- [ ] **Step 3: Typecheck verification**

Run: `npm run typecheck`
Expected: PASS

---

### Task 5: Slash Commands (`/play`, `/queue`, `/skip`, `/pause`, `/resume`, `/stop`, `/nowplaying`)

**Files:**
- Create: `src/modules/music/commands/play.command.ts`
- Create: `src/modules/music/commands/music-controls.command.ts`
- Modify: `src/core/command-loader.ts`
- Modify: `src/events/interactionCreate.event.ts`

**Interfaces:**
- Produces: `playCommand`, `queueCommand`, `skipCommand`, `pauseCommand`, `resumeCommand`, `stopCommand`, `nowPlayingCommand`.
- Consumes: `musicService`, `musicFormatter`.

- [ ] **Step 1: Implement `src/modules/music/commands/play.command.ts`**

Includes slash command definition with string parameter `query`, URL validation, select menu rendering for keyword search, interaction collector with 30s timeout, same-channel check, and voice permission checks.

- [ ] **Step 2: Implement `src/modules/music/commands/music-controls.command.ts`**

Implements `/queue`, `/skip`, `/pause`, `/resume`, `/stop`, and `/nowplaying` with same-channel validation.

- [ ] **Step 3: Register all music commands in `src/core/command-loader.ts`**

Import and add all music commands to `allCommands` array.

- [ ] **Step 4: Update `/help` command**

Update `src/modules/community/commands/help.command.ts` to include the new Music category and commands.

- [ ] **Step 5: Typecheck & Full Test Suite**

Run: `npm run typecheck && npm run test`
Expected: PASS all tests.
