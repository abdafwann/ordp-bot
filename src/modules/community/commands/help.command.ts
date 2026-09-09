import { SlashCommandBuilder, EmbedBuilder } from 'discord.js'
import { Command } from '../../../types/command.js'

export const helpCommand: Command = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('List all available slash commands'),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle('🤖 Bot Commands')
      .setDescription(
        'Here is the list of all available commands categorized by feature:',
      )
      .addFields(
        {
          name: '🧠 AI',
          value:
            '`· /ask <prompt>` — Ask the Brilliant AI assistant a question',
        },
        {
          name: '📊 Community & Leveling',
          value:
            "`· /rank [user]` — Check your or another user's rank and XP\n" +
            '`· /leaderboard` — View the top 10 users with highest XP',
        },
        {
          name: '💰 Economy',
          value:
            '`· /daily` — Claim daily coin rewards\n' +
            '`· /balance [user]` — Check coin balance\n' +
            '`· /coinflip <bet> <side>` — Gamble coins on a coinflip\n' +
            '`· /pay <user> <amount>` — Transfer coins to another member',
        },
        {
          name: '🛡️ Moderation',
          value:
            '`· /warn <user> <reason>` — Warn a user\n' +
            '`· /warnings <user>` — View user warning history\n' +
            '`· /timeout <user> <minutes> [reason]` — Timeout a member\n' +
            '`· /kick <user> [reason]` — Kick a member\n' +
            '`· /ban <user> [reason]` — Ban a member\n' +
            '`· /clear <amount>` — Bulk delete messages\n' +
            '`· /ticket-setup <channel>` — Setup a ticket support panel\n' +
            '`· /automod` — Manage server auto-mod, blocklist & spam settings',
        },
        {
          name: '🎵 Music',
          value:
            '`· /play <query>` — Play a song from YouTube (URL or search)\n' +
            '`· /skip` — Skip the current track\n' +
            '`· /pause` — Pause playback\n' +
            '`· /resume` — Resume playback\n' +
            '`· /stop` — Stop playing and clear queue\n' +
            '`· /queue [page]` — View upcoming tracks in queue\n' +
            '`· /nowplaying` — Show currently playing track',
        },
      )
      .setFooter({ text: 'Use /<command> to run any command.' })
      .setTimestamp()

    await interaction.reply({ embeds: [embed] })
  },
}
