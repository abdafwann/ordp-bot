import { describe, it, expect, vi } from "vitest";
import { AutocompleteInteraction } from "discord.js";
import { ExtendedClient } from "../../src/core/client.js";
import { registerInteractionCreateEvent } from "../../src/events/interactionCreate.event.js";

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
});
