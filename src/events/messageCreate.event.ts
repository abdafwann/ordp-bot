import { Events, Message, ChannelType, PermissionFlagsBits } from "discord.js";
import { ExtendedClient } from "../core/client.js";
import { levelingService } from "../modules/community/leveling.service.js";
import { aiService } from "../modules/ai/ai.service.js";
import { autoModService } from "../modules/moderation/automod.service.js";
import { env } from "../config/env.js";

export function registerMessageCreateEvent(client: ExtendedClient) {
  client.on(Events.MessageCreate, async (message: Message) => {
    // Ignore bots
    if (message.author.bot) return;

    const guildId = message.guildId || "dm";

    // 0. Auto-Mod & Spam Protection (Non-admins only)
    if (message.guild && message.member) {
      const isAdmin =
        message.member.permissions.has(PermissionFlagsBits.Administrator) ||
        message.member.permissions.has(PermissionFlagsBits.ManageGuild);

      if (!isAdmin) {
        try {
          const config = await autoModService.getGuildConfig(message.guild.id);
          const blockedWords = await autoModService.getBlockedWords(message.guild.id);

          let violation: string | null = null;

          // Check custom blocked words
          const foundWord = autoModService.findBlockedWord(message.content, blockedWords);
          if (foundWord) {
            violation = `Blocked word detected`;
          }

          // Check Discord invite links
          if (!violation && config.antiInvite && autoModService.isInvite(message.content)) {
            violation = "Discord invite links are not allowed";
          }

          // Check general external links
          if (!violation && config.antiLinks && autoModService.hasLinks(message.content)) {
            violation = "External links are not allowed";
          }

          // Check mass mentions
          if (
            !violation &&
            config.maxMentions > 0 &&
            autoModService.isMassMention(message.mentions.users.size, config.maxMentions)
          ) {
            violation = `Mass mentions exceeded (max: ${config.maxMentions})`;
          }

          // Check anti-spam rate limiting (5 messages in 10 seconds)
          if (
            !violation &&
            config.antiSpam &&
            autoModService.checkRateLimit(message.guild.id, message.author.id, 5, 10000)
          ) {
            violation = "Spamming messages too quickly";
          }

          if (violation) {
            await message.delete().catch(() => null);
            if ("send" in message.channel) {
              const warn = await message.channel
                .send({
                  content: `⚠️ <@${message.author.id}>, your message was deleted: **${violation}**.`,
                })
                .catch(() => null);

              if (warn) {
                setTimeout(() => warn.delete().catch(() => null), 5000);
              }
            }
            return;
          }
        } catch (err) {
          console.error("[AutoMod Error]", err);
        }
      }
    }

    // 1. Process XP Leveling
    if (message.guild && "send" in message.channel) {
      try {
        const xpResult = await levelingService.addMessageXp(guildId, message.author.id);
        if (xpResult.levelUp) {
          await message.channel.send({
            content: `🎉 Congratulations <@${message.author.id}>, you reached **Level ${xpResult.newLevel}**!`,
          });
        }
      } catch (err) {
        console.error("[Leveling Event Error]", err);
      }
    }

    // 2. AI Chat (Triggered via Dedicated AI Channel OR @Bot Mention)
    const botMention = `<@${client.user?.id}>`;
    const botNickMention = `<@!${client.user?.id}>`;
    const isAiChannel = Boolean(env.AI_CHANNEL_ID && message.channelId === env.AI_CHANNEL_ID);
    const isMentioned =
      message.content.startsWith(botMention) || message.content.startsWith(botNickMention);

    if (isAiChannel || isMentioned) {
      const cleanPrompt = message.content
        .replace(botMention, "")
        .replace(botNickMention, "")
        .trim();

      if (!cleanPrompt) {
        await message.reply("Hey there! How can I help you today? You can ask me anything.");
        return;
      }

      if (message.channel.isTextBased() && "send" in message.channel) {
        if ("sendTyping" in message.channel) {
          await message.channel.sendTyping();
        }

        try {
          const reply = await aiService.generateReply(
            guildId,
            message.channelId,
            message.author.id,
            cleanPrompt
          );

          if (reply.length > 2000) {
            const chunks = reply.match(/[\s\S]{1,1900}/g) || [reply];
            await message.reply(chunks[0]);
            for (let i = 1; i < chunks.length; i++) {
              await message.channel.send(chunks[i]);
            }
          } else {
            await message.reply(reply);
          }
        } catch (error) {
          console.error("[AI Chat Error]", error);
          await message.reply("Sorry, I had trouble generating a reply.");
        }
      }
    }
  });
}
