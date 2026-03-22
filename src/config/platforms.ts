import type { Platform, PlatformDimensions, Theme, ThemeColors } from '../types.js';

export const PLATFORMS: Record<Platform, PlatformDimensions> = {
  tiktok: { width: 1080, height: 1920 },
  instagram_square: { width: 1080, height: 1080 },
  instagram_story: { width: 1080, height: 1920 },
  twitter: { width: 1600, height: 900 },
  pinterest: { width: 1000, height: 1500 },
  linkedin: { width: 1200, height: 628 },
};

export const THEMES: Record<Theme, ThemeColors> = {
  'dark-minimal': {
    background: '#0a0a0a',
    text_color: '#ffffff',
    accent_color: '#ff3366',
    handle_color: '#666666',
  },
  'light-clean': {
    background: '#fafafa',
    text_color: '#1a1a1a',
    accent_color: '#0066ff',
    handle_color: '#999999',
  },
  neon: {
    background: '#0d0221',
    text_color: '#00ff88',
    accent_color: '#ff00ff',
    handle_color: '#00ccff',
  },
  mono: {
    background: '#1a1a1a',
    text_color: '#e0e0e0',
    accent_color: '#ffffff',
    handle_color: '#555555',
  },
  warm: {
    background: '#2d1b0e',
    text_color: '#ffd5a0',
    accent_color: '#ff6b35',
    handle_color: '#a67c52',
  },
  gradient: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    text_color: '#ffffff',
    accent_color: '#ffd700',
    handle_color: 'rgba(255,255,255,0.6)',
  },
  paper: {
    background: '#f5f0e8',
    text_color: '#2c2c2c',
    accent_color: '#c0392b',
    handle_color: '#8b7355',
  },
};

export const ALL_PLATFORMS: Platform[] = Object.keys(PLATFORMS) as Platform[];

export const FORMAT_NAMES = [
  'relatable',
  'hot-take',
  'comparison',
  'fake-tweet',
  'fake-text',
  'list-card',
  'quote-card',
  'roast',
] as const;

export function getPlatformDimensions(platform: Platform): PlatformDimensions {
  return PLATFORMS[platform];
}

export function getThemeColors(theme: Theme): ThemeColors {
  return THEMES[theme];
}

export function calculateFontSize(contentLength: number): string {
  if (contentLength <= 40) return '160px';
  if (contentLength <= 70) return '130px';
  if (contentLength <= 100) return '108px';
  if (contentLength <= 140) return '88px';
  if (contentLength <= 200) return '72px';
  return '58px';
}
