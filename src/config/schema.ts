import { z } from 'zod';
import { cosmiconfig } from 'cosmiconfig';
import type { ViralConfig } from '../types.js';

const platformSchema = z.enum([
  'tiktok', 'instagram_square', 'instagram_story',
  'twitter', 'pinterest', 'linkedin', 'all',
]);

const formatSchema = z.enum([
  'relatable', 'hot-take', 'comparison', 'fake-tweet',
  'fake-text', 'list-card', 'quote-card', 'roast',
]);

const toneSchema = z.enum(['dark-humor', 'serious', 'aspirational', 'educational']);

const themeSchema = z.enum([
  'dark-minimal', 'light-clean', 'neon', 'mono', 'warm', 'gradient', 'paper',
]);

export const configSchema = z.object({
  ollama: z.object({
    host: z.string().url().default('http://localhost:11434'),
    model: z.string().default('llama3.2'),
  }).default({}),
  defaults: z.object({
    platform: platformSchema.default('tiktok'),
    formats: z.array(formatSchema).default([
      'relatable', 'hot-take', 'comparison', 'fake-tweet',
      'fake-text', 'list-card', 'quote-card', 'roast',
    ]),
    count: z.number().int().min(1).max(100).default(30),
    min_score: z.number().min(0).max(100).default(40),
    tone: toneSchema.default('dark-humor'),
    theme: themeSchema.default('dark-minimal'),
  }).default({}),
  branding: z.object({
    handle: z.string().default('@viral'),
    font: z.string().default('Inter'),
  }).default({}),
  output: z.object({
    dir: z.string().default('./output'),
  }).default({}),
  concurrency: z.number().int().min(1).max(8).default(4),
});

export type RawConfig = z.input<typeof configSchema>;

const DEFAULT_CONFIG: ViralConfig = {
  ollama: { host: 'http://localhost:11434', model: 'llama3.2' },
  defaults: {
    platform: 'tiktok',
    formats: ['relatable', 'hot-take', 'comparison', 'fake-tweet', 'fake-text', 'list-card', 'quote-card', 'roast'],
    count: 30,
    min_score: 40,
    tone: 'dark-humor',
    theme: 'dark-minimal',
  },
  branding: { handle: '@viral', font: 'Inter' },
  output: { dir: './output' },
  concurrency: 4,
};

export async function loadConfig(): Promise<ViralConfig> {
  const explorer = cosmiconfig('viral');
  try {
    const result = await explorer.search();
    if (result && result.config) {
      return configSchema.parse(result.config) as ViralConfig;
    }
  } catch {
    // Fall through to default
  }
  return DEFAULT_CONFIG;
}

export { DEFAULT_CONFIG };
