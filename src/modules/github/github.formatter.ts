import { EmbedBuilder } from "discord.js";

export interface GitHubPushPayload {
  ref: string;
  repository: {
    name: string;
    full_name: string;
    html_url: string;
  };
  pusher: {
    name: string;
  };
  sender?: {
    avatar_url: string;
  };
  commits: Array<{
    id: string;
    message: string;
    author: {
      name: string;
    };
    url: string;
  }>;
  compare?: string;
}

export interface GitHubPullRequestPayload {
  action: string;
  repository: {
    full_name: string;
    html_url: string;
  };
  pull_request: {
    number: number;
    title: string;
    html_url: string;
    user: {
      login: string;
      avatar_url: string;
    };
    additions?: number;
    deletions?: number;
  };
  sender: {
    login: string;
    avatar_url: string;
  };
}

export interface GitHubIssuePayload {
  action: string;
  repository: {
    full_name: string;
    html_url: string;
  };
  issue: {
    number: number;
    title: string;
    html_url: string;
    user: {
      login: string;
      avatar_url: string;
    };
  };
  sender: {
    login: string;
    avatar_url: string;
  };
}

export interface GitHubWorkflowRunPayload {
  action: string;
  repository: {
    full_name: string;
    html_url: string;
  };
  workflow_run: {
    id: number;
    name: string;
    head_branch: string;
    head_sha: string;
    status: string;
    conclusion: string | null;
    html_url: string;
    display_title: string;
  };
  sender: {
    login: string;
    avatar_url: string;
  };
}

export function formatPushEvent(payload: GitHubPushPayload): EmbedBuilder {
  const branch = payload.ref.replace("refs/heads/", "");
  const commitCount = payload.commits.length;
  const commitPlural = commitCount === 1 ? "commit" : "commits";

  const commitList = payload.commits
    .slice(0, 10)
    .map((c) => {
      const shortSha = c.id.substring(0, 7);
      const firstLine = c.message.split("\n")[0];
      return `[\`${shortSha}\`](${c.url}) ${firstLine} - *${c.author.name}*`;
    })
    .join("\n");

  const embed = new EmbedBuilder()
    .setColor(0x238636) // GitHub green
    .setTitle(`[${payload.repository.full_name}:${branch}] ${commitCount} new ${commitPlural}`)
    .setURL(payload.compare || payload.repository.html_url)
    .setAuthor({
      name: payload.pusher.name,
      iconURL: payload.sender?.avatar_url,
    })
    .setDescription(commitList || "No commit details provided.")
    .setTimestamp();

  return embed;
}

export function formatPullRequestEvent(payload: GitHubPullRequestPayload): EmbedBuilder {
  const action = payload.action;
  const pr = payload.pull_request;

  let color = 0x8957e5; // Purple for PR
  if (action === "closed") color = 0xda3633; // Red
  if (action === "reopened") color = 0x238636; // Green

  const embed = new EmbedBuilder()
    .setColor(color)
    .setTitle(`[${payload.repository.full_name}] Pull Request #${pr.number} ${action}: ${pr.title}`)
    .setURL(pr.html_url)
    .setAuthor({
      name: pr.user.login,
      iconURL: pr.user.avatar_url,
    })
    .setDescription(
      `**Title:** ${pr.title}\n**Changes:** +${pr.additions || 0} / -${pr.deletions || 0}`
    )
    .setTimestamp();

  return embed;
}

export function formatIssuesEvent(payload: GitHubIssuePayload): EmbedBuilder {
  const action = payload.action;
  const issue = payload.issue;

  const embed = new EmbedBuilder()
    .setColor(action === "closed" ? 0x8250df : 0xbf8700)
    .setTitle(`[${payload.repository.full_name}] Issue #${issue.number} ${action}: ${issue.title}`)
    .setURL(issue.html_url)
    .setAuthor({
      name: issue.user.login,
      iconURL: issue.user.avatar_url,
    })
    .setDescription(`**Title:** ${issue.title}\n[View Issue](${issue.html_url})`)
    .setTimestamp();

  return embed;
}

export function formatWorkflowRunEvent(payload: GitHubWorkflowRunPayload): EmbedBuilder {
  const run = payload.workflow_run;
  const status = run.status;
  const conclusion = run.conclusion;

  let color = 0xdbab0a; // yellow: in progress / queued
  let emoji = "🟡";

  if (status === "completed") {
    if (conclusion === "success") {
      color = 0x238636;
      emoji = "✅";
    } else if (conclusion === "failure") {
      color = 0xda3633;
      emoji = "❌";
    } else if (conclusion === "cancelled") {
      color = 0x8b949e;
      emoji = "⚪";
    } else {
      color = 0xdbab0a;
      emoji = "⚠️";
    }
  }

  const shortSha = run.head_sha.substring(0, 7);
  const state = conclusion ? `${status} / ${conclusion}` : status;

  const embed = new EmbedBuilder()
    .setColor(color)
    .setTitle(`${emoji} [${payload.repository.full_name}] Workflow ${state}: ${run.name}`)
    .setURL(run.html_url)
    .setAuthor({
      name: payload.sender.login,
      iconURL: payload.sender.avatar_url,
    })
    .setDescription(
      `**Run:** ${run.display_title || run.name}\n**Branch:** ${run.head_branch} (\`${shortSha}\`)`
    )
    .setTimestamp();

  return embed;
}
