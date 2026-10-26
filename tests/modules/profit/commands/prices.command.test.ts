import { describe, it, expect, vi, beforeEach } from "vitest";
import { pricesCommand } from "../../../../src/modules/profit/commands/prices.command.js";
import { profitService } from "../../../../src/modules/profit/profit.service.js";

vi.mock("../../../../src/modules/profit/profit.service.js", () => {
  return {
    profitService: {
      setPrice: vi.fn(),
      getPrice: vi.fn(),
      listPrices: vi.fn(),
      removePrice: vi.fn(),
      getAllIngredientNames: vi.fn().mockReturnValue(["Dough", "Cheese", "Tomato"]),
    },
  };
});

describe("/prices command", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(profitService.getAllIngredientNames).mockReturnValue([
      "Dough",
      "Cheese",
      "Tomato",
    ]);
  });

  it("should have correct command metadata and subcommands", () => {
    expect(pricesCommand.data.name).toBe("prices");
    const json = pricesCommand.data.toJSON();
    expect(json.options?.map((o: any) => o.name)).toEqual(["set", "list", "remove"]);
  });

  it("should handle autocomplete for ingredients", async () => {
    const mockInteraction = {
      options: {
        getFocused: vi.fn().mockReturnValue("dou"),
      },
      respond: vi.fn(),
    } as any;

    expect(pricesCommand.autocomplete).toBeDefined();
    await pricesCommand.autocomplete!(mockInteraction);
    expect(mockInteraction.respond).toHaveBeenCalledWith([
      { name: "Dough", value: "Dough" },
    ]);
  });

  it("should reject set command when missing guild context", async () => {
    const reply = vi.fn();
    const mockInteraction = {
      guildId: null,
      reply,
    } as any;

    await pricesCommand.execute(mockInteraction);
    expect(reply).toHaveBeenCalledWith(
      expect.objectContaining({ content: expect.stringContaining("only be used in a server") })
    );
  });
});
