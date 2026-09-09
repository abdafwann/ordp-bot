# Modular Discord Bot Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a production-ready, modular multi-purpose Discord bot in TypeScript (discord.js v14) with Prisma/SQLite, featuring 9router AI chat with smart context pruning, real-time GitHub webhook logging, moderation & ticketing, and leveling/economy systems.

**Architecture:** Layered modular architecture separating core loaders, services, Prisma models, and route/event handlers. Includes an embedded lightweight HTTP webhook server for real-time GitHub alerts and a scheduled TTL pruner for AI context memory.

**Tech Stack:** Node.js (ESM), TypeScript, discord.js v14, Prisma ORM, SQLite, OpenAI SDK (for 9router), Hono / Node HTTP, Vitest, Zod.

**Spec:** `docs/superpowers/specs/2026-09-09-discord-bot-architecture-design.md`

## Global Constraints
- Node.js v20+ / v22+, TypeScript with strict mode enabled.
- Pure ESM (`"type": "module"` in `package.json`).
- Zero hardcoded secrets: All credentials loaded and validated via Zod from `.env`.
- Database: SQLite with Prisma ORM.
- AI Gateway: OpenAI-compatible API configured for 9router (`baseURL` + `apiKey`).

---

### Task 1: Project Scaffolding, TypeScript, Vitest, and Config Validation

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `vitest.config.ts`
- Create: `.env.example`
- Create: `src/config/env.ts`
- Test: `tests/config/env.test.ts`

**Interfaces:**
- Produces: `env` validated configuration object (`DISCORD_TOKEN`, `DISCORD_CLIENT_ID`, `ROUTER_BASE_URL`, `ROUTER_API_KEY`, `ROUTER_MODEL`, `PORT`, `GITHUB_WEBHOOK_SECRET`, `DATABASE_URL`).

- [ ] **Step 1: Create `package.json`, `tsconfig.json`, `vitest.config.ts`, `.env.example`**
- [ ] **Step 2: Write failing test for environment variable validation in `tests/config/env.test.ts`**
- [ ] **Step 3: Implement `src/config/env.ts` using `zod` and `dotenv`**
- [ ] **Step 4: Run `npx vitest run tests/config/env.test.ts` to verify it passes**

---

### Task 2: Prisma Database Setup & Schema

**Files:**
- Create: `prisma/schema.prisma`
- Create: `src/core/db.ts`
- Test: `tests/core/db.test.ts`

**Interfaces:**
- Produces: `prisma` PrismaClient singleton instance for models `GuildConfig`, `AiConversation`, `AiMessage`, `UserLevel`, `UserEconomy`, `Warning`, `Ticket`.

- [ ] **Step 1: Write `prisma/schema.prisma` with SQLite models**
- [ ] **Step 2: Generate Prisma Client (`npx prisma generate` & push SQLite schema)**
- [ ] **Step 3: Implement `src/core/db.ts` database client export**
- [ ] **Step 4: Write and run `tests/core/db.test.ts` to verify database connectivity and CRUD operations**

---

### Task 3: AI Assistant Service (9router, Context Management & Dual Cleanup)

**Files:**
- Create: `src/modules/ai/ai.service.ts`
- Create: `src/cron/ai-cleanup.cron.ts`
- Create: `src/modules/ai/commands/ask.command.ts`
- Test: `tests/modules/ai/ai.service.test.ts`

**Interfaces:**
- Consumes: `prisma` from `src/core/db.ts`, `env` from `src/config/env.ts`
- Produces: `AiService.generateResponse(guildId, channelId, userId, userPrompt)`, `cleanupExpiredAiMessages(maxAgeMinutes)`

- [ ] **Step 1: Write unit tests in `tests/modules/ai/ai.service.test.ts` for context window filtering (maxMessages & maxAgeMinutes) and prompt generation**
- [ ] **Step 2: Implement `src/modules/ai/ai.service.ts` using OpenAI SDK with custom baseURL for 9router**
- [ ] **Step 3: Implement `src/cron/ai-cleanup.cron.ts` background TTL purge function**
- [ ] **Step 4: Implement `/ask` slash command definition in `src/modules/ai/commands/ask.command.ts`**
- [ ] **Step 5: Run `npx vitest run tests/modules/ai/ai.service.test.ts` to verify all tests pass**

---

### Task 4: GitHub Webhook Server & Event Embed Formatter

**Files:**
- Create: `src/modules/github/github.verifier.ts`
- Create: `src/modules/github/github.formatter.ts`
- Create: `src/server/webhook-server.ts`
- Test: `tests/modules/github/github.test.ts`

**Interfaces:**
- Consumes: `env.GITHUB_WEBHOOK_SECRET`, `client` Discord client
- Produces: `verifyGitHubSignature(payload, signature, secret)`, `formatGitHubEvent(event, payload)`, `startWebhookServer(client, port)`

