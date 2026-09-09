import {
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} from "discord.js";
import type { Track, SearchResult } from "./types.js";

const EMBED_COLOR = 0x5865f2;
const PAGE_SIZE = 10;

export function formatDuration(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  const roundedSeconds = Math.floor(seconds);
  const hours = Math.floor(roundedSeconds / 3600);
  const minutes = Math.floor((roundedSeconds % 3600) / 60);
  const secs = roundedSeconds % 60;

  const paddedMinutes = String(minutes).padStart(2, "0");
  const paddedSecs = String(secs).padStart(2, "0");

  if (hours > 0) {
    const paddedHours = String(hours).padStart(2, "0");
    return `${paddedHours}:${paddedMinutes}:${paddedSecs}`;
  }

  return `${paddedMinutes}:${paddedSecs}`;
}

export function createNowPlayingEmbed(track: Track): EmbedBuilder {
  const embed = new EmbedBuilder()
    .setColor(EMBED_COLOR)
    .setTitle("🎶 Now Playing")
    .setDescription(`[${track.title}](${track.url})`)
    .addFields(
      { name: "Duration", value: track.duration, inline: true },
      { name: "Requested By", value: track.requestedBy, inline: true }
    )
    .setTimestamp();

  if (track.thumbnail) {
    embed.setThumbnail(track.thumbnail);
  }

  return embed;
}

export function createAddedToQueueEmbed(track: Track, position: number): EmbedBuilder {
  const embed = new EmbedBuilder()
    .setColor(EMBED_COLOR)
    .setTitle("✅ Added to Queue")
    .setDescription(`[${track.title}](${track.url})`)
    .addFields(
      { name: "Position", value: String(position), inline: true },
      { name: "Duration", value: track.duration, inline: true },
      { name: "Requested By", value: track.requestedBy, inline: true }
    )
    .setTimestamp();

  if (track.thumbnail) {
    embed.setThumbnail(track.thumbnail);
  }

  return embed;
}

export function createQueueEmbed(
  current: Track | null,
  tracks: Track[],
  page: number = 1
): EmbedBuilder {
  const embed = new EmbedBuilder().setColor(EMBED_COLOR).setTitle("📜 Music Queue");

  if (!current && tracks.length === 0) {
    embed.setDescription("Queue is empty. Use `/music play` to add songs!");
    return embed;
  }

  const totalPages = Math.max(1, Math.ceil(tracks.length / PAGE_SIZE));
  const currentPage = Math.min(Math.max(1, page), totalPages);

  const lines: string[] = [];

  if (current) {
    lines.push(`**Now Playing:**\n[${current.title}](${current.url}) | \`${current.duration}\` | Requested by: ${current.requestedBy}\n`);
  }

  if (tracks.length > 0) {
    lines.push(`**Up Next (Page ${currentPage}/${totalPages}):**`);
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const pageTracks = tracks.slice(startIndex, startIndex + PAGE_SIZE);

    pageTracks.forEach((track, index) => {
      const position = startIndex + index + 1;
      lines.push(`${position}. [${track.title}](${track.url}) | \`${track.duration}\` | ${track.requestedBy}`);
    });
  } else {
    lines.push("**Up Next:**\nNo upcoming tracks in queue.");
  }

  embed.setDescription(lines.join("\n"));
  embed.setFooter({
    text: `Page ${currentPage}/${totalPages} • Total tracks: ${tracks.length}`,
  });
  embed.setTimestamp();

  return embed;
}

export function createSearchResultEmbed(results: SearchResult[]): EmbedBuilder {
  const embed = new EmbedBuilder()
    .setColor(EMBED_COLOR)
    .setTitle("🔍 YouTube Search Results")
    .setDescription(
      results
        .map((r, i) => `**${i + 1}.** [${r.title}](${r.url})\n⏱️ \`${r.duration}\``)
        .join("\n\n")
    )
    .setFooter({ text: "Select a song from the dropdown menu below • Expires in 2 minutes" })
    .setTimestamp();

  return embed;
}

export function createSearchResultSelectMenu(
  results: SearchResult[],
  customId: string
): ActionRowBuilder<StringSelectMenuBuilder> {
  const selectMenu = new StringSelectMenuBuilder()
    .setCustomId(customId)
    .setPlaceholder("Choose a song to play...")
    .addOptions(
      results.slice(0, 5).map((res, index) => {
        const option = new StringSelectMenuOptionBuilder()
          .setLabel(`${index + 1}. ${res.title}`.slice(0, 100))
          .setValue(res.url.slice(0, 100))
          .setDescription(`Duration: ${res.duration}`.slice(0, 100));

        return option;
      })
    );

  return new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenu);
}
