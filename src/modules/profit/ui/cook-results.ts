import { EmbedBuilder } from "discord.js";
import { formatWl } from "../domain/rate.js";
import { CookingRecipe, IngredientCostBreakdown, ProfitResult } from "../domain/types.js";
import { CookSession } from "../session/cook-session.js";

export type ResultView = "summary" | "details";

const MAX_FIELD_CHARS = 950;
const MAX_FIELDS_PER_EMBED = 25;
const MAX_FIELD_BUDGET_PER_EMBED = 6000;
const MAX_EMBEDS = 10;
const COST_ONLY_COLOR = 0x3498db;
const PROFIT_COLOR = 0x2ecc71;
const LOSS_COLOR = 0xe74c3c;
const PRIVATE_FOOTER = "Private result for this cooking session.";

export interface BuildResultEmbedsParams {
  session: CookSession;
  result: ProfitResult;
  view?: ResultView;
}

interface FieldSpec {
  name: string;
  value: string;
}

function sourceFor(session: CookSession, ingredientId: string): string {
  const draft = session.rateDrafts.get(ingredientId.toLowerCase());
  if (draft?.parsed) {
    return draft.parsed.isFree ? "free" : "temporary";
  }
  return "saved";
}

function rateTextOf(item: IngredientCostBreakdown): string {
  if (item.isFree || !item.rate) {
    return "FREE";
  }
  return `${item.rate.items}/${item.rate.wl} ${item.rate.currency}`;
}

function resultColor(result: ProfitResult): number {
  if (result.sellPricePerMasakanWl === null) {
    return COST_ONLY_COLOR;
  }
  return (result.profitPerMasakanWl ?? 0) >= 0 ? PROFIT_COLOR : LOSS_COLOR;
}

function resultTitle(session: CookSession, view: ResultView): string {
  const subject = view === "summary" ? "Cooking Result" : "Cooking Details";
  return `${subject}: ${session.recipe.name} (x${session.batchQuantity})`;
}

function recipeDescription(recipe: CookingRecipe, includeSource: boolean): string {
  const parts: string[] = [];
  if (recipe.heatLevel) {
    parts.push(`Heat: ${recipe.heatLevel}`);
  }
  if (recipe.punchTiming) {
    parts.push(`Punch: ${recipe.punchTiming}`);
  }
  const lines: string[] = [];
  if (parts.length > 0) {
    lines.push(parts.join(" — "));
  }
  if (recipe.foodBuff) {
    lines.push(`Buff: ${recipe.foodBuff}`);
  }
  if (includeSource && recipe.sourceUrl) {
    lines.push(`Source: ${recipe.sourceUrl}`);
  }
  return lines.join("\n");
}

function chunkLines(lines: string[], budget: number): string[] {
  const chunks: string[] = [];
  let current: string[] = [];
  let length = 0;
  for (const line of lines) {
    if (current.length > 0 && length + line.length + 1 > budget) {
      chunks.push(current.join("\n"));
      current = [];
      length = 0;
    }
    current.push(line);
    length += line.length + 1;
  }
  if (current.length > 0) {
    chunks.push(current.join("\n"));
  }
  return chunks;
}

function chunkedFields(lines: string[], title: string): FieldSpec[] {
  return chunkLines(lines, MAX_FIELD_CHARS).map((value, idx, chunks) => ({
    name: chunks.length > 1 ? `${title} (${idx + 1}/${chunks.length})` : title,
    value,
  }));
}

function compactIngredientLines(result: ProfitResult): string[] {
  return result.breakdown.map((item) => {
    const cost = item.isFree
      ? "FREE"
      : `${formatWl(item.totalCostWl, 4)} WL`;
    return `${item.name} ${item.quantity}x — ${cost}`;
  });
}

