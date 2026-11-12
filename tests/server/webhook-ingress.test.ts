import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import crypto from "node:crypto";
import http from "node:http";
import type { AddressInfo } from "node:net";
import type { Client } from "discord.js";

const MAX_BODY_BYTES = 1024 * 1024;
const WEBHOOK_SECRET = "test-webhook-secret";

const state = vi.hoisted(() => ({
  env: {
    PORT: 0,
    GITHUB_WEBHOOK_SECRET: "test-webhook-secret" as string | undefined,
    GITHUB_FALLBACK_CHANNEL_ID: undefined as string | undefined,
  },
  repoChannels: [] as Array<{ repoFullName: string; channelId: string }>,
  channel: null as
    | null
    | {
        isTextBased: () => boolean;
        send: (options: unknown) => Promise<unknown>;
      },
  sentEmbeds: [] as Array<{ embeds: Array<{ data: { title?: string } }> }>,
}));

vi.mock("../../src/config/env.js", () => ({ env: state.env }));

vi.mock("../../src/core/db.js", () => ({
  prisma: {
    repoChannel: {
      findMany: vi.fn(async () => state.repoChannels),
    },
  },
}));

import { createWebhookServer } from "../../src/server/webhook-server.js";

const fakeClient = {
  user: { tag: "TestBot#0001" },
  channels: {
    fetch: vi.fn(async () => state.channel),
  },
} as unknown as Client;

interface HttpResponse {
  status: number;
  headers: http.IncomingHttpHeaders;
  body: Buffer;
}

function sendRequest(
  port: number,
  options: {
    method?: string;
    path?: string;
    headers?: Record<string, string>;
    chunks?: Buffer[];
    delayMs?: number;
  } = {}
): Promise<HttpResponse> {
  return new Promise((resolve, reject) => {
    let settled = false;
    const finish = (fn: () => void) => {
      if (settled) return;
      settled = true;
      fn();
    };

    const req = http.request(
      {
        host: "127.0.0.1",
        port,
        method: options.method ?? "GET",
        path: options.path ?? "/health",
        headers: options.headers,
      },
      (res) => {
        const parts: Buffer[] = [];
        res.on("data", (chunk: Buffer) => parts.push(chunk));
        res.on("end", () =>
          finish(() =>
            resolve({
              status: res.statusCode ?? 0,
              headers: res.headers,
              body: Buffer.concat(parts),
            })
          )
        );
        res.on("error", (err) => finish(() => reject(err)));
      }
    );

    req.on("error", (err) => finish(() => reject(err)));

    const chunks = options.chunks;
    if (chunks) {
      let index = 0;
      const writeNext = () => {
        if (index >= chunks.length) {
          req.end();
          return;
        }
        req.write(chunks[index]);
        index += 1;
        setTimeout(writeNext, options.delayMs ?? 0);
      };
      writeNext();
    } else {
      req.end();
    }
  });
}

function sendAbortedBodyRequest(port: number, prefix: Buffer): Promise<void> {
  return new Promise((resolve) => {
    const req = http.request(
      {
        host: "127.0.0.1",
        port,
        method: "POST",
        path: "/api/webhooks/github",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": String(prefix.length + 4096),
          "X-GitHub-Event": "push",
        },
      },
      () => resolve()
    );
    req.on("error", () => resolve());
    req.write(prefix);
    setTimeout(() => {
      req.destroy();
      resolve();
    }, 50);
  });
}

function sign(body: Buffer, secret: string = WEBHOOK_SECRET): string {
  return `sha256=${crypto.createHmac("sha256", secret).update(body).digest("hex")}`;
}

function webhookHeaders(
  body: Buffer,
  signature: string,
  event = "push"
): Record<string, string> {
  return {
    "Content-Type": "application/json",
    "Content-Length": String(body.length),
    "X-Hub-Signature-256": signature,
    "X-GitHub-Event": event,
  };
}

const pushPayload = {
  ref: "refs/heads/main",
  repository: {
    name: "ordp-bot",
    full_name: "owner/ordp-bot",
    html_url: "https://github.com/owner/ordp-bot",
  },
  pusher: { name: "developer" },
  sender: { avatar_url: "https://avatars.githubusercontent.com/u/123" },
  commits: [
    {
      id: "a1b2c3d4e5f67890",
      message: "feat: add webhook support",
      author: { name: "developer" },
      url: "https://github.com/owner/ordp-bot/commit/a1b2c3d4e5f67890",
    },
  ],
  compare: "https://github.com/owner/ordp-bot/compare/old...new",
};

