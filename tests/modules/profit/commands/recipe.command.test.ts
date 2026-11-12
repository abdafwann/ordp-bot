import { describe, it, expect, vi } from "vitest";
import { recipeCommand } from "../../../../src/modules/profit/commands/recipe.command.js";

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
        getString: () => "Berry Crepes",
      },
      reply,
    } as any;

    await recipeCommand.execute(mockInteraction);

    expect(reply).toHaveBeenCalledWith(
      expect.objectContaining({
        embeds: expect.arrayContaining([
          expect.objectContaining({
            data: expect.objectContaining({
              title: expect.stringContaining("Berry Crepes"),
            }),
          }),
        ]),
      })
    );
  });

  it("should display the wiki quantity range for Detective Butter Lamb sugar", async () => {
    const reply = vi.fn();
    const mockInteraction = {
      options: {
        getSubcommand: () => "view",
        getString: () => "Detective Butter Lamb",
      },
      reply,
    } as any;

    await recipeCommand.execute(mockInteraction);

    const embed = reply.mock.calls[0][0].embeds[0];
    const text = JSON.stringify(embed);
    expect(text).toContain("2-3x Sugar");
    expect(text).not.toContain("1x Sugar");
  });

  it("should keep scalar quantities unchanged for other recipes", async () => {
    const reply = vi.fn();
    const mockInteraction = {
      options: {
        getSubcommand: () => "view",
        getString: () => "Berry Crepes",
      },
      reply,
    } as any;

    await recipeCommand.execute(mockInteraction);

    const text = JSON.stringify(reply.mock.calls[0][0].embeds[0]);
    expect(text).toContain("1x Flour");
  });
});
