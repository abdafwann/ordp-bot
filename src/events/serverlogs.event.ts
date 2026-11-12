import { Events, EmbedBuilder, GuildMember, PartialGuildMember, Message, PartialMessage } from "discord.js";
import { ExtendedClient } from "../core/client.js";
import { reportServerEvent } from "../modules/serverlogs/serverlogs.service.js";

const GREEN = 0x238636;
const RED = 0xda3633;
const ORANGE = 0xe67e22;
const BLUE = 0x1f6feb;

function memberTag(member: GuildMember | PartialGuildMember): string {
  return `${member.user?.tag ?? "unknown"} (\`${member.id}\`)`;
}

export function registerServerLogsEvents(client: ExtendedClient) {
  // Member joins
  client.on(Events.GuildMemberAdd, (member) => {
    const embed = new EmbedBuilder()
      .setColor(GREEN)
      .setTitle("👋 Member Joined")
      .setDescription(memberTag(member))
      .setFooter({ text: `ID: ${member.id}` })
      .setTimestamp();
    void reportServerEvent(client, embed);
  });

  // Member leaves (or is kicked/banned — both fire guildMemberRemove)
  client.on(Events.GuildMemberRemove, (member) => {
    const embed = new EmbedBuilder()
      .setColor(RED)
      .setTitle("👋 Member Left")
      .setDescription(memberTag(member))
      .setFooter({ text: `ID: ${member.id}` })
      .setTimestamp();
    void reportServerEvent(client, embed);
  });

  // Role changes
  client.on(Events.GuildMemberUpdate, (oldMember, newMember) => {
    const added = newMember.roles.cache.filter((r) => !oldMember.roles.cache.has(r.id));
    const removed = oldMember.roles.cache.filter((r) => !newMember.roles.cache.has(r.id));

    if (added.size === 0 && removed.size === 0) {
      return;
    }

    const lines: string[] = [];
    for (const role of added.values()) {
      lines.push(`➕ Added role **${role.name}**`);
    }
    for (const role of removed.values()) {
      lines.push(`➖ Removed role **${role.name}**`);
    }

    const embed = new EmbedBuilder()
      .setColor(BLUE)
      .setTitle("🔄 Roles Updated")
      .setDescription(`${memberTag(newMember)}\n\n${lines.join("\n")}`)
      .setTimestamp();
    void reportServerEvent(client, embed);
  });

  // Message deleted
  client.on(Events.MessageDelete, (message: Message | PartialMessage) => {
    if (message.author?.bot) return;

    const content = message.content?.slice(0, 1000) || "*no content*";
    const embed = new EmbedBuilder()
      .setColor(RED)
      .setTitle("🗑️ Message Deleted")
      .setDescription(
        `**Author:** ${message.author?.tag ?? "unknown"}\n**Channel:** <#${message.channelId}>\n**Content:** ${content}`
      )
      .setTimestamp();
    void reportServerEvent(client, embed);
  });

  // Message edited
  client.on(Events.MessageUpdate, (oldMessage: Message | PartialMessage, newMessage: Message | PartialMessage) => {
    if (oldMessage.author?.bot) return;
    if (oldMessage.content === newMessage.content) return;

    const before = oldMessage.content?.slice(0, 500) || "*no content*";
    const after = newMessage.content?.slice(0, 500) || "*no content*";

    const embed = new EmbedBuilder()
      .setColor(ORANGE)
      .setTitle("✏️ Message Edited")
      .setDescription(
        `**Author:** ${oldMessage.author?.tag ?? "unknown"}\n**Channel:** <#${oldMessage.channelId}>`
      )
      .addFields(
        { name: "Before", value: before },
        { name: "After", value: after }
      )
      .setTimestamp();
    void reportServerEvent(client, embed);
  });
}
