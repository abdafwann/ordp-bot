import http, { IncomingMessage, ServerResponse } from "node:http";
import { Client, TextChannel } from "discord.js";
import { env } from "../config/env.js";
import { prisma } from "../core/db.js";
import { verifyGitHubSignature } from "../modules/github/github.verifier.js";
import {
  formatPushEvent,
  formatPullRequestEvent,
  formatIssuesEvent,
  formatWorkflowRunEvent,
} from "../modules/github/github.formatter.js";
import { resolveRepoChannelId } from "../modules/github/github.router.js";

export function createWebhookServer(client: Client) {
  const server = http.createServer(async (req: IncomingMessage, res: ServerResponse) => {
    // Health check endpoint
    if (req.method === "GET" && req.url === "/health") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          status: "healthy",
          bot: client.user?.tag || "offline",
          uptime: Math.floor(process.uptime()),
        })
      );
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
          } else if (githubEvent === "workflow_run") {
            embed = formatWorkflowRunEvent(payload);
          }

          if (embed) {
            const repoFullName = (payload as { repository?: { full_name?: string } })
              .repository?.full_name;

            const mappings = await prisma.repoChannel.findMany();
            const mapping = new Map(
              mappings.map((m) => [m.repoFullName.toLowerCase(), m.channelId])
            );

            const targetId = resolveRepoChannelId(
              repoFullName,
              mapping,
              env.GITHUB_FALLBACK_CHANNEL_ID
            );

            if (targetId) {
              const channel = await client.channels.fetch(targetId).catch(() => null);
              if (channel && channel.isTextBased()) {
                await (channel as TextChannel).send({ embeds: [embed] }).catch((err) => {
                  console.error(`Failed to send GitHub embed to channel ${targetId}:`, err);
                });
              } else {
                console.error(`[GitHub Webhook] Target channel ${targetId} is not text-based.`);
              }
            } else {
              console.warn(
                `[GitHub Webhook] No channel for repo "${repoFullName}" and no fallback configured; event dropped.`
              );
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
