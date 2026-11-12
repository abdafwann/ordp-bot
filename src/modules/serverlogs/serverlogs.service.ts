import { Client, EmbedBuilder, TextChannel } from "discord.js";
import { env } from "../../config/env.js";

export async function reportServerEvent(
  client: Client,
  embed: EmbedBuilder
): Promise<void> {
  if (!env.SERVER_LOGS_CHANNEL_ID) {
    return;
  }

  try {
    const channel = await client.channels
      .fetch(env.SERVER_LOGS_CHANNEL_ID)
      .catch(() => null);

    if (!channel || !channel.isTextBased()) {
      return;
    }

    await (channel as TextChannel).send({ embeds: [embed] }).catch(() => null);
  } catch (err) {
    console.error("[Server Logs] Failed to send event:", err);
  }
}
