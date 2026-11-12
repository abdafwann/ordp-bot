import { Client, EmbedBuilder } from "discord.js";
import { env } from "../../config/env.js";

function buildErrorEmbed(title: string, err: unknown): EmbedBuilder {
  const message = err instanceof Error ? err.message : String(err);
  const stack = err instanceof Error && err.stack ? err.stack : undefined;

  const truncated =
    stack && stack.length > 2000 ? `${stack.slice(0, 2000)}…` : stack;

  const embed = new EmbedBuilder()
    .setColor(0xda3633)
    .setTitle(title)
    .setDescription(`\`\`\`\n${message}\n\`\`\``)
    .setTimestamp();

  if (truncated) {
    embed.addFields({ name: "Stack", value: `\`\`\`\n${truncated}\n\`\`\`` });
  }

  return embed;
}

export async function reportError(client: Client, title: string, err: unknown): Promise<void> {
  console.error(`[Error Reporter] ${title}:`, err);

  if (!env.SYS_ALERTS_CHANNEL_ID) {
    return;
  }

  try {
    const channel = await client.channels.fetch(env.SYS_ALERTS_CHANNEL_ID).catch(() => null);
    if (!channel || !channel.isTextBased() || !("send" in channel)) {
      return;
    }

    const ping = env.BOT_OWNER_ID ? `<@${env.BOT_OWNER_ID}> ` : "";
    await channel.send({ content: ping, embeds: [buildErrorEmbed(title, err)] }).catch(() => null);
  } catch (err) {
    console.error("[Error Reporter] Failed to send error to alerts channel:", err);
  }
}
