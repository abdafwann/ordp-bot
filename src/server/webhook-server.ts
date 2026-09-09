import http, { IncomingMessage, ServerResponse } from "node:http";
import { Client, TextChannel } from "discord.js";
import { env } from "../config/env.js";
import { prisma } from "../core/db.js";
import { verifyGitHubSignature } from "../modules/github/github.verifier.js";
import {
  formatPushEvent,
  formatPullRequestEvent,
  formatIssuesEvent,
} from "../modules/github/github.formatter.js";

export function createWebhookServer(client: Client) {
  const server = http.createServer(async (req: IncomingMessage, res: ServerResponse) => {
    // Health check endpoint
    if (req.method === "GET" && req.url === "/health") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ status: "healthy", bot: client.user?.tag || "offline" }));
      return;
    }

    // GitHub webhook endpoint
    if (req.method === "POST" && req.url === "/api/webhooks/github") {
      const chunks: Uint8Array[] = [];

      req.on("data", (chunk) => {
        chunks.push(chunk);
      });

      req.on("end", async () => {
        const rawBody = Buffer.concat(chunks).toString("utf-8");
        const signature = req.headers["x-hub-signature-256"] as string | undefined;
        const githubEvent = req.headers["x-github-event"] as string | undefined;

        if (env.GITHUB_WEBHOOK_SECRET) {
          const isValid = verifyGitHubSignature(
            rawBody,
            signature,
            env.GITHUB_WEBHOOK_SECRET
          );
          if (!isValid) {
            res.writeHead(401, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Invalid signature" }));
            return;
          }
        }

        try {
          const payload = JSON.parse(rawBody);
          let embed;

          if (githubEvent === "push") {
            embed = formatPushEvent(payload);
          } else if (githubEvent === "pull_request") {
            embed = formatPullRequestEvent(payload);
          } else if (githubEvent === "issues") {
            embed = formatIssuesEvent(payload);
          }

          if (embed) {
            // 1. Send Direct Message to Bot Owner if BOT_OWNER_ID is configured
            if (env.BOT_OWNER_ID) {
              try {
                const owner = await client.users.fetch(env.BOT_OWNER_ID).catch(() => null);
                if (owner) {
                  await owner.send({ embeds: [embed] }).catch((dmErr) => {
                    console.error("[GitHub DM Error] Could not DM bot owner:", dmErr);
                  });
                }
              } catch (err) {
                console.error("[GitHub DM Fetch Error]", err);
              }
            }

            // 2. Find target channel (from DB guild configs or fallback to env default channel)
            const configs = await prisma.guildConfig.findMany({
              where: {
                githubChannelId: { not: null },
              },
            });

            const channelIds = new Set<string>();
            if (env.GITHUB_DEFAULT_CHANNEL_ID) {
              channelIds.add(env.GITHUB_DEFAULT_CHANNEL_ID);
            }
            for (const cfg of configs) {
              if (cfg.githubChannelId) channelIds.add(cfg.githubChannelId);
            }

            for (const chId of channelIds) {
              const channel = await client.channels.fetch(chId).catch(() => null);
              if (channel && channel.isTextBased()) {
                await (channel as TextChannel).send({ embeds: [embed] }).catch((err) => {
                  console.error(`Failed to send GitHub embed to channel ${chId}:`, err);
                });
              }
            }
          }

          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ success: true, event: githubEvent }));
        } catch (err) {
          console.error("[GitHub Webhook Server Error]", err);
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Bad request" }));
        }
      });
      return;
    }

    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not found" }));
  });

  return server;
}

export function startWebhookServer(client: Client, port = env.PORT) {
  const server = createWebhookServer(client);
  server.listen(port, () => {
    console.log(`[Webhook Server] Listening on http://localhost:${port}`);
  });
  return server;
}
