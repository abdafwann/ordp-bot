import { ExtendedClient } from "./client.js";
import { Command } from "../types/command.js";

// AI Commands
import { askCommand } from "../modules/ai/commands/ask.command.js";

// Community Commands
import { helpCommand } from "../modules/community/commands/help.command.js";
import { rankCommand, leaderboardCommand } from "../modules/community/commands/rank.command.js";
import {
  dailyCommand,
  balanceCommand,
  coinflipCommand,
  payCommand,
} from "../modules/community/commands/economy.command.js";
import { pollCommand } from "../modules/community/commands/poll.command.js";
import { afkCommand } from "../modules/community/commands/afk.command.js";
import { remindCommand } from "../modules/community/commands/remind.command.js";
import { userInfoCommand, serverInfoCommand } from "../modules/community/commands/info.command.js";
import { embedCommand } from "../modules/community/commands/embed.command.js";

// Moderation Commands
import {
  warnCommand,
  warningsCommand,
  timeoutCommand,
  kickCommand,
  banCommand,
  clearCommand,
} from "../modules/moderation/commands/mod.command.js";
import { ticketSetupCommand } from "../modules/moderation/commands/ticket.command.js";
import { automodCommand } from "../modules/moderation/commands/automod.command.js";

// GitHub Commands
import { githubCommand } from "../modules/github/commands/github.command.js";

// Music Commands
import { playCommand } from "../modules/music/commands/play.command.js";
import {
  skipCommand,
  pauseCommand,
  resumeCommand,
  stopCommand,
  queueCommand,
  nowPlayingCommand,
} from "../modules/music/commands/music-controls.command.js";

export const allCommands: Command[] = [
  helpCommand,
  askCommand,
  rankCommand,
  leaderboardCommand,
  dailyCommand,
  balanceCommand,
  coinflipCommand,
  payCommand,
  pollCommand,
  afkCommand,
  remindCommand,
  userInfoCommand,
  serverInfoCommand,
  embedCommand,
  warnCommand,
  warningsCommand,
  timeoutCommand,
  kickCommand,
  banCommand,
  clearCommand,
  ticketSetupCommand,
  automodCommand,
  githubCommand,
  playCommand,
  skipCommand,
  pauseCommand,
  resumeCommand,
  stopCommand,
  queueCommand,
  nowPlayingCommand,
];

export function registerCommands(client: ExtendedClient) {
  for (const command of allCommands) {
    client.commands.set(command.data.name, command);
  }
}
