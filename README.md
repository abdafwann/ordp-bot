# 🤖 Modular Discord Bot (ordp-bot)

A modern, production-ready, modular Discord bot written in **TypeScript (discord.js v14)** and backed by **Prisma ORM (SQLite)**.

---

## 🚀 Features

### 1. 🧠 AI Assistant (9router Integration)
- **Direct 9router Integration:** Connects via OpenAI SDK using your 9router base URL and API key.
- **Smart Context Retention:** Retains recent conversation context per channel/thread with `maxMessages` and `maxAgeMinutes` TTL limits.
- **Dual Cleanup Architecture:**
  - *Lazy Prune:* Filters out expired messages on prompt generation to save tokens.
  - *Periodic Cron:* Automatically hard-deletes expired history from SQLite to keep the database lightweight.
- **Usage:**
  - `/ask prompt:<your question>`
  - Direct `@Bot` mentions in chat.

### 2. 🐙 GitHub Activity Logger (Repo-Scoped)
- **Built-in HTTP Webhook Server:** Listens on port `3000` (or `PORT`) at `/api/webhooks/github`.
- **HMAC Signature Verification:** Verifies `X-Hub-Signature-256` using `GITHUB_WEBHOOK_SECRET`.
- **Repo-Scoped Routing:** Events are routed by `repository.full_name` to a per-repo channel; unmapped repos fall back to `GITHUB_FALLBACK_CHANNEL_ID`.
- **`/repo` Command:** `/repo add <owner/repo> [channel]` (auto-creates `#github-owner-repo` if omitted), `/repo remove`, `/repo list`.
- **Rich Embed Notifications:**
  - `push`: Formats branch, author, commit count, and commit diff links.
  - `pull_request`: Formats PR title, state, additions/deletions, and links.
  - `issues`: Formats issue creation and closure alerts.
  - `workflow_run`: CI status with color/emoji by conclusion (success/failure/in-progress).

### 3. 🛡️ Server Moderation & Support Tickets
- **Moderation Commands:**
  - `/warn <user> <reason>` - Issues a tracked warning.
  - `/warnings <user>` - Lists a member's warning history.
  - `/timeout <user> <minutes> [reason]` - Times out a user.
  - `/kick <user> [reason]` - Kicks a user from the server.
  - `/ban <user> [reason]` - Bans a user from the server.
  - `/clear <amount>` - Bulk deletes recent messages.
- **Interactive Ticket System:**
  - `/ticket-setup` - Deploys a support ticket panel with interactive Discord Buttons.
  - Auto-creates private ticket channels with dedicated permissions and a "Close Ticket" button.

### 4. 🎮 Community & Gamification
- **XP & Leveling:**
  - Grants XP for chat activity with a 60-second cooldown per user.
  - Commands: `/rank [user]`, `/leaderboard`.
- **Virtual Economy:**
  - Commands: `/daily` (claim free coins every 24h), `/balance [user]`, `/coinflip <amount> <heads|tails>`, `/pay <user> <amount>`.

### 5. 📋 Logging Pipeline
- **Agent Audit Log Endpoint:** `POST /api/audit-log` accepts `{kind: "audit", timestamp, command, severity?, context?}` (single or `{entries: [...]}` batch) or `{kind: "narration", timestamp, summary, title?}`.
  - `audit` → `AUDIT_LOG_CHANNEL_ID` (`#sys-feed`); warn/error also mirrored to `SYS_ALERTS_CHANNEL_ID` (`#sys-alerts`), with `@owner` ping on `error`.
  - `narration` → `NARRATION_CHANNEL_ID` (`#hermes-logs`).
- **Crash Self-Reporting:** `uncaughtException`, `unhandledRejection`, Discord client/shard errors → `#sys-alerts` (best-effort, exit on fatal).
- **Server Logs:** member join/leave, role changes, message edit/delete, and moderation actions (warn/timeout/kick/ban) → `SERVER_LOGS_CHANNEL_ID` (`#server-logs`).

---

## 🛠️ Getting Started

### 1. Prerequisites
- Node.js **v20+** or **v22+**
- A Discord Bot Application from the [Discord Developer Portal](https://discord.com/developers/applications)
  - Ensure **Message Content Intent**, **Server Members Intent**, and **Presence Intent** are enabled in the Bot tab.

### 2. Installation
```bash
# Clone or navigate to the repository
cd /mnt/e/ordp-bot

# Install dependencies
npm install

# Initialize Prisma SQLite database
npm run prisma:push
```

### 3. Environment Variables
Copy `.env.example` to `.env` and fill in your credentials:

```env
# Discord Bot
DISCORD_TOKEN=your_bot_token_here
DISCORD_CLIENT_ID=your_client_id_here
DISCORD_GUILD_ID=your_guild_id_optional_for_instant_dev_commands

# OmniRoute AI Gateway (OpenAI Compatible)
OMNIROUTE_BASE_URL=http://localhost:8000/v1
OMNIROUTE_API_KEY=your_omniroute_api_key_or_dummy_key
OMNIROUTE_MODEL=gpt-4o-mini
AI_MAX_CONTEXT_MESSAGES=10
AI_MAX_CONTEXT_AGE_MINUTES=30

# Webhook Server & GitHub
PORT=3000
GITHUB_WEBHOOK_SECRET=your_github_webhook_secret_here
GITHUB_DEFAULT_CHANNEL_ID=your_discord_channel_id_for_git_logs
GITHUB_FALLBACK_CHANNEL_ID=your_discord_channel_id_for_unmapped_repos

# Agent Audit Logging
AUDIT_LOG_CHANNEL_ID=your_discord_channel_id_for_agent_logs
NARRATION_CHANNEL_ID=your_discord_channel_id_for_hermes_narration
SYS_ALERTS_CHANNEL_ID=your_discord_channel_id_for_alerts
SERVER_LOGS_CHANNEL_ID=your_discord_channel_id_for_server_logs

# Database
DATABASE_URL="file:./dev.db"
```

### 4. Setting Up GitHub Webhook
**Recommended (GitHub App, covers all repos at once):**
1. GitHub → **Settings → Developer settings → GitHub Apps → New GitHub App**.
2. **Webhook URL:** `http://<your-server-or-tunnel-url>:3000/api/webhooks/github` (use Cloudflare Tunnel, Ngrok, or your public IP).
3. **Webhook secret:** same value as `GITHUB_WEBHOOK_SECRET` in `.env`.
4. Subscribe to events: `push`, `pull_request`, `issues`, `workflow_run`.
5. Install the App on **All repositories** — new repos are auto-covered; route each repo with `/repo add`.

**Per-repo alternative:** Repo **Settings → Webhooks → Add webhook** with the same payload URL, content type `application/json`, and the shared secret.

### 5. Deploy Slash Commands
Register slash commands with Discord:
```bash
npm run deploy-commands
```

### 6. Run the Bot
```bash
# Development mode (hot reload)
npm run dev

# Production build & start
npm run build
npm start
```

---

## 🧪 Testing & Typecheck

```bash
# Run unit & integration tests
npm test

# Run strict TypeScript typechecking
npm run typecheck
```

---

## 🧩 Adding New Modules

To add a new feature:
1. Create a service under `src/modules/<feature-name>/`.
2. Create slash commands under `src/modules/<feature-name>/commands/`.
3. Export and add the command to `allCommands` in `src/core/command-loader.ts`.
4. Run `npm run deploy-commands`.
