export type Platform =
  | 'tiktok'
  | 'instagram_square'
  | 'instagram_story'
  | 'twitter'
  | 'pinterest'
  | 'linkedin';

export type Theme =
  | 'dark-minimal'
  | 'light-clean'
  | 'neon'
  | 'mono'
  | 'warm'
  | 'gradient'
  | 'paper';

export type Format =
  | 'relatable'
  | 'hot-take'
  | 'comparison'
  | 'fake-tweet'
  | 'fake-text'
  | 'list-card'
  | 'quote-card'
  | 'roast';

export type Tone =
  | 'dark-humor'
  | 'serious'
  | 'aspirational'
  | 'educational';

export type Niche =
  | 'developers'
  | 'freelancers'
  | 'gym'
  | 'entrepreneurs'
  | 'remote'
  | 'gen-z'
  | 'nurses'
  | 'students';

export interface PlatformDimensions {
  width: number;
  height: number;
}

export interface ThemeColors {
  background: string;
  text_color: string;
  accent_color: string;
  handle_color: string;
}

export interface ViralityScores {
  specificity: number;
  tension: number;
  emotion: number;
  zero_friction: number;
  tag_target: number;
  total: number;
}

export interface ScoredContent {
  id: string;
  format: Format;
  content: string;
  scores: ViralityScores;
  templateVars: TemplateVars;
}

export interface TemplateVars {
  content: string;
  width: number;
  height: number;
  background: string;
  text_color: string;
  accent_color: string;
  handle_color: string;
  font: string;
  font_size: string;
  handle: string;
  items?: string[];
  left_col?: string;
  right_col?: string;
  left_label?: string;
  right_label?: string;
  rows?: [string, string][];
  theme: string;
  name?: string;
  handle_name?: string;
  text?: string;
  likes?: string;
  retweets?: string;
  messages?: { sender: string; text: string }[];
  title?: string;
}

export interface GenerateOptions {
  platform: Platform | 'all';
  formats: Format[];
  count: number;
  minScore: number;
  tone: Tone;
  niche?: Niche;
  theme?: Theme;
  dryRun: boolean;
  preview: boolean;
}

export interface OllamaResponse {
  model: string;
  response: string;
  done: boolean;
}

export interface ManifestItem {
  id: string;
  format: Format;
  content: string;
  score: number;
  files: Record<string, string>;
}

export interface Manifest {
  job_id: string;
  topic: string;
  niche?: string;
  generated_at: string;
  total_images: number;
  items: ManifestItem[];
}

export interface ViralConfig {
  ollama: {
    host: string;
    model: string;
  };
  defaults: {
    platform: Platform | 'all';
    formats: Format[];
    count: number;
    min_score: number;
    tone: Tone;
    theme: Theme;
  };
  branding: {
    handle: string;
    font: string;
  };
  output: {
    dir: string;
  };
  concurrency: number;
}
