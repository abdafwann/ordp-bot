import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  AutocompleteInteraction,
  EmbedBuilder,
  MessageFlags,
} from "discord.js";
import { Command } from "../../../types/command.js";
import { profitService } from "../profit.service.js";
import { formatWl } from "../domain/rate.js";

export const cookCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("cook")
    .setDescription("Calculate cooking profit for a Growtopia dish")
    .addStringOption((opt) =>
      opt
        .setName("dish")
        .setDescription("Dish to cook")
        .setRequired(true)
        .setAutocomplete(true)
    )
    .addStringOption((opt) =>
      opt
        .setName("sell")
        .setDescription("Selling rate (e.g. 1/3, 5/2, 2/1dl, or 3wl)")
        .setRequired(false)
    )
    .addIntegerOption((opt) =>
      opt
        .setName("qty")
        .setDescription("Quantity to cook (default: 1)")
        .setMinValue(1)
        .setMaxValue(100000)
        .setRequired(false)
    )
    .addBooleanOption((opt) =>
      opt
        .setName("include-spices")
        .setDescription("Include all optional spices in calculation (default: false)")
        .setRequired(false)
    )
    .addStringOption((opt) =>
      opt
        .setName("overrides")
        .setDescription("Inline overrides (e.g. dough:free, tomato:200/120, pepper:skip)")
        .setRequired(false)
    ),

  async autocomplete(interaction: AutocompleteInteraction) {
    const focused = interaction.options.getFocused();
    const matches = profitService.searchRecipes(focused, 25);
    await interaction.respond(
      matches.map((r) => ({ name: r.name, value: r.name }))
    );
  },

  async execute(interaction: ChatInputCommandInteraction) {
    if (!interaction.guildId) {
      await interaction.reply({
        content: "❌ This command can only be used in a server.",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    const dishName = interaction.options.getString("dish", true);
    const sellRateStr = interaction.options.getString("sell") || undefined;
    const quantity = interaction.options.getInteger("qty") || 1;
    const includeSpices = interaction.options.getBoolean("include-spices") || false;
    const overridesStr = interaction.options.getString("overrides") || undefined;

    try {
      const result = await profitService.cook({
        guildId: interaction.guildId,
        dishName,
        sellRateStr,
        quantity,
        includeSpices,
        overridesStr,
      });

      if (result.status === "missing_prices") {
        const missingList = result.missing.map((m) => `• **${m}**`).join("\n");
        const commandsList = result.suggestedCommands.map((c) => `\`${c}\``).join("\n");

        await interaction.reply({
          content:
            `⚠️ Missing prices for the following ingredients in **${result.recipe.name}**:\n` +
            `${missingList}\n\n` +
            `Set them using:\n${commandsList}\n\n` +
            `*Or pass an inline override, e.g.* \`/cook dish:${dishName} overrides:${result.missing[0].toLowerCase()}:200/150\``,
          flags: MessageFlags.Ephemeral,
        });
        return;
      }

      const { recipe, profit } = result;

      // Color coding
      let color = 0x3498db; // blue (neutral, no selling rate provided)
      if (profit.profitPerMasakanWl !== null) {
        color = profit.profitPerMasakanWl >= 0 ? 0x2ecc71 : 0xe74c3c;
      }

      // Breakdown table
      const header = "Item        Qty  Rate        Unit (WL)   Cost (WL)";
      const divider = "-------------------------------------------------";
      const rows = profit.breakdown.map((b) => {
        const namePad = b.name.slice(0, 10).padEnd(10, " ");
        const qtyPad = `${b.quantity}x`.padStart(4, " ");
        const rateStr = b.isFree
          ? "FREE"
          : b.rate
          ? `${b.rate.items}/${b.rate.wl}`
          : "N/A";
        const ratePad = rateStr.padEnd(11, " ");
        const unitPad = formatWl(b.unitCostWl, 4).padStart(10, " ");
        const totalPad = formatWl(b.totalCostWl, 4).padStart(11, " ");
        return `${namePad} ${qtyPad}  ${ratePad} ${unitPad} ${totalPad}`;
      });

      const modalSummary =
        `Modal per Dish: ${formatWl(profit.modalPerMasakanWl, 4)} WL\n` +
        (quantity > 1 ? `Total Modal (x${quantity}): ${formatWl(profit.totalModalWl, 4)} WL` : "");

      const breakdownField = "```text\n" + [header, divider, ...rows, divider, modalSummary].join("\n") + "\n```";

      const embed = new EmbedBuilder()
        .setTitle(`🍳 Cooking Profit: ${recipe.name} (x${quantity})`)
        .setColor(color)
        .addFields({ name: "Ingredient Breakdown", value: breakdownField });

      if (profit.sellPricePerMasakanWl !== null && profit.profitPerMasakanWl !== null) {
        const profitEmoji = profit.profitPerMasakanWl >= 0 ? "📈" : "📉";
        const sign = profit.profitPerMasakanWl >= 0 ? "+" : "";

        let saleSummary =
          `Selling Price: ${formatWl(profit.sellPricePerMasakanWl, 4)} WL/dish\n` +
          (quantity > 1 ? `Total Revenue: ${formatWl(profit.totalRevenueWl || 0, 4)} WL\n` : "") +
          `Net Profit: ${sign}${formatWl(profit.totalProfitWl || 0, 4)} WL ${profitEmoji}\n`;

        if (profit.marginPercent !== null && profit.roiPercent !== null) {
          saleSummary += `Margin: ${formatWl(profit.marginPercent, 2)}%  |  ROI: ${formatWl(profit.roiPercent, 2)}%`;
        }

        embed.addFields({ name: "Sale & Profit", value: saleSummary });
      } else {
        embed.addFields({
          name: "Profit Estimate",
          value: "*Add a selling rate (e.g. `sell:1/3` or `sell:2/1dl`) to compute net profit, margin %, and ROI %.*",
        });
      }

      embed.setFooter({
        text: `Heat: ${recipe.heatLevel} | Punch: ${recipe.punchTiming}${recipe.foodBuff ? ` | Buff: ${recipe.foodBuff}` : ""}`,
      });

      if (recipe.outputSpriteUrl) {
        embed.setThumbnail(recipe.outputSpriteUrl);
      }

      await interaction.reply({ embeds: [embed] });
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "An error occurred while calculating cooking profit.";
      await interaction.reply({
        content: `❌ ${message}`,
        flags: MessageFlags.Ephemeral,
      });
    }
  },
};
