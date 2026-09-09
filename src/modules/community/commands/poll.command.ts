import {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ButtonInteraction,
  ChatInputCommandInteraction,
} from "discord.js";
import { Command } from "../../../types/command.js";
import { utilityService, PollResult } from "../utility.service.js";

function renderProgressBar(percentage: number, length = 10): string {
  const filled = Math.round((percentage / 100) * length);
  const empty = length - filled;
  return "█".repeat(filled) + "░".repeat(empty);
}

export function buildPollEmbed(
  question: string,
  results: PollResult[],
  creatorId: string
): { embed: EmbedBuilder; row: ActionRowBuilder<ButtonBuilder> } {
  const totalVotes = results.reduce((acc, curr) => acc + curr.count, 0);

  const embed = new EmbedBuilder()
    .setColor(0x5865f2)
    .setTitle(`📊 Poll: ${question}`)
    .setDescription(
      results
        .map((r, i) => {
          const bar = renderProgressBar(r.percentage);
          return `**${i + 1}. ${r.option}**\n${bar} \`${r.percentage}%\` (${r.count} votes)`;
        })
        .join("\n\n")
    )
    .setFooter({
      text: `Created by user • Total Votes: ${totalVotes} • Click a button to vote / toggle`,
    })
    .setTimestamp();

  const buttonRow = new ActionRowBuilder<ButtonBuilder>();
  results.forEach((_, idx) => {
    buttonRow.addComponents(
      new ButtonBuilder()
        .setCustomId(`poll_vote_${idx}`)
        .setLabel(`${idx + 1}`)
        .setStyle(ButtonStyle.Secondary)
    );
  });

  return { embed, row: buttonRow };
}

export const pollCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("poll")
    .setDescription("Create an interactive community poll with live voting buttons")
    .addStringOption((opt) =>
      opt.setName("question").setDescription("The poll question").setRequired(true)
    )
    .addStringOption((opt) =>
      opt.setName("option1").setDescription("Option 1").setRequired(true)
    )
    .addStringOption((opt) =>
      opt.setName("option2").setDescription("Option 2").setRequired(true)
    )
    .addStringOption((opt) => opt.setName("option3").setDescription("Option 3"))
    .addStringOption((opt) => opt.setName("option4").setDescription("Option 4"))
    .addStringOption((opt) => opt.setName("option5").setDescription("Option 5")),

  async execute(interaction: ChatInputCommandInteraction) {
    if (!interaction.guildId) {
      await interaction.reply({ content: "❌ Polls can only be run in a server.", ephemeral: true });
      return;
    }

    const question = interaction.options.getString("question", true);
    const rawOptions = [
      interaction.options.getString("option1", true),
      interaction.options.getString("option2", true),
      interaction.options.getString("option3"),
      interaction.options.getString("option4"),
      interaction.options.getString("option5"),
    ].filter((opt): opt is string => Boolean(opt && opt.trim()));

    const initialResults: PollResult[] = rawOptions.map((opt) => ({
      option: opt,
      count: 0,
      percentage: 0,
    }));

    const { embed, row } = buildPollEmbed(question, initialResults, interaction.user.id);

    const reply = await interaction.reply({
      embeds: [embed],
      components: [row],
      fetchReply: true,
    });

    await utilityService.createPoll(
      reply.id,
      interaction.channelId,
      interaction.guildId,
      question,
      rawOptions,
      interaction.user.id
    );
  },
};

export async function handlePollInteraction(interaction: ButtonInteraction) {
  if (!interaction.customId.startsWith("poll_vote_")) return;

  const optionIndex = parseInt(interaction.customId.replace("poll_vote_", ""), 10);
  if (isNaN(optionIndex)) return;

  const voteResult = await utilityService.votePoll(
    interaction.message.id,
    interaction.user.id,
    optionIndex
  );

  if (!voteResult) {
    await interaction.reply({ content: "❌ This poll is no longer active.", ephemeral: true });
    return;
  }

  const results = utilityService.calculatePollResults(voteResult.options, voteResult.votes);
  const { embed, row } = buildPollEmbed(voteResult.poll.question, results, voteResult.poll.creatorId);

  await interaction.update({
    embeds: [embed],
    components: [row],
  });
}
