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

const MAX_BODY_BYTES = 1024 * 1024;

export class PayloadTooLargeError extends Error {
  constructor() {
    super("Payload too large");
    this.name = "PayloadTooLargeError";
  }
}

export function readBoundedBody(
  req: IncomingMessage,
  limit: number
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    let received = 0;
    let settled = false;
    const chunks: Buffer[] = [];

    const settle = (complete: () => void) => {
      if (settled) return;
      settled = true;
      req.off("data", onData);
      req.off("end", onEnd);
      req.off("error", onError);
      req.off("aborted", onAborted);
      chunks.length = 0;
      complete();
    };

    function onData(chunk: Buffer) {
      received += chunk.length;
      if (received > limit) {
        settle(() => reject(new PayloadTooLargeError()));
        return;
      }
      chunks.push(chunk);
    }

    function onEnd() {
      const body = Buffer.concat(chunks);
      settle(() => resolve(body));
    }

    function onError(err: Error) {
      settle(() => reject(err));
    }

    function onAborted() {
      settle(() =>
        reject(new Error("Request aborted before the body completed"))
      );
    }

    const declaredLength = Number(req.headers["content-length"]);
    if (Number.isFinite(declaredLength) && declaredLength > limit) {
      settle(() => reject(new PayloadTooLargeError()));
      return;
    }

    req.on("data", onData);
    req.on("end", onEnd);
    req.on("error", onError);
    req.on("aborted", onAborted);
  });
}

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
      const secret = env.GITHUB_WEBHOOK_SECRET;
      if (!secret || secret.trim().length === 0) {
        res.writeHead(503, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({ error: "GitHub webhook secret not configured" })
        );
        return;
      }

      let responded = false;
      const respond = (
        status: number,
        body: string,
        closeConnection = false
      ) => {
        if (responded || res.writableEnded || res.destroyed) return;
        responded = true;
        res.writeHead(status, {
          "Content-Type": "application/json",
          ...(closeConnection ? { Connection: "close" } : {}),
        });
        res.end(body, () => {
          if (closeConnection) {
            res.socket?.destroy();
          }
        });
      };

      try {
        const rawBody = await readBoundedBody(req, MAX_BODY_BYTES);

        const signature = req.headers["x-hub-signature-256"] as
          | string
          | undefined;
        const githubEvent = req.headers["x-github-event"] as string | undefined;

        if (!verifyGitHubSignature(rawBody, signature, secret)) {
          respond(401, JSON.stringify({ error: "Invalid signature" }));
          return;
        }

        try {
          const payload = JSON.parse(rawBody.toString("utf-8"));
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
            const repoFullName = (
              payload as { repository?: { full_name?: string } }
            ).repository?.full_name;

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
              const channel = await client.channels
                .fetch(targetId)
                .catch(() => null);
              if (channel && channel.isTextBased()) {
                await (channel as TextChannel)
                  .send({ embeds: [embed] })
                  .catch((err) => {
                    console.error(
                      `Failed to send GitHub embed to channel ${targetId}:`,
                      err
                    );
                  });
              } else {
                console.error(
                  `[GitHub Webhook] Target channel ${targetId} is not text-based.`
                );
              }
            } else {
              console.warn(
                `[GitHub Webhook] No channel for repo "${repoFullName}" and no fallback configured; event dropped.`
              );
            }
          }

          respond(200, JSON.stringify({ success: true, event: githubEvent }));
        } catch (err) {
          console.error("[GitHub Webhook Server Error]", err);
          respond(400, JSON.stringify({ error: "Bad request" }));
        }
      } catch (err) {
        if (err instanceof PayloadTooLargeError) {
          respond(413, JSON.stringify({ error: "Payload too large" }), true);
          return;
        }
        if (req.destroyed || res.destroyed) {
          console.warn("[GitHub Webhook] Request aborted mid-body.");
          return;
        }
        console.error("[GitHub Webhook Server Error]", err);
        respond(400, JSON.stringify({ error: "Bad request" }));
      }
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
