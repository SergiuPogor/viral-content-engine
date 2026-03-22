import { configSchema, DEFAULT_CONFIG } from '../src/config/schema.js';

describe('Config Schema', () => {
  it('should parse empty object with all defaults', () => {
    const result = configSchema.parse({});
    expect(result.ollama.host).toBe('http://localhost:11434');
    expect(result.ollama.model).toBe('llama3.2');
    expect(result.defaults.platform).toBe('tiktok');
    expect(result.defaults.count).toBe(30);
    expect(result.defaults.min_score).toBe(70);
    expect(result.defaults.tone).toBe('dark-humor');
    expect(result.defaults.theme).toBe('dark-minimal');
    expect(result.branding.handle).toBe('@viral');
    expect(result.branding.font).toBe('Inter');
    expect(result.output.dir).toBe('./output');
    expect(result.concurrency).toBe(4);
  });

  it('should accept valid full config', () => {
    const config = {
      ollama: { host: 'http://myhost:11434', model: 'mistral' },
      defaults: {
        platform: 'twitter',
        formats: ['relatable', 'hot-take'],
        count: 10,
        min_score: 80,
        tone: 'serious',
        theme: 'neon',
      },
      branding: { handle: '@test', font: 'Arial' },
      output: { dir: './custom-output' },
      concurrency: 2,
    };

    const result = configSchema.parse(config);
    expect(result.ollama.host).toBe('http://myhost:11434');
    expect(result.ollama.model).toBe('mistral');
    expect(result.defaults.platform).toBe('twitter');
    expect(result.defaults.count).toBe(10);
    expect(result.concurrency).toBe(2);
  });

  it('should reject invalid platform', () => {
    expect(() => configSchema.parse({
      defaults: { platform: 'invalid' },
    })).toThrow();
  });

  it('should reject invalid format', () => {
    expect(() => configSchema.parse({
      defaults: { formats: ['invalid-format'] },
    })).toThrow();
  });

  it('should reject invalid tone', () => {
    expect(() => configSchema.parse({
      defaults: { tone: 'angry' },
    })).toThrow();
  });

  it('should reject invalid theme', () => {
    expect(() => configSchema.parse({
      defaults: { theme: 'rainbow' },
    })).toThrow();
  });

  it('should reject count below 1', () => {
    expect(() => configSchema.parse({
      defaults: { count: 0 },
    })).toThrow();
  });

  it('should reject count above 100', () => {
    expect(() => configSchema.parse({
      defaults: { count: 101 },
    })).toThrow();
  });

  it('should reject concurrency above 8', () => {
    expect(() => configSchema.parse({
      concurrency: 9,
    })).toThrow();
  });

  it('should reject concurrency below 1', () => {
    expect(() => configSchema.parse({
      concurrency: 0,
    })).toThrow();
  });

  it('should reject invalid URL for ollama host', () => {
    expect(() => configSchema.parse({
      ollama: { host: 'not-a-url' },
    })).toThrow();
  });

  it('should accept all valid platforms', () => {
    const platforms = ['tiktok', 'instagram_square', 'instagram_story', 'twitter', 'pinterest', 'linkedin', 'all'];
    for (const platform of platforms) {
      const result = configSchema.parse({ defaults: { platform } });
      expect(result.defaults.platform).toBe(platform);
    }
  });

  it('should accept all valid tones', () => {
    const tones = ['dark-humor', 'serious', 'aspirational', 'educational'];
    for (const tone of tones) {
      const result = configSchema.parse({ defaults: { tone } });
      expect(result.defaults.tone).toBe(tone);
    }
  });

  it('should accept all valid themes', () => {
    const themes = ['dark-minimal', 'light-clean', 'neon', 'mono', 'warm', 'gradient', 'paper'];
    for (const theme of themes) {
      const result = configSchema.parse({ defaults: { theme } });
      expect(result.defaults.theme).toBe(theme);
    }
  });
});

describe('DEFAULT_CONFIG', () => {
  it('should have correct default values', () => {
    expect(DEFAULT_CONFIG.ollama.host).toBe('http://localhost:11434');
    expect(DEFAULT_CONFIG.ollama.model).toBe('llama3.2');
    expect(DEFAULT_CONFIG.defaults.count).toBe(30);
    expect(DEFAULT_CONFIG.defaults.min_score).toBe(70);
    expect(DEFAULT_CONFIG.defaults.formats).toHaveLength(8);
    expect(DEFAULT_CONFIG.concurrency).toBe(4);
  });
});
