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

### 2. 🐙 GitHub Activity Logger (Real-Time Webhook)
- **Built-in HTTP Webhook Server:** Listens on port `3000` (or `PORT`) at `/api/webhooks/github`.
- **HMAC Signature Verification:** Verifies `X-Hub-Signature-256` using `GITHUB_WEBHOOK_SECRET`.
- **Rich Embed Notifications:**
  - `push`: Formats branch, author, commit count, and commit diff links.
  - `pull_request`: Formats PR title, state, additions/deletions, and links.
  - `issues`: Formats issue creation and closure alerts.

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

# 9router AI Gateway
ROUTER_BASE_URL=https://api.9router.com/v1
ROUTER_API_KEY=your_9router_api_key_here
ROUTER_MODEL=gpt-4o-mini
AI_MAX_CONTEXT_MESSAGES=10
AI_MAX_CONTEXT_AGE_MINUTES=30

# Webhook Server & GitHub
PORT=3000
GITHUB_WEBHOOK_SECRET=your_github_webhook_secret_here
GITHUB_DEFAULT_CHANNEL_ID=your_discord_channel_id_for_git_logs

# Database
DATABASE_URL="file:./dev.db"
```

### 4. Setting Up GitHub Webhook
1. Go to your GitHub repository **Settings** -> **Webhooks** -> **Add webhook**.
2. **Payload URL:** `http://<your-server-or-tunnel-url>:3000/api/webhooks/github` (use Cloudflare Tunnel, Ngrok, or your public IP).
3. **Content type:** `application/json`
4. **Secret:** Set the same secret as `GITHUB_WEBHOOK_SECRET` in `.env`.
5. **Events:** Select "Send me everything" or choose *Pushes*, *Pull requests*, and *Issues*.

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
