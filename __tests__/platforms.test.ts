import {
  PLATFORMS,
  THEMES,
  ALL_PLATFORMS,
  FORMAT_NAMES,
  getPlatformDimensions,
  getThemeColors,
  calculateFontSize,
} from '../src/config/platforms.js';

describe('Platform Dimensions', () => {
  it('should have tiktok at 1080x1920', () => {
    expect(PLATFORMS.tiktok).toEqual({ width: 1080, height: 1920 });
  });

  it('should have instagram_square at 1080x1080', () => {
    expect(PLATFORMS.instagram_square).toEqual({ width: 1080, height: 1080 });
  });

  it('should have instagram_story at 1080x1920', () => {
    expect(PLATFORMS.instagram_story).toEqual({ width: 1080, height: 1920 });
  });

  it('should have twitter at 1600x900', () => {
    expect(PLATFORMS.twitter).toEqual({ width: 1600, height: 900 });
  });

  it('should have pinterest at 1000x1500', () => {
    expect(PLATFORMS.pinterest).toEqual({ width: 1000, height: 1500 });
  });

  it('should have linkedin at 1200x628', () => {
    expect(PLATFORMS.linkedin).toEqual({ width: 1200, height: 628 });
  });

  it('should have exactly 6 platforms', () => {
    expect(Object.keys(PLATFORMS)).toHaveLength(6);
  });

  it('ALL_PLATFORMS should contain all platform keys', () => {
    expect(ALL_PLATFORMS).toEqual(expect.arrayContaining([
      'tiktok', 'instagram_square', 'instagram_story', 'twitter', 'pinterest', 'linkedin',
    ]));
    expect(ALL_PLATFORMS).toHaveLength(6);
  });
});

describe('getPlatformDimensions', () => {
  it('should return correct dimensions for tiktok', () => {
    expect(getPlatformDimensions('tiktok')).toEqual({ width: 1080, height: 1920 });
  });

  it('should return correct dimensions for twitter', () => {
    expect(getPlatformDimensions('twitter')).toEqual({ width: 1600, height: 900 });
  });
});

describe('Themes', () => {
  it('should have 7 themes', () => {
    expect(Object.keys(THEMES)).toHaveLength(7);
  });

  it('should have dark-minimal theme', () => {
    expect(THEMES['dark-minimal']).toBeDefined();
    expect(THEMES['dark-minimal'].background).toBe('#0a0a0a');
    expect(THEMES['dark-minimal'].text_color).toBe('#ffffff');
  });

  it('should have light-clean theme', () => {
    expect(THEMES['light-clean']).toBeDefined();
    expect(THEMES['light-clean'].background).toBe('#fafafa');
  });

  it('should have neon theme', () => {
    expect(THEMES['neon']).toBeDefined();
    expect(THEMES['neon'].text_color).toBe('#00ff88');
  });

  it('should have mono theme', () => {
    expect(THEMES['mono']).toBeDefined();
  });

  it('should have warm theme', () => {
    expect(THEMES['warm']).toBeDefined();
  });

  it('should have gradient theme', () => {
    expect(THEMES['gradient']).toBeDefined();
    expect(THEMES['gradient'].background).toContain('linear-gradient');
  });

  it('should have paper theme', () => {
    expect(THEMES['paper']).toBeDefined();
  });

  it('each theme should have all required color properties', () => {
    for (const [, colors] of Object.entries(THEMES)) {
      expect(colors).toHaveProperty('background');
      expect(colors).toHaveProperty('text_color');
      expect(colors).toHaveProperty('accent_color');
      expect(colors).toHaveProperty('handle_color');
    }
  });
});

describe('getThemeColors', () => {
  it('should return correct colors for dark-minimal', () => {
    const colors = getThemeColors('dark-minimal');
    expect(colors.background).toBe('#0a0a0a');
    expect(colors.accent_color).toBe('#ff3366');
  });
});

describe('Format Names', () => {
  it('should have 8 formats', () => {
    expect(FORMAT_NAMES).toHaveLength(8);
  });

  it('should contain all expected formats', () => {
    expect(FORMAT_NAMES).toContain('relatable');
    expect(FORMAT_NAMES).toContain('hot-take');
    expect(FORMAT_NAMES).toContain('comparison');
    expect(FORMAT_NAMES).toContain('fake-tweet');
    expect(FORMAT_NAMES).toContain('fake-text');
    expect(FORMAT_NAMES).toContain('list-card');
    expect(FORMAT_NAMES).toContain('quote-card');
    expect(FORMAT_NAMES).toContain('roast');
  });
});

describe('calculateFontSize', () => {
  it('should return 160px for content <= 40 chars', () => {
    expect(calculateFontSize(10)).toBe('160px');
    expect(calculateFontSize(40)).toBe('160px');
  });

  it('should return 130px for content 41-70 chars', () => {
    expect(calculateFontSize(41)).toBe('130px');
    expect(calculateFontSize(55)).toBe('130px');
    expect(calculateFontSize(70)).toBe('130px');
  });

  it('should return 108px for content 71-100 chars', () => {
    expect(calculateFontSize(71)).toBe('108px');
    expect(calculateFontSize(90)).toBe('108px');
  });

  it('should return 58px for content > 200 chars', () => {
    expect(calculateFontSize(201)).toBe('58px');
    expect(calculateFontSize(250)).toBe('58px');
    expect(calculateFontSize(500)).toBe('58px');
  });

  it('should handle 0 length', () => {
    expect(calculateFontSize(0)).toBe('160px');
  });

  it('should handle exact boundary at 40', () => {
    expect(calculateFontSize(40)).toBe('160px');
    expect(calculateFontSize(41)).toBe('130px');
  });

  it('should handle exact boundary at 100', () => {
    expect(calculateFontSize(70)).toBe('130px');
    expect(calculateFontSize(71)).toBe('108px');
    expect(calculateFontSize(100)).toBe('108px');
  });

  it('should handle exact boundary at 140', () => {
    expect(calculateFontSize(140)).toBe('88px');
    expect(calculateFontSize(141)).toBe('72px');
  });
});
