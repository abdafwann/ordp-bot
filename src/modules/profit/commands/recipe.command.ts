import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  AutocompleteInteraction,
  EmbedBuilder,
  MessageFlags,
} from "discord.js";
import { Command } from "../../../types/command.js";
import { recipeRepository } from "../data/recipe.repository.js";
import { formatIngredientQuantity } from "../domain/quantity.js";

export const recipeCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("recipe")
    .setDescription("View cooking recipes, ingredient timings, and food buffs")
    .addSubcommand((sub) =>
      sub
        .setName("view")
        .setDescription("View recipe details and cooking steps")
        .addStringOption((opt) =>
          opt
            .setName("dish")
            .setDescription("Name of the dish to view")
            .setRequired(true)
            .setAutocomplete(true)
        )
    )
    .addSubcommand((sub) =>
      sub.setName("list").setDescription("List all available cooking recipes")
    ),

  async autocomplete(interaction: AutocompleteInteraction) {
    const focused = interaction.options.getFocused();
    const matches = recipeRepository.search(focused, 25);
    await interaction.respond(
      matches.map((r) => ({ name: r.name, value: r.name }))
    );
  },

  async execute(interaction: ChatInputCommandInteraction) {
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === "list") {
      const all = recipeRepository.getAll();
      const lines = all.map(
        (r) => `• **${r.name}** (${r.heatLevel} Heat, Punch: \`${r.punchTiming}\`)`
      );

      const embed = new EmbedBuilder()
        .setTitle("📖 Cooking Recipe Book")
        .setColor(0xf39c12)
        .setDescription(lines.join("\n"))
        .setFooter({ text: "Use /recipe view <dish> to see ingredients and timings." });

      await interaction.reply({ embeds: [embed] });
      return;
    }

    if (subcommand === "view") {
      const dish = interaction.options.getString("dish", true);
      const recipe = recipeRepository.findByName(dish);

      if (!recipe) {
        await interaction.reply({
          content: `❌ Recipe "${dish}" was not found. Use autocomplete or check \`/recipe list\`.`,
          flags: MessageFlags.Ephemeral,
        });
        return;
      }

      const ingredientLines = recipe.ingredients.map((ing) => {
        const badge = ing.requirement === "optional" ? " *(Optional Spice)*" : "";
        const qty = formatIngredientQuantity(ing);
        return `• **${qty}x ${ing.name}** @ \`${ing.timing}\`${badge}`;
      });

      const embed = new EmbedBuilder()
        .setTitle(`🍳 ${recipe.name}`)
        .setColor(0xf1c40f)
        .setDescription(
          `**Heat Level:** ${recipe.heatLevel}\n` +
          `**Punch Timing:** \`${recipe.punchTiming}\`\n` +
          (recipe.foodBuff ? `**Food Buff:** ${recipe.foodBuff}\n` : "") +
          (recipe.sourceUrl ? `**Wiki:** [Guide:Cooking](${recipe.sourceUrl})\n` : "")
        )
        .addFields({
          name: "Ingredients & Timing",
          value: ingredientLines.join("\n"),
        });

      if (recipe.outputSpriteUrl) {
        embed.setThumbnail(recipe.outputSpriteUrl);
      }

      await interaction.reply({ embeds: [embed] });
    }
  },
};