describe("GitHub webhook HTTP ingress", () => {
  let server: http.Server;
  let port: number;
  let unhandledRejections: unknown[];
  const recordUnhandledRejection = (reason: unknown) => {
    unhandledRejections.push(reason);
  };

  beforeAll(async () => {
    unhandledRejections = [];
    process.on("unhandledRejection", recordUnhandledRejection);
    server = createWebhookServer(fakeClient);
    await new Promise<void>((resolve) => {
      server.listen(0, "127.0.0.1", () => resolve());
    });
    port = (server.address() as AddressInfo).port;
  });

  afterAll(async () => {
    server.closeAllConnections();
    await new Promise<void>((resolve, reject) => {
      server.close((err) => (err ? reject(err) : resolve()));
    });
    process.off("unhandledRejection", recordUnhandledRejection);
  });

  afterEach(() => {
    state.env.GITHUB_WEBHOOK_SECRET = WEBHOOK_SECRET;
    state.env.GITHUB_FALLBACK_CHANNEL_ID = undefined;
    state.repoChannels.length = 0;
    state.channel = null;
    state.sentEmbeds.length = 0;
    vi.clearAllMocks();
  });

  it("serves health checks with 200", async () => {
    const res = await sendRequest(port, { path: "/health" });
    expect(res.status).toBe(200);
    const payload = JSON.parse(res.body.toString());
    expect(payload.status).toBe("healthy");
    expect(payload.bot).toBe("TestBot#0001");
  });

  it("returns 404 for unknown routes", async () => {
    const res = await sendRequest(port, { path: "/nope" });
    expect(res.status).toBe(404);
  });

  it("verifies the signature over raw body bytes", async () => {
    const body = Buffer.concat([
      Buffer.from('{"note":"'),
      Buffer.from([0xff, 0xfe, 0x80]),
      Buffer.from('"}'),
    ]);
    const res = await sendRequest(port, {
      method: "POST",
      path: "/api/webhooks/github",
      headers: webhookHeaders(body, sign(body), "ping"),
      chunks: [body],
    });
    expect(res.status).toBe(200);
    expect(JSON.parse(res.body.toString())).toEqual({
      success: true,
      event: "ping",
    });
  });

  it("routes a valid signed push event to the mapped channel", async () => {
    state.repoChannels.push({
      repoFullName: "owner/ordp-bot",
      channelId: "222222222222222222",
    });
    state.channel = {
      isTextBased: () => true,
      send: vi.fn(async (options: unknown) => {
        state.sentEmbeds.push(
          options as { embeds: Array<{ data: { title?: string } }> }
        );
        return {};
      }),
    };

    const body = Buffer.from(JSON.stringify(pushPayload));
    const res = await sendRequest(port, {
      method: "POST",
      path: "/api/webhooks/github",
      headers: webhookHeaders(body, sign(body)),
      chunks: [body],
    });

    expect(res.status).toBe(200);
    expect(JSON.parse(res.body.toString())).toEqual({
      success: true,
      event: "push",
    });
    expect(fakeClient.channels.fetch).toHaveBeenCalledWith(
      "222222222222222222"
    );
    expect(state.sentEmbeds).toHaveLength(1);
    expect(state.sentEmbeds[0].embeds[0].data.title).toContain(
      "[owner/ordp-bot:main]"
    );
  });

  it("returns 503 when the webhook secret is missing", async () => {
    state.env.GITHUB_WEBHOOK_SECRET = undefined;
    const body = Buffer.from(JSON.stringify(pushPayload));
    const res = await sendRequest(port, {
      method: "POST",
      path: "/api/webhooks/github",
      headers: webhookHeaders(body, sign(body)),
      chunks: [body],
    });
    expect(res.status).toBe(503);
    const health = await sendRequest(port, { path: "/health" });
    expect(health.status).toBe(200);
  });

  it("returns 503 when the webhook secret is empty or whitespace only", async () => {
    const body = Buffer.from(JSON.stringify(pushPayload));

    state.env.GITHUB_WEBHOOK_SECRET = "";
    const emptyRes = await sendRequest(port, {
      method: "POST",
      path: "/api/webhooks/github",
      headers: webhookHeaders(body, sign(body)),
      chunks: [body],
    });
    expect(emptyRes.status).toBe(503);

    state.env.GITHUB_WEBHOOK_SECRET = "   ";
    const whitespaceRes = await sendRequest(port, {
      method: "POST",
      path: "/api/webhooks/github",
      headers: webhookHeaders(body, sign(body)),
      chunks: [body],
    });
    expect(whitespaceRes.status).toBe(503);

    const health = await sendRequest(port, { path: "/health" });
    expect(health.status).toBe(200);
  });

  it("returns 401 when the signature header is missing", async () => {
    const body = Buffer.from(JSON.stringify(pushPayload));
    const headers = webhookHeaders(body, sign(body));
    delete headers["X-Hub-Signature-256"];
    const res = await sendRequest(port, {
      method: "POST",
      path: "/api/webhooks/github",
      headers,
      chunks: [body],
    });
    expect(res.status).toBe(401);
  });

  it("returns 401 for malformed signature headers", async () => {
    const body = Buffer.from(JSON.stringify(pushPayload));
    const malformed = [
      "malformed_without_prefix",
      "sha256=not-hex-characters",
      `sha256=${"a".repeat(63)}`,
      `sha512=${crypto.randomBytes(32).toString("hex")}`,
    ];

    for (const signature of malformed) {
      const res = await sendRequest(port, {
        method: "POST",
        path: "/api/webhooks/github",
        headers: webhookHeaders(body, signature),
        chunks: [body],
      });
      expect(res.status).toBe(401);
    }
  });

  it("returns 401 for a signature computed with the wrong secret", async () => {
    const body = Buffer.from(JSON.stringify(pushPayload));
    const res = await sendRequest(port, {
      method: "POST",
      path: "/api/webhooks/github",
      headers: webhookHeaders(body, sign(body, "other-secret")),
      chunks: [body],
    });
    expect(res.status).toBe(401);
  });

  it("returns 400 for malformed JSON with a valid signature", async () => {
    const body = Buffer.from("{not-json");
    const res = await sendRequest(port, {
      method: "POST",
      path: "/api/webhooks/github",
      headers: webhookHeaders(body, sign(body), "ping"),
      chunks: [body],
    });
    expect(res.status).toBe(400);
    expect(JSON.parse(res.body.toString())).toEqual({ error: "Bad request" });
  });

  it("accepts a body of exactly 1 MiB", async () => {
    const paddingLength = MAX_BODY_BYTES - 10;
    const body = Buffer.from(
      `{"pad":"${"a".repeat(paddingLength)}"}`
    );
    expect(body.length).toBe(MAX_BODY_BYTES);
    const res = await sendRequest(port, {
      method: "POST",
      path: "/api/webhooks/github",
      headers: webhookHeaders(body, sign(body), "ping"),
      chunks: [body],
    });
    expect(res.status).toBe(200);
    expect(JSON.parse(res.body.toString())).toEqual({
      success: true,
      event: "ping",
    });
  });

  it("rejects a declared content length over 1 MiB with 413 and closes the connection", async () => {
    const res = await sendRequest(port, {
      method: "POST",
      path: "/api/webhooks/github",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": String(MAX_BODY_BYTES + 1),
        "X-Hub-Signature-256": sign(Buffer.alloc(0)),
        "X-GitHub-Event": "push",
      },
      chunks: [Buffer.alloc(16, 0x62)],
    });
    expect(res.status).toBe(413);
    expect(JSON.parse(res.body.toString())).toEqual({
      error: "Payload too large",
    });
    expect(res.headers.connection).toBe("close");
  });

  it("rejects a chunked body over 1 MiB with 413", async () => {
    const res = await sendRequest(port, {
      method: "POST",
      path: "/api/webhooks/github",
      headers: {
        "Content-Type": "application/json",
        "X-GitHub-Event": "push",
      },
      chunks: [
        Buffer.alloc(524288, 0x62),
        Buffer.alloc(524288, 0x62),
        Buffer.from("x"),
      ],
      delayMs: 5,
    });
    expect(res.status).toBe(413);
    expect(JSON.parse(res.body.toString())).toEqual({
      error: "Payload too large",
    });
  });

  it("cleans up after a client abort mid-body and stays healthy", async () => {
    const prefix = Buffer.from('{"partial":');
    await sendAbortedBodyRequest(port, prefix);
    await new Promise((resolve) => setTimeout(resolve, 50));

    const health = await sendRequest(port, { path: "/health" });
    expect(health.status).toBe(200);
    expect(unhandledRejections).toHaveLength(0);
  });
});