- [ ] **Step 1: Write failing tests for HMAC SHA-256 signature verification and push/PR Discord embed formatting in `tests/modules/github/github.test.ts`**
- [ ] **Step 2: Implement `src/modules/github/github.verifier.ts` using Node `crypto`**
- [ ] **Step 3: Implement `src/modules/github/github.formatter.ts` building rich Discord Embeds**
- [ ] **Step 4: Implement `src/server/webhook-server.ts` HTTP server handling `POST /api/webhooks/github` and dispatching messages to configured channels**
- [ ] **Step 5: Run `npx vitest run tests/modules/github/github.test.ts` to verify HMAC verification and embed formatters pass**

---

### Task 5: Community & Gamification Module (XP Leveling & Economy)

**Files:**
- Create: `src/modules/community/leveling.service.ts`
- Create: `src/modules/community/economy.service.ts`
- Create: `src/modules/community/commands/rank.command.ts`
- Create: `src/modules/community/commands/economy.command.ts`
- Test: `tests/modules/community/community.test.ts`

**Interfaces:**
- Consumes: `prisma`
- Produces: `LevelingService.addXp(guildId, userId)`, `EconomyService.claimDaily(guildId, userId)`, `EconomyService.coinflip(guildId, userId, amount, choice)`

- [ ] **Step 1: Write unit tests in `tests/modules/community/community.test.ts` for XP level calculation, cooldowns, daily rewards, and coinflip logic**
- [ ] **Step 2: Implement `src/modules/community/leveling.service.ts` and `src/modules/community/economy.service.ts`**
- [ ] **Step 3: Implement `/rank`, `/leaderboard`, `/daily`, `/balance`, `/coinflip`, `/pay` slash commands**
- [ ] **Step 4: Run `npx vitest run tests/modules/community/community.test.ts` to verify tests pass**

---

### Task 6: Moderation & Server Management Module

**Files:**
- Create: `src/modules/moderation/moderation.service.ts`
- Create: `src/modules/moderation/commands/mod.command.ts`
- Create: `src/modules/moderation/ticket.service.ts`
- Create: `src/modules/moderation/commands/ticket.command.ts`
- Test: `tests/modules/moderation/moderation.test.ts`

**Interfaces:**
- Consumes: `prisma`, `discord.js` Permissions
- Produces: `ModerationService.warnUser(...)`, `TicketService.createTicketChannel(guild, user)`

- [ ] **Step 1: Write tests in `tests/modules/moderation/moderation.test.ts` for warning records and ticket lifecycle**
- [ ] **Step 2: Implement `src/modules/moderation/moderation.service.ts` and moderation commands (`/warn`, `/warnings`, `/timeout`, `/kick`, `/ban`, `/clear`)**
- [ ] **Step 3: Implement `src/modules/moderation/ticket.service.ts` and `/ticket-setup` with interactive Discord Buttons and Modals**
- [ ] **Step 4: Run `npx vitest run tests/modules/moderation/moderation.test.ts` to verify tests pass**

---

### Task 7: Core Bot Loader, Command/Event Dispatcher & Entry Point

**Files:**
- Create: `src/core/client.ts`
- Create: `src/core/command-loader.ts`
- Create: `src/events/ready.event.ts`
- Create: `src/events/interactionCreate.event.ts`
- Create: `src/events/messageCreate.event.ts`
- Create: `src/index.ts`
- Create: `src/deploy-commands.ts`

**Interfaces:**
- Consumes: All module commands and events
- Produces: `startBot()` main bootstrap lifecycle

- [ ] **Step 1: Implement `src/core/client.ts` creating `ExtendedClient` with GatewayIntents**
- [ ] **Step 2: Implement `src/core/command-loader.ts` for registering and dispatching Slash Commands and button interactions**
- [ ] **Step 3: Implement event listeners: `ready.event.ts`, `interactionCreate.event.ts`, `messageCreate.event.ts` (handling XP + @Bot AI chat)**
- [ ] **Step 4: Implement `src/deploy-commands.ts` to register Slash commands with Discord REST API**
- [ ] **Step 5: Implement `src/index.ts` bringing together Client, Webhook Server, and Cron jobs**

---

### Task 8: End-to-End Verification & Documentation

**Files:**
- Create: `README.md`
- Run: `npm run typecheck`
- Run: `npm run test`

- [ ] **Step 1: Run full test suite with Vitest**
- [ ] **Step 2: Run strict TypeScript typecheck (`tsc --noEmit`)**
- [ ] **Step 3: Create comprehensive `README.md` with setup guide (Discord Bot Token, 9router API key, GitHub Webhook configuration)**
