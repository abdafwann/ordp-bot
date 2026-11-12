import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  AutocompleteInteraction,
} from "discord.js";
import { Command } from "../../../types/command.js";
import { profitService } from "../profit.service.js";
import { executeCookCommand } from "../interactions/cook.interactions.js";

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
        .setDescription("Initial selling rate (e.g. 1/3, 5/2, 2/1dl, or 3wl)")
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
    ),

  async autocomplete(interaction: AutocompleteInteraction) {
    const focused = interaction.options.getFocused();
    const matches = profitService.searchRecipes(focused, 25);
    await interaction.respond(
      matches.map((r) => ({ name: r.name, value: r.name }))
    );
  },

  async execute(interaction: ChatInputCommandInteraction) {
    await executeCookCommand(interaction);
  },
};
