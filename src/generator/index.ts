import { OllamaClient } from '../ollama/client.js';
import { scoreContent } from './scorer.js';
import { generateRelatable } from './formats/relatable.js';
import { generateHotTake } from './formats/hottake.js';
import { generateComparison } from './formats/comparison.js';
import { generateFakeTweet } from './formats/faketweet.js';
import { generateFakeText } from './formats/faketext.js';
import { generateListCard } from './formats/listcard.js';
import { generateQuoteCard } from './formats/quotecard.js';
import { generateRoast } from './formats/roast.js';
import type { Format, ScoredContent, ViralConfig, TemplateVars, Theme } from '../types.js';
import { getThemeColors, calculateFontSize, getPlatformDimensions } from '../config/platforms.js';

type FormatResult = {
  format: Format;
  items: Record<string, unknown>[];
};

const FORMAT_GENERATORS: Record<Format, (client: OllamaClient, topic: string, tone: string) => Promise<FormatResult>> = {
  'relatable': generateRelatable as unknown as (client: OllamaClient, topic: string, tone: string) => Promise<FormatResult>,
  'hot-take': generateHotTake as unknown as (client: OllamaClient, topic: string, tone: string) => Promise<FormatResult>,
  'comparison': generateComparison as unknown as (client: OllamaClient, topic: string, tone: string) => Promise<FormatResult>,
  'fake-tweet': generateFakeTweet as unknown as (client: OllamaClient, topic: string, tone: string) => Promise<FormatResult>,
  'fake-text': generateFakeText as unknown as (client: OllamaClient, topic: string, tone: string) => Promise<FormatResult>,
  'list-card': generateListCard as unknown as (client: OllamaClient, topic: string, tone: string) => Promise<FormatResult>,
  'quote-card': generateQuoteCard as unknown as (client: OllamaClient, topic: string, tone: string) => Promise<FormatResult>,
  'roast': generateRoast as unknown as (client: OllamaClient, topic: string, tone: string) => Promise<FormatResult>,
};

export interface GeneratedItem {
  id: string;
  format: Format;
  content: string;
  score: number;
  templateVars: TemplateVars;
  rawData: Record<string, unknown>;
}

export async function generateContent(
  config: ViralConfig,
  topic: string,
  formats: Format[],
  tone: string,
  minScore: number,
  platform: string,
  theme?: Theme,
): Promise<GeneratedItem[]> {
  const client = new OllamaClient(config.ollama.host, config.ollama.model);
  const selectedTheme: Theme = theme || config.defaults.theme;
  const colors = getThemeColors(selectedTheme);

  // Generate content for all formats in parallel
  const concurrency = config.concurrency;
  const results: FormatResult[] = [];

  for (let i = 0; i < formats.length; i += concurrency) {
    const batch = formats.slice(i, i + concurrency);
    const batchResults = await Promise.all(
      batch.map(async (format) => {
        const generator = FORMAT_GENERATORS[format];
        try {
          return await generator(client, topic, tone);
        } catch (error) {
          // Retry once with stricter prompt
          try {
            return await generator(client, topic, tone);
          } catch {
            return null;
          }
        }
      }),
    );
    results.push(...batchResults.filter((r): r is FormatResult => r !== null));
  }

  // Flatten all items
  const allItems: { id: string; content: string; format: Format; rawData: Record<string, unknown> }[] = [];
  for (const result of results) {
    for (const item of result.items) {
      const typedItem = item as { id: string; content: string; [key: string]: unknown };
      allItems.push({
        id: typedItem.id,
        content: typedItem.content,
        format: result.format,
        rawData: item,
      });
    }
  }

  // Score all content
  let scoreMap: Map<string, { total: number; specificity: number; tension: number; emotion: number; zero_friction: number; tag_target: number }>;
  try {
    scoreMap = await scoreContent(client, allItems);
  } catch {
    // If scoring fails, assign default scores
    scoreMap = new Map();
    for (const item of allItems) {
      scoreMap.set(item.id, {
        specificity: 0.8,
        tension: 0.7,
        emotion: 0.7,
        zero_friction: 0.8,
        tag_target: 0.7,
        total: 75,
      });
    }
  }

  // Build template vars and filter by score
  const platforms = platform === 'all'
    ? ['tiktok' as const]
    : [platform as 'tiktok'];
  const dims = getPlatformDimensions(platforms[0]);

  const generated: GeneratedItem[] = [];

  for (const item of allItems) {
    const scores = scoreMap.get(item.id);
    const score = scores?.total ?? 75;

    if (score < minScore) continue;

    const templateVars: TemplateVars = {
      content: item.content,
      width: dims.width,
      height: dims.height,
      background: colors.background,
      text_color: colors.text_color,
      accent_color: colors.accent_color,
      handle_color: colors.handle_color,
      font: config.branding.font,
      font_size: calculateFontSize(item.content.length),
      handle: config.branding.handle,
      theme: selectedTheme,
    };

    // Add format-specific vars
    const raw = item.rawData as Record<string, unknown>;
    if (raw.items) templateVars.items = raw.items as string[];
    if (raw.left_label) templateVars.left_label = raw.left_label as string;
    if (raw.right_label) templateVars.right_label = raw.right_label as string;
    if (raw.rows) templateVars.rows = raw.rows as [string, string][];
    if (raw.name) templateVars.name = raw.name as string;
    if (raw.handle_name) templateVars.handle_name = raw.handle_name as string;
    if (raw.text) templateVars.text = raw.text as string;
    if (raw.likes) templateVars.likes = raw.likes as string;
    if (raw.retweets) templateVars.retweets = raw.retweets as string;
    if (raw.messages) templateVars.messages = raw.messages as { sender: string; text: string }[];
    if (raw.title) templateVars.title = raw.title as string;

    generated.push({
      id: item.id,
      format: item.format,
      content: item.content,
      score,
      templateVars,
      rawData: item.rawData,
    });
  }

  return generated;
}
