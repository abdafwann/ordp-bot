import { describe, it, expect, vi, beforeEach } from "vitest";
import { AutocompleteInteraction, ButtonInteraction } from "discord.js";
import { ExtendedClient } from "../../src/core/client.js";
import { registerInteractionCreateEvent } from "../../src/events/interactionCreate.event.js";

vi.mock("../../src/modules/moderation/commands/ticket.command.js", () => ({
  handleTicketInteraction: vi.fn(async () => undefined),
}));
vi.mock("../../src/modules/moderation/commands/automod.command.js", () => ({
  handleAutoModInteraction: vi.fn(async () => undefined),
}));
vi.mock("../../src/modules/community/commands/poll.command.js", () => ({
  handlePollInteraction: vi.fn(async () => undefined),
}));
vi.mock("../../src/modules/profit/interactions/cook.interactions.js", () => ({
  handleCookButton: vi.fn(async () => undefined),
  handleCookModalSubmit: vi.fn(async () => undefined),
  isCookButtonCustomId: (id: string) => id.startsWith("cook:"),
  isCookModalCustomId: (id: string) => id.startsWith("cook-modal:"),
}));

import { handleTicketInteraction } from "../../src/modules/moderation/commands/ticket.command.js";
import { handleCookButton } from "../../src/modules/profit/interactions/cook.interactions.js";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("Autocomplete Interaction Dispatch", () => {
  it("should dispatch autocomplete interaction to command.autocomplete if present", async () => {
    const client = new ExtendedClient();
    const autocompleteMock = vi.fn().mockResolvedValue(undefined);

    client.commands.set("testcmd", {
      data: {} as any,
      execute: vi.fn(),
      autocomplete: autocompleteMock,
    });

    registerInteractionCreateEvent(client);

    const mockInteraction = {
      isChatInputCommand: () => false,
      isButton: () => false,
      isAutocomplete: () => true,
      commandName: "testcmd",
    } as unknown as AutocompleteInteraction;

    client.emit("interactionCreate", mockInteraction);

    expect(autocompleteMock).toHaveBeenCalledWith(mockInteraction);
  });

  it("routes cook buttons before the ticket fallback", async () => {
    const client = new ExtendedClient();
    registerInteractionCreateEvent(client);

    const mockInteraction = {
      isChatInputCommand: () => false,
      isAutocomplete: () => false,
      isModalSubmit: () => false,
      isButton: () => true,
      customId: "cook:calc:abc123:0",
    } as unknown as ButtonInteraction;

    client.emit("interactionCreate", mockInteraction);
    await new Promise((resolve) => setImmediate(resolve));

    expect(handleCookButton).toHaveBeenCalledWith(mockInteraction);
    expect(handleTicketInteraction).not.toHaveBeenCalled();
  });

  it("still routes non-cook buttons to the ticket fallback", async () => {
    const client = new ExtendedClient();
    registerInteractionCreateEvent(client);

    const mockInteraction = {
      isChatInputCommand: () => false,
      isAutocomplete: () => false,
      isModalSubmit: () => false,
      isButton: () => true,
      customId: "mystery_button",
    } as unknown as ButtonInteraction;

    client.emit("interactionCreate", mockInteraction);
    await new Promise((resolve) => setImmediate(resolve));

    expect(handleCookButton).not.toHaveBeenCalled();
    expect(handleTicketInteraction).toHaveBeenCalledWith(mockInteraction);
  });
});
