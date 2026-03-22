import { readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROMPTS_DIR = join(__dirname, '..', 'templates', 'prompts');

const PROMPT_FILES = [
  'relatable',
  'hot-take',
  'comparison',
  'fake-tweet',
  'fake-text',
  'list-card',
  'quote-card',
  'roast-checklist',
  'scorer',
];

describe('Prompt Templates', () => {
  for (const name of PROMPT_FILES) {
    it(`${name}.txt should exist and not be empty`, async () => {
      const content = await readFile(join(PROMPTS_DIR, `${name}.txt`), 'utf-8');
      expect(content.length).toBeGreaterThan(0);
    });
  }

  it('relatable prompt should mention JSON output', async () => {
    const content = await readFile(join(PROMPTS_DIR, 'relatable.txt'), 'utf-8');
    expect(content).toContain('JSON');
    expect(content).toContain('items');
  });

  it('hot-take prompt should mention hot takes', async () => {
    const content = await readFile(join(PROMPTS_DIR, 'hot-take.txt'), 'utf-8');
    expect(content).toContain('hot take');
  });

  it('comparison prompt should mention two-column', async () => {
    const content = await readFile(join(PROMPTS_DIR, 'comparison.txt'), 'utf-8');
    expect(content).toContain('two-column');
  });

  it('fake-tweet prompt should mention tweets', async () => {
    const content = await readFile(join(PROMPTS_DIR, 'fake-tweet.txt'), 'utf-8');
    expect(content).toContain('tweet');
  });

  it('scorer prompt should mention scoring dimensions', async () => {
    const content = await readFile(join(PROMPTS_DIR, 'scorer.txt'), 'utf-8');
    expect(content).toContain('specificity');
    expect(content).toContain('tension');
    expect(content).toContain('emotion');
    expect(content).toContain('zero_friction');
    expect(content).toContain('tag_target');
  });

  it('roast-checklist prompt should mention Signs you are', async () => {
    const content = await readFile(join(PROMPTS_DIR, 'roast-checklist.txt'), 'utf-8');
    expect(content).toContain('Signs you are');
  });

  it('all prompts should request JSON output', async () => {
    for (const name of PROMPT_FILES) {
      const content = await readFile(join(PROMPTS_DIR, `${name}.txt`), 'utf-8');
      expect(content).toContain('JSON');
    }
  });
});
