import { describe, it, expect, vi, beforeEach } from "vitest";
import { cookCommand } from "../../../../src/modules/profit/commands/cook.command.js";
import { profitService } from "../../../../src/modules/profit/profit.service.js";
import { allCommands } from "../../../../src/core/command-loader.js";

vi.mock("../../../../src/modules/profit/profit.service.js", () => {
  return {
    profitService: {
      cook: vi.fn(),
      getRecipe: vi.fn(),
      listPrices: vi.fn().mockResolvedValue([]),
      searchRecipes: vi.fn().mockReturnValue([{ name: "Berry Crepes", id: "berry_crepes" }]),
    },
  };
});

vi.mock("../../../../src/modules/profit/interactions/cook.interactions.js", () => {
  return {
    executeCookCommand: vi.fn(async () => undefined),
    handleCookButton: vi.fn(async () => undefined),
    handleCookModalSubmit: vi.fn(async () => undefined),
    isCookButtonCustomId: (id: string) => id.startsWith("cook:"),
    isCookModalCustomId: (id: string) => id.startsWith("cook-modal:"),
  };
});

import { executeCookCommand } from "../../../../src/modules/profit/interactions/cook.interactions.js";

describe("/cook command", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(profitService.getRecipe).mockReturnValue({
      id: "berry_crepes",
      name: "Berry Crepes",
      heatLevel: "Low",
      punchTiming: "1m",
      foodBuff: "Gain 30% XP",
      ingredients: [
        { id: "flour", name: "Flour", quantity: 1, timing: "0s", requirement: "required" },
        { id: "egg", name: "Egg", quantity: 1, timing: "0s", requirement: "required" },
        { id: "milk", name: "Milk", quantity: 1, timing: "26.7s", requirement: "required" },
        { id: "blueberry", name: "Blueberry", quantity: 1, timing: "40s", requirement: "required" },
      ],
    } as any);
    vi.mocked(profitService.searchRecipes).mockReturnValue([
      { name: "Berry Crepes", id: "berry_crepes" },
    ] as never);
  });

  it("should have correct command definition", () => {
    expect(cookCommand.data.name).toBe("cook");
    const json = cookCommand.data.toJSON();
    const optionNames = json.options?.map((o: any) => o.name);
    expect(optionNames).toContain("dish");
    expect(optionNames).toContain("sell");
    expect(optionNames).toContain("qty");
    expect(optionNames).toContain("include-spices");
    expect(optionNames).not.toContain("overrides");
  });

  it("should be registered in allCommands", () => {
    const names = allCommands.map((c) => c.data.name);
    expect(names).toContain("cook");
    expect(names).toContain("prices");
    expect(names).toContain("recipe");
  });

  it("should handle autocomplete for dishes", async () => {
    const mockInteraction = {
      options: {
        getFocused: vi.fn().mockReturnValue("ber"),
      },
      respond: vi.fn(),
    } as any;

    expect(cookCommand.autocomplete).toBeDefined();
    await cookCommand.autocomplete!(mockInteraction);
    expect(mockInteraction.respond).toHaveBeenCalledWith([
      { name: "Berry Crepes", value: "Berry Crepes" },
    ]);
  });

  it("should delegate execution to the worksheet interaction flow", async () => {
    const mockInteraction = { guildId: "guild-123" } as any;

    await cookCommand.execute(mockInteraction);

    expect(executeCookCommand).toHaveBeenCalledWith(mockInteraction);
  });
});
