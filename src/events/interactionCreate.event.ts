import { Events, Interaction, MessageFlags, type InteractionReplyOptions } from "discord.js";
import { ExtendedClient } from "../core/client.js";
import { handleTicketInteraction } from "../modules/moderation/commands/ticket.command.js";
import { handleAutoModInteraction } from "../modules/moderation/commands/automod.command.js";
import { handlePollInteraction } from "../modules/community/commands/poll.command.js";
import {
  handleCookButton,
  handleCookModalSubmit,
  isCookButtonCustomId,
  isCookModalCustomId,
} from "../modules/profit/interactions/cook.interactions.js";

export function registerInteractionCreateEvent(client: ExtendedClient) {
  client.on(Events.InteractionCreate, async (interaction: Interaction) => {
    if (interaction.isAutocomplete()) {
      const command = client.commands.get(interaction.commandName);
      if (command?.autocomplete) {
        await command.autocomplete(interaction).catch(() => null);
      }
      return;
    }

    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) {
        console.error(`Command not found: ${interaction.commandName}`);
        return;
      }

      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(`Error executing command ${interaction.commandName}:`, error);
        const replyPayload: InteractionReplyOptions = {
          content: "❌ An error occurred while executing this command.",
          flags: MessageFlags.Ephemeral,
        };
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp(replyPayload).catch(() => null);
        } else {
          await interaction.reply(replyPayload).catch(() => null);
        }
      }
      return;
    }

    if (interaction.isModalSubmit()) {
      if (isCookModalCustomId(interaction.customId)) {
        await handleCookModalSubmit(interaction).catch((err) => {
          console.error("Cook modal interaction error:", err);
        });
        return;
      }
    }

    if (interaction.isButton()) {
      if (isCookButtonCustomId(interaction.customId)) {
        await handleCookButton(interaction).catch((err) => {
          console.error("Cook button interaction error:", err);
        });
        return;
      }

      if (interaction.customId.startsWith("poll_vote_")) {
        await handlePollInteraction(interaction).catch((err) => {
          console.error("Poll button interaction error:", err);
        });
        return;
      }

      if (interaction.customId.startsWith("automod_")) {
        await handleAutoModInteraction(interaction).catch((err) => {
          console.error("AutoMod button interaction error:", err);
        });
        return;
      }

      await handleTicketInteraction(interaction).catch((err) => {
        console.error("Button interaction error:", err);
      });
    }
  });
}