function summaryTotals(session: CookSession, result: ProfitResult): string {
  const batch = session.batchQuantity;
  const lines = [`Cost per dish: ${formatWl(result.modalPerMasakanWl, 4)} WL`];

  if (result.sellPricePerMasakanWl === null) {
    lines.push("Selling rate not set — profit is not calculated.");
    if (batch > 1) {
      lines.push(`Batch (x${batch}): cost ${formatWl(result.totalModalWl, 4)} WL`);
    }
    return lines.join("\n");
  }

  const profit = result.profitPerMasakanWl ?? 0;
  const signed = `${profit >= 0 ? "+" : ""}${formatWl(profit, 4)}`;
  lines.push(
    `Sell per dish: ${formatWl(result.sellPricePerMasakanWl, 4)} WL`,
    `Profit per dish: ${signed} WL`,
    `Margin: ${result.marginPercent === null ? "N/A" : `${formatWl(result.marginPercent, 2)}%`}`,
    `ROI: ${result.roiPercent === null ? "N/A" : `${formatWl(result.roiPercent, 2)}%`}`
  );

  if (batch > 1) {
    lines.push(
      `Batch (x${batch}): cost ${formatWl(result.totalModalWl, 4)} WL — ` +
        `sell ${formatWl(result.totalRevenueWl ?? 0, 4)} WL — ` +
        `profit ${formatWl(result.totalProfitWl ?? 0, 4)} WL`
    );
  }

  return lines.join("\n");
}

function detailedIngredientLines(session: CookSession, result: ProfitResult): string[] {
  const batch = session.batchQuantity;
  return result.breakdown.map((item) => {
    const quantities =
      batch > 1
        ? `${item.quantity}x/dish, ${item.quantity * batch}x/batch`
        : `${item.quantity}x/dish`;
    const parts = [
      item.name,
      quantities,
      `${rateTextOf(item)} (${sourceFor(session, item.id)})`,
      `${formatWl(item.unitCostWl, 4)} WL each`,
      `${formatWl(item.totalCostWl, 4)}/dish`,
    ];
    if (batch > 1) {
      parts.push(`${formatWl(item.totalCostWl * batch, 4)}/batch`);
    }
    return parts.join(" — ");
  });
}

function fieldsForView(session: CookSession, result: ProfitResult, view: ResultView): FieldSpec[] {
  if (view === "summary") {
    return [
      ...chunkedFields(compactIngredientLines(result), "Ingredient costs"),
      { name: "Totals", value: summaryTotals(session, result) },
    ];
  }
  return [
    ...chunkedFields(detailedIngredientLines(session, result), "Ingredient details"),
    {
      name: "Notes",
      value:
        "Costs are proportional ingredient estimates only; fees, failure rates, and other unmodeled costs are not included.\n" +
        "Provenance: saved = stored /prices rate, temporary = entered in this session, free = zero cost.",
    },
  ];
}

export function buildResultEmbeds(params: BuildResultEmbedsParams): EmbedBuilder[] {
  const { session, result } = params;
  const view: ResultView = params.view ?? "summary";

  const desc = recipeDescription(session.recipe, view === "details");
  const base = new EmbedBuilder()
    .setTitle(resultTitle(session, view))
    .setColor(resultColor(result))
    .setFooter({ text: PRIVATE_FOOTER });
  if (desc) {
    base.setDescription(desc);
  }
  if (session.recipe.outputSpriteUrl) {
    base.setThumbnail(session.recipe.outputSpriteUrl);
  }

  const embeds: EmbedBuilder[] = [base];
  let current = base;
  let fieldCount = 0;
  let usedChars =
    (base.data.title?.length ?? 0) +
    (desc?.length ?? 0) +
    PRIVATE_FOOTER.length;

  for (const field of fieldsForView(session, result, view)) {
    const cost = field.name.length + field.value.length;
    if (
      fieldCount >= MAX_FIELDS_PER_EMBED ||
      (fieldCount > 0 && usedChars + cost > MAX_FIELD_BUDGET_PER_EMBED)
    ) {
      if (embeds.length >= MAX_EMBEDS) {
        break;
      }
      current = new EmbedBuilder().setColor(resultColor(result)).setFooter({ text: PRIVATE_FOOTER });
      embeds.push(current);
      fieldCount = 0;
      usedChars = PRIVATE_FOOTER.length;
    }
    current.addFields(field);
    fieldCount += 1;
    usedChars += cost;
  }

  return embeds;
}
