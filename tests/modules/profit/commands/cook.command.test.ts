import { describe, it, expect, vi, beforeEach } from "vitest";
import { cookCommand } from "../../../../src/modules/profit/commands/cook.command.js";
import { profitService } from "../../../../src/modules/profit/profit.service.js";
import { allCommands } from "../../../../src/core/command-loader.js";

vi.mock("../../../../src/modules/profit/profit.service.js", () => {
  return {
    profitService: {
      cook: vi.fn(),
      searchRecipes: vi.fn().mockReturnValue([{ name: "Pizza", id: "pizza" }]),
    },
  };
});

describe("/cook command", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(profitService.searchRecipes).mockReturnValue([
      { name: "Pizza", id: "pizza" },
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
    expect(optionNames).toContain("overrides");
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
        getFocused: vi.fn().mockReturnValue("piz"),
      },
      respond: vi.fn(),
    } as any;

    expect(cookCommand.autocomplete).toBeDefined();
    await cookCommand.autocomplete!(mockInteraction);
    expect(mockInteraction.respond).toHaveBeenCalledWith([
      { name: "Pizza", value: "Pizza" },
    ]);
  });

  it("should reply with missing prices help when status is missing_prices", async () => {
    vi.mocked(profitService.cook).mockResolvedValueOnce({
      status: "missing_prices",
      recipe: { name: "Pizza" } as any,
      missing: ["Cheese", "Tomato"],
      suggestedCommands: ["/prices set ingredient:Cheese rate:<rate>"],
    });

    const reply = vi.fn();
    const mockInteraction = {
      guildId: "guild-123",
      options: {
        getString: (name: string) => (name === "dish" ? "Pizza" : null),
        getInteger: () => null,
        getBoolean: () => null,
      },
      reply,
    } as any;

    await cookCommand.execute(mockInteraction);

    expect(reply).toHaveBeenCalledWith(
      expect.objectContaining({
        content: expect.stringContaining("Missing prices for"),
      })
    );
  });

  it("should reply with error message when service throws", async () => {
    vi.mocked(profitService.cook).mockRejectedValueOnce(
      new Error("Recipe not found: Lasagna")
    );

    const reply = vi.fn();
    const mockInteraction = {
      guildId: "guild-123",
      options: {
        getString: (name: string) => (name === "dish" ? "Lasagna" : null),
        getInteger: () => null,
        getBoolean: () => null,
      },
      reply,
    } as any;

    await cookCommand.execute(mockInteraction);

    expect(reply).toHaveBeenCalledWith(
      expect.objectContaining({
        content: expect.stringContaining("Recipe not found: Lasagna"),
      })
    );
  });
});
