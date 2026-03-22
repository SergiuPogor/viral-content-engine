import { readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const TEMPLATES_DIR = join(__dirname, '..', 'templates', 'formats');

const TEMPLATE_FILES = [
  'relatable',
  'hot-take',
  'comparison',
  'fake-tweet',
  'fake-text',
  'list-card',
  'quote-card',
  'roast-checklist',
];

describe('HTML Templates', () => {
  for (const name of TEMPLATE_FILES) {
    it(`${name}.html should exist and be valid HTML`, async () => {
      const content = await readFile(join(TEMPLATES_DIR, `${name}.html`), 'utf-8');
      expect(content).toContain('<!DOCTYPE html>');
      expect(content).toContain('<html');
      expect(content).toContain('</html>');
    });
  }

  for (const name of TEMPLATE_FILES) {
    it(`${name}.html should contain Handlebars variables`, async () => {
      const content = await readFile(join(TEMPLATES_DIR, `${name}.html`), 'utf-8');
      expect(content).toContain('{{');
      expect(content).toContain('}}');
    });
  }

  for (const name of TEMPLATE_FILES) {
    it(`${name}.html should use inline CSS only`, async () => {
      const content = await readFile(join(TEMPLATES_DIR, `${name}.html`), 'utf-8');
      expect(content).toContain('<style>');
      expect(content).not.toContain('href="http');
      expect(content).not.toContain('src="http');
    });
  }

  it('relatable template should use {{content}}', async () => {
    const content = await readFile(join(TEMPLATES_DIR, 'relatable.html'), 'utf-8');
    expect(content).toContain('{{content}}');
    expect(content).toContain('{{handle}}');
  });

  it('comparison template should use {{#each rows}}', async () => {
    const content = await readFile(join(TEMPLATES_DIR, 'comparison.html'), 'utf-8');
    expect(content).toContain('{{#each rows}}');
  });

  it('fake-text template should use {{#each messages}}', async () => {
    const content = await readFile(join(TEMPLATES_DIR, 'fake-text.html'), 'utf-8');
    expect(content).toContain('{{#each messages}}');
  });

  it('list-card template should use {{#each items}}', async () => {
    const content = await readFile(join(TEMPLATES_DIR, 'list-card.html'), 'utf-8');
    expect(content).toContain('{{#each items}}');
  });

  it('roast-checklist template should use {{#each items}}', async () => {
    const content = await readFile(join(TEMPLATES_DIR, 'roast-checklist.html'), 'utf-8');
    expect(content).toContain('{{#each items}}');
  });
});
