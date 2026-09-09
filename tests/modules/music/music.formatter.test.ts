import { describe, it, expect } from "vitest";
import {
  formatDuration,
  createNowPlayingEmbed,
  createAddedToQueueEmbed,
  createQueueEmbed,
  createSearchResultSelectMenu,
  createSearchResultEmbed,
} from "../../../src/modules/music/music.formatter.js";
import type { Track, SearchResult } from "../../../src/modules/music/types.js";

describe("Music Formatter", () => {
  describe("formatDuration", () => {
    it("should format 0 seconds to 00:00", () => {
      expect(formatDuration(0)).toBe("00:00");
    });

    it("should format 65 seconds to 01:05", () => {
      expect(formatDuration(65)).toBe("01:05");
    });

    it("should format 3665 seconds to 01:01:05", () => {
      expect(formatDuration(3665)).toBe("01:01:05");
    });
  });

  describe("createNowPlayingEmbed", () => {
    const mockTrack: Track = {
      title: "Test Track Title",
      url: "https://www.youtube.com/watch?v=test1234",
      duration: "03:45",
      durationInSec: 225,
      thumbnail: "https://example.com/thumb.jpg",
      requestedBy: "TestUser",
      requestedById: "1234567890",
    };

    it("should create a rich embed for the currently playing track", () => {
      const embed = createNowPlayingEmbed(mockTrack);
      expect(embed.data.title).toContain("Now Playing");
      expect(embed.data.description).toContain(mockTrack.title);
      expect(embed.data.description).toContain(mockTrack.url);
      expect(embed.data.thumbnail?.url).toBe(mockTrack.thumbnail);
      expect(embed.data.color).toBe(0x5865f2);

      const fields = embed.data.fields ?? [];
      const durationField = fields.find((f) => f.name.toLowerCase().includes("duration"));
      const requesterField = fields.find((f) => f.name.toLowerCase().includes("requested by"));

      expect(durationField?.value).toBe("03:45");
      expect(requesterField?.value).toContain("TestUser");
    });
  });

  describe("createAddedToQueueEmbed", () => {
    const mockTrack: Track = {
      title: "Another Song",
      url: "https://www.youtube.com/watch?v=another1234",
      duration: "04:20",
      durationInSec: 260,
      thumbnail: "https://example.com/thumb2.jpg",
      requestedBy: "TestUser",
      requestedById: "1234567890",
    };

    it("should create an embed showing track added to queue with position", () => {
      const embed = createAddedToQueueEmbed(mockTrack, 2);
      expect(embed.data.title).toContain("Added to Queue");
      expect(embed.data.description).toContain(mockTrack.title);
      expect(embed.data.description).toContain(mockTrack.url);

      const fields = embed.data.fields ?? [];
      const positionField = fields.find((f) => f.name.toLowerCase().includes("position"));
      const durationField = fields.find((f) => f.name.toLowerCase().includes("duration"));

      expect(positionField?.value).toBe("2");
      expect(durationField?.value).toBe("04:20");
    });
  });

  describe("createQueueEmbed", () => {
    const currentTrack: Track = {
      title: "Current Playing Song",
      url: "https://www.youtube.com/watch?v=current1",
      duration: "02:30",
      durationInSec: 150,
      requestedBy: "Alice",
      requestedById: "111",
    };

    const upcomingTracks: Track[] = Array.from({ length: 15 }, (_, i) => ({
      title: `Queue Track ${i + 1}`,
      url: `https://www.youtube.com/watch?v=track${i + 1}`,
      duration: "03:00",
      durationInSec: 180,
      requestedBy: `User${i + 1}`,
      requestedById: `id_${i + 1}`,
    }));

    it("should handle empty queue when current is null and no tracks", () => {
      const embed = createQueueEmbed(null, []);
      expect(embed.data.title).toContain("Music Queue");
      expect(embed.data.description).toContain("Queue is empty");
    });

    it("should display current track and paginated upcoming tracks (page 1: 1-10)", () => {
      const embed = createQueueEmbed(currentTrack, upcomingTracks, 1);
      expect(embed.data.title).toContain("Music Queue");
      expect(embed.data.description).toContain("Current Playing Song");
      expect(embed.data.description).toContain("1. [Queue Track 1]");
      expect(embed.data.description).toContain("10. [Queue Track 10]");
      expect(embed.data.description).not.toContain("11. [Queue Track 11]");
      expect(embed.data.footer?.text).toContain("Page 1/2");
    });

    it("should display page 2 upcoming tracks (tracks 11-15)", () => {
      const embed = createQueueEmbed(currentTrack, upcomingTracks, 2);
      expect(embed.data.description).toContain("11. [Queue Track 11]");
      expect(embed.data.description).toContain("15. [Queue Track 15]");
      expect(embed.data.description).not.toContain("1. [Queue Track 1]");
      expect(embed.data.footer?.text).toContain("Page 2/2");
    });
  });

  describe("createSearchResultSelectMenu", () => {
    const results: SearchResult[] = [
      {
        title: "A very long track title that exceeds one hundred characters so that we can verify that the select menu properly truncates the label to one hundred characters without throwing discord errors",
        url: "https://www.youtube.com/watch?v=longtitle",
        duration: "05:00",
        durationInSec: 300,
        thumbnail: "https://example.com/thumb.jpg",
      },
      {
        title: "Short Song",
        url: "https://www.youtube.com/watch?v=short",
        duration: "02:15",
        durationInSec: 135,
      },
    ];

    it("should create an action row with a select menu and truncated labels", () => {
      const actionRow = createSearchResultSelectMenu(results, "music_search_select");
      const menu = actionRow.components[0];

      expect(menu.data.custom_id).toBe("music_search_select");
      expect(menu.options).toHaveLength(2);
      expect(menu.options[0].data.label.length).toBeLessThanOrEqual(100);
      expect(menu.options[0].data.value).toBe(results[0].url);
      expect(menu.options[0].data.description).toContain("05:00");
      expect(menu.options[1].data.label).toBe("2. Short Song");
      expect(menu.options[1].data.value).toBe(results[1].url);
    });
  });

  describe("createSearchResultEmbed", () => {
    it("should create rich embed listing all search results", () => {
      const results: SearchResult[] = [
        {
          title: "Result 1",
          url: "https://youtube.com/watch?v=1",
          duration: "03:00",
          durationInSec: 180,
        },
        {
          title: "Result 2",
          url: "https://youtube.com/watch?v=2",
          duration: "04:30",
          durationInSec: 270,
        },
      ];

      const embed = createSearchResultEmbed(results);
      expect(embed.data.title).toBe("🔍 YouTube Search Results");
      expect(embed.data.description).toContain("**1.** [Result 1](https://youtube.com/watch?v=1)");
      expect(embed.data.description).toContain("**2.** [Result 2](https://youtube.com/watch?v=2)");
    });
  });
});
