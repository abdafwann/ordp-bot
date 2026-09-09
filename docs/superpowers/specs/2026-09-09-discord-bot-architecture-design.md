# Modular Discord Bot Architecture & Design Specification

## 1. Overview
A high-performance, modular Discord bot built with **TypeScript**, **discord.js v14**, and **Prisma ORM (SQLite)**. The bot is designed to be extensible, allowing new modules to be plugged in seamlessly without touching core systems.

## 2. Core Modules & Features

### 2.1 Core Infrastructure
- **Framework:** Node.js (v20+ / v22+), TypeScript (ESM), `discord.js` v14.
- **Data Persistence:** SQLite database managed via Prisma ORM (`prisma/schema.prisma`).
- **Dynamic Loader:** Automatically loads Slash Commands, Message Events, Interaction Listeners, and Scheduled Cron Jobs.
- **Configuration & Validation:** Strict environment variable validation using `zod` and `dotenv`.
- **Integrated Webhook Server:** Lightweight HTTP server (`hono` or `fastify` / native Node HTTP) listening on a dedicated port for external webhooks.

### 2.2 AI Assistant Module (9router / OpenAI Compatible)
- **Engine:** OpenAI SDK pointed to 9router (`baseURL` + `apiKey`).
- **Interaction Modes:**
  - Slash command `/ask <prompt>`
  - Direct `@Bot` mentions in configured channels.
- **Context Management & Token Efficiency:**
  - `MAX_CONTEXT_MESSAGES`: Defaults to last 10 messages per channel/thread.
  - `MAX_CONTEXT_AGE_MINUTES`: Defaults to 30 minutes TTL for context freshness.
- **Dual Cleanup Mechanism:**
  - *Lazy Pruning:* When constructing conversation prompts, only messages matching `createdAt >= (now - MAX_CONTEXT_AGE)` and limited to `MAX_CONTEXT_MESSAGES` are fetched.
  - *Periodic Background Purge:* Scheduled cron job runs periodically (e.g. every hour) to hard-delete expired rows (`DELETE FROM AiMessage WHERE createdAt < threshold`) to keep SQLite lean.

### 2.3 DevOps & GitHub Webhook Module
- **Endpoint:** `POST /api/webhooks/github` on the built-in HTTP server.
- **Security:** HMAC SHA-256 signature verification (`X-Hub-Signature-256`) against `GITHUB_WEBHOOK_SECRET`.
- **Event Handlers:**
  - `push`: Formats branch name, pusher, commit list with SHA, author, and commit diff URL.
  - `pull_request`: Formats PR title, state (opened, closed, merged), author, and PR link.
  - `issues`: Formats issue title, state, author, and issue link.
- **Target Routing:** Sends rich color-coded Discord embeds to designated channels configured per guild/repo.

### 2.4 Server Management & Moderation Module
- **Slash Commands:**
  - `/warn <user> <reason>` - Records a warning against the user.
  - `/warnings <user>` - Lists warning history.
  - `/timeout <user> <duration> [reason]` - Applies a Discord timeout.
  - `/kick <user> [reason]` - Kicks a user.
  - `/ban <user> [reason]` - Bans a user.
  - `/clear <amount>` - Bulk deletes messages.
- **Ticket Support System:**
  - `/ticket-setup` - Sends an interactive embed with an "Open Ticket" button.
  - Interactive Button click creates a private ticket channel with custom permissions and a "Close Ticket" button.
- **Welcome & Auto-Role:**
  - Configurable welcome message embed and auto-assigned initial member role.

### 2.5 Community & Gamification Module
- **XP & Leveling:**
  - Grants XP per non-bot message with a 60-second cooldown per user.
  - Automatically calculates level progression: `level = Math.floor(0.1 * Math.sqrt(xp))`.
  - Slash commands: `/rank [user]`, `/leaderboard`.
- **Economy System:**
  - Balances stored in SQLite (`UserEconomy`).
  - Commands: `/daily` (daily reward streak), `/balance [user]`, `/coinflip <amount> <heads|tails>`, `/pay <user> <amount>`.

---

## 3. Database Schema (Prisma / SQLite)

```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model GuildConfig {
  guildId          String   @id
  welcomeChannelId String?
  welcomeMessage   String?
  autoRoleId       String?
  logChannelId     String?
  githubChannelId  String?
  aiChannelId      String?
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
}

model AiConversation {
  id        String      @id @default(cuid())
  guildId   String
  channelId String
  userId    String
  createdAt DateTime    @default(now())
  updatedAt DateTime    @updatedAt
  messages  AiMessage[]

  @@index([channelId, updatedAt])
}

model AiMessage {
  id             String         @id @default(cuid())
  conversationId String
  conversation   AiConversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
  role           String         // "user" | "assistant" | "system"
  content        String
  createdAt      DateTime       @default(now())

  @@index([conversationId, createdAt])
}

model UserLevel {
  id        String   @id @default(cuid())
  guildId   String
  userId    String
  xp        Int      @default(0)
  level     Int      @default(1)
  lastXpAt  DateTime @default(now())

  @@unique([guildId, userId])
  @@index([guildId, xp])
}

model UserEconomy {
  id          String    @id @default(cuid())
  guildId     String
  userId      String
  balance     Int       @default(100)
  lastDailyAt DateTime?

  @@unique([guildId, userId])
}

model Warning {
  id          String   @id @default(cuid())
  guildId     String
  userId      String
  moderatorId String
  reason      String
  createdAt   DateTime @default(now())

  @@index([guildId, userId])
}

model Ticket {
  id        String   @id @default(cuid())
  guildId   String
  channelId String   @unique
  userId    String
  status    String   @default("OPEN") // "OPEN" | "CLOSED"
  createdAt DateTime @default(now())
  closedAt  DateTime?
}
```

---

## 4. Directory Structure

```
ordp-bot/
├── prisma/
│   ├── schema.prisma
│   └── dev.db
├── src/
│   ├── config/             # Environment variables & constants
│   ├── core/               # Discord client, command/event loaders, database client
│   ├── cron/               # Scheduled cleanup jobs (AI context TTL prune)
│   ├── events/             # Discord gateway event handlers (ready, messageCreate, interactionCreate)
│   ├── modules/
│   │   ├── ai/             # 9router AI service, prompt builder, /ask command
│   │   ├── github/         # Webhook server, HMAC validator, embed formatters
│   │   ├── moderation/     # Mod commands (/warn, /ban, /clear) & tickets
│   │   └── community/      # XP/leveling, economy (/daily, /rank, /balance)
│   ├── server/             # HTTP server for webhooks (Fastify/Hono/Node http)
│   ├── types/              # TypeScript interfaces and types
│   └── index.ts            # Application entry point
├── tests/                  # Unit tests (Vitest)
├── .env.example
├── package.json
├── tsconfig.json
└── vitest.config.ts
```

---

## 5. Verification & Testing Plan
- **Unit Tests:** Vitest tests for AI context pruning, HMAC signature validation, XP formulas, and economy transactions.
- **Type Checking:** `npm run typecheck` (via `tsc --noEmit`).
- **Linter & Code Quality:** Strict TypeScript mode, ESLint.
