import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { Command } from "../../../types/command.js";
import { economyService } from "../economy.service.js";

export const dailyCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("daily")
    .setDescription("Claim your daily 100 free coins"),

  async execute(interaction) {
    const guildId = interaction.guildId || "dm";
    const result = await economyService.claimDaily(guildId, interaction.user.id);

    if (!result.success && result.remainingMs) {
      const hours = Math.floor(result.remainingMs / (1000 * 60 * 60));
      const minutes = Math.floor((result.remainingMs % (1000 * 60 * 60)) / (1000 * 60));
      await interaction.reply({
        content: `⏳ You have already claimed your daily reward! Please wait **${hours}h ${minutes}m** before claiming again.`,
        ephemeral: true,
      });
      return;
    }

    await interaction.reply({
      content: `🎉 You claimed your daily reward of **100 coins**! Your new balance is **${result.newBalance} coins**.`,
    });
  },
};

export const balanceCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("balance")
    .setDescription("Check coin balance")
    .addUserOption((option) =>
      option.setName("user").setDescription("The user whose balance to check").setRequired(false)
    ),

  async execute(interaction) {
    const target = interaction.options.getUser("user") || interaction.user;
    const guildId = interaction.guildId || "dm";
    const balance = await economyService.getBalance(guildId, target.id);

    const embed = new EmbedBuilder()
      .setColor(0x2ecc71)
      .setTitle(`💰 Coin Balance`)
      .setDescription(`**${target.username}** has **${balance} coins**.`)
      .setThumbnail(target.displayAvatarURL());

    await interaction.reply({ embeds: [embed] });
  },
};

export const coinflipCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("coinflip")
    .setDescription("Gamble your coins on a coinflip")
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("Amount of coins to bet")
        .setMinValue(1)
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("choice")
        .setDescription("Heads or Tails")
        .setRequired(true)
        .addChoices(
          { name: "Heads", value: "heads" },
          { name: "Tails", value: "tails" }
        )
    ),

  async execute(interaction) {
    const amount = interaction.options.getInteger("amount", true);
    const choice = interaction.options.getString("choice", true) as "heads" | "tails";
    const guildId = interaction.guildId || "dm";

    const result = await economyService.coinflip(guildId, interaction.user.id, amount, choice);

    if (!result.success) {
      await interaction.reply({ content: `❌ ${result.error}`, ephemeral: true });
      return;
    }

    const message = result.won
      ? `🪙 The coin landed on **${result.outcome}**! You won **+${amount} coins**! New balance: **${result.newBalance}**.`
      : `🪙 The coin landed on **${result.outcome}**! You lost **-${amount} coins**. New balance: **${result.newBalance}**.`;

    await interaction.reply({ content: message });
  },
};

export const payCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("pay")
    .setDescription("Transfer coins to another user")
    .addUserOption((option) =>
      option.setName("user").setDescription("The user to send coins to").setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("Amount of coins to transfer")
        .setMinValue(1)
        .setRequired(true)
    ),

  async execute(interaction) {
    const target = interaction.options.getUser("user", true);
    const amount = interaction.options.getInteger("amount", true);
    const guildId = interaction.guildId || "dm";

    if (target.bot) {
      await interaction.reply({ content: "❌ You cannot send coins to a bot.", ephemeral: true });
      return;
    }

    const result = await economyService.transfer(
      guildId,
      interaction.user.id,
      target.id,
      amount
    );

    if (!result.success) {
      await interaction.reply({ content: `❌ ${result.error}`, ephemeral: true });
      return;
    }

    await interaction.reply({
      content: `💸 Successfully transferred **${amount} coins** to <@${target.id}>!`,
    });
  },
};
