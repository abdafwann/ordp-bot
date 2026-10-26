import { describe, it, expect, vi } from "vitest";
import { recipeCommand } from "../../../../src/modules/profit/commands/recipe.command.js";
import { recipeRepository } from "../../../../src/modules/profit/data/recipe.repository.js";

describe("/recipe command", () => {
  it("should have correct command definition", () => {
    expect(recipeCommand.data.name).toBe("recipe");
    const json = recipeCommand.data.toJSON();
    expect(json.options?.map((o: any) => o.name)).toEqual(["view", "list"]);
  });

  it("should respond with recipe embed on view", async () => {
    const reply = vi.fn();
    const mockInteraction = {
      options: {
        getSubcommand: () => "view",
        getString: () => "pizza",
      },
      reply,
    } as any;

    await recipeCommand.execute(mockInteraction);

    expect(reply).toHaveBeenCalledWith(
      expect.objectContaining({
        embeds: expect.arrayContaining([
          expect.objectContaining({
            data: expect.objectContaining({
              title: expect.stringContaining("Pizza"),
            }),
          }),
        ]),
      })
    );
  });
});
