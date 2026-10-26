import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  AutocompleteInteraction,
  EmbedBuilder,
  MessageFlags,
  PermissionFlagsBits,
} from "discord.js";
import { Command } from "../../../types/command.js";
import { profitService } from "../profit.service.js";

export const pricesCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("prices")
    .setDescription("Manage server-shared ingredient market prices for cooking")
    .addSubcommand((sub) =>
      sub
        .setName("set")
        .setDescription("Set the market price for an ingredient")
        .addStringOption((opt) =>
          opt
            .setName("ingredient")
            .setDescription("Ingredient name")
            .setRequired(true)
            .setAutocomplete(true)
        )
        .addStringOption((opt) =>
          opt
            .setName("rate")
            .setDescription("Price rate, e.g. 200/150, 2/1dl, 3dl, or free")
            .setRequired(true)
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName("list")
        .setDescription("List all stored ingredient prices in this server")
    )
    .addSubcommand((sub) =>
      sub
        .setName("remove")
        .setDescription("Remove a stored ingredient price")
        .addStringOption((opt) =>
          opt
            .setName("ingredient")
            .setDescription("Ingredient name to delete")
            .setRequired(true)
            .setAutocomplete(true)
        )
    ),

  async autocomplete(interaction: AutocompleteInteraction) {
    const focused = interaction.options.getFocused().toLowerCase().trim();
    const names = profitService.getAllIngredientNames();
    const filtered = names
      .filter((n) => n.toLowerCase().includes(focused))
      .slice(0, 25)
      .map((n) => ({ name: n, value: n }));

    await interaction.respond(filtered);
  },

  async execute(interaction: ChatInputCommandInteraction) {
    if (!interaction.guildId) {
      await interaction.reply({
        content: "❌ This command can only be used in a server.",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    const subcommand = interaction.options.getSubcommand();

    if (subcommand === "set") {
      if (!interaction.memberPermissions?.has(PermissionFlagsBits.ManageGuild)) {
        await interaction.reply({
          content: "❌ You need the **Manage Server** permission to update ingredient prices.",
          flags: MessageFlags.Ephemeral,
        });
        return;
      }

      const ingredient = interaction.options.getString("ingredient", true);
      const rateStr = interaction.options.getString("rate", true);

      try {
        const saved = await profitService.setPrice(
          interaction.guildId,
          ingredient,
          rateStr,
          interaction.user.id
        );

        await interaction.reply({
          content: `✅ Stored price for **${saved.name}**: \`${saved.items}/${saved.wl} ${saved.currency}\``,
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : "Invalid rate format.";
        await interaction.reply({
          content: `❌ ${message}`,
          flags: MessageFlags.Ephemeral,
        });
      }
      return;
    }

    if (subcommand === "remove") {
      if (!interaction.memberPermissions?.has(PermissionFlagsBits.ManageGuild)) {
        await interaction.reply({
          content: "❌ You need the **Manage Server** permission to remove ingredient prices.",
          flags: MessageFlags.Ephemeral,
        });
        return;
      }

      const ingredient = interaction.options.getString("ingredient", true);
      const removed = await profitService.removePrice(interaction.guildId, ingredient);

      if (removed) {
        await interaction.reply({
          content: `🗑️ Removed stored price for **${ingredient.toLowerCase()}**.`,
        });
      } else {
        await interaction.reply({
          content: `⚠️ No stored price found for **${ingredient.toLowerCase()}**.`,
          flags: MessageFlags.Ephemeral,
        });
      }
      return;
    }

    if (subcommand === "list") {
      const prices = await profitService.listPrices(interaction.guildId);
      if (prices.length === 0) {
        await interaction.reply({
          content:
            "ℹ️ No ingredient prices have been set in this server yet. Set one with `/prices set`.",
          flags: MessageFlags.Ephemeral,
        });
        return;
      }

      const lines = prices.map(
        (p) => `• **${p.name}**: \`${p.items}/${p.wl} ${p.currency}\``
      );

      const embed = new EmbedBuilder()
        .setTitle("🛒 Server Ingredient Prices")
        .setColor(0x3498db)
        .setDescription(lines.join("\n"))
        .setFooter({ text: `Total: ${prices.length} ingredients recorded` });

      await interaction.reply({ embeds: [embed] });
    }
  },
};
