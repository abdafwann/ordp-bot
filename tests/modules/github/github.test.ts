import { describe, it, expect } from "vitest";
import crypto from "node:crypto";
import { verifyGitHubSignature } from "../../../src/modules/github/github.verifier.js";
import {
  formatPushEvent,
  formatPullRequestEvent,
  formatIssuesEvent,
} from "../../../src/modules/github/github.formatter.js";

describe("GitHub Webhook & Signature Verification", () => {
  const secret = "super-secret-webhook-key";
  const payload = JSON.stringify({
    ref: "refs/heads/main",
    repository: { name: "ordp-bot", full_name: "owner/ordp-bot" },
    pusher: { name: "developer" },
    commits: [
      {
        id: "a1b2c3d4e5f67890",
        message: "feat: add webhook support\n\nCloses #12",
        author: { name: "developer" },
        url: "https://github.com/owner/ordp-bot/commit/a1b2c3d4e5f67890",
      },
    ],
  });

  it("should return true for valid HMAC SHA-256 signature", () => {
    const hmac = crypto.createHmac("sha256", secret);
    const signature = `sha256=${hmac.update(payload).digest("hex")}`;

    const isValid = verifyGitHubSignature(payload, signature, secret);
    expect(isValid).toBe(true);
  });

  it("should return false for invalid signature or tampered payload", () => {
    const signature = "sha256=invalidhexsignature12345";
    const isValid = verifyGitHubSignature(payload, signature, secret);
    expect(isValid).toBe(false);
  });

  it("should return false if signature is missing or malformed", () => {
    expect(verifyGitHubSignature(payload, undefined, secret)).toBe(false);
    expect(verifyGitHubSignature(payload, "malformed_without_prefix", secret)).toBe(false);
  });
});

describe("GitHub Event Embed Formatter", () => {
  it("should format push event with commits and branch", () => {
    const pushPayload = {
      ref: "refs/heads/main",
      repository: {
        name: "ordp-bot",
        full_name: "owner/ordp-bot",
        html_url: "https://github.com/owner/ordp-bot",
      },
      pusher: { name: "developer" },
      sender: {
        avatar_url: "https://avatars.githubusercontent.com/u/123",
      },
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

    const embed = formatPushEvent(pushPayload);
    expect(embed.data.title).toContain("[owner/ordp-bot:main]");
    expect(embed.data.description).toContain("feat: add webhook support");
    expect(embed.data.description).toContain("`a1b2c3d`");
  });

  it("should format pull_request event", () => {
    const prPayload = {
      action: "opened",
      repository: {
        full_name: "owner/ordp-bot",
        html_url: "https://github.com/owner/ordp-bot",
      },
      pull_request: {
        number: 42,
        title: "feat: add moderation system",
        html_url: "https://github.com/owner/ordp-bot/pull/42",
        user: { login: "contributor", avatar_url: "https://avatars.githubusercontent.com/u/456" },
        additions: 120,
        deletions: 15,
      },
      sender: {
        login: "contributor",
        avatar_url: "https://avatars.githubusercontent.com/u/456",
      },
    };

    const embed = formatPullRequestEvent(prPayload);
    expect(embed.data.title).toContain("Pull Request #42 opened");
    expect(embed.data.description).toContain("feat: add moderation system");
  });

  it("should format issues event", () => {
    const issuePayload = {
      action: "opened",
      repository: {
        full_name: "owner/ordp-bot",
        html_url: "https://github.com/owner/ordp-bot",
      },
      issue: {
        number: 15,
        title: "Bug: command timeout",
        html_url: "https://github.com/owner/ordp-bot/issues/15",
        user: { login: "reporter", avatar_url: "https://avatars.githubusercontent.com/u/789" },
      },
      sender: {
        login: "reporter",
        avatar_url: "https://avatars.githubusercontent.com/u/789",
      },
    };

    const embed = formatIssuesEvent(issuePayload);
    expect(embed.data.title).toContain("Issue #15 opened");
    expect(embed.data.description).toContain("Bug: command timeout");
  });
});
