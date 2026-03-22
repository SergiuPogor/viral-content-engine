import Handlebars from 'handlebars';
import { readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { TemplateVars } from '../types.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const TEMPLATES_DIR = join(__dirname, '..', '..', 'templates', 'formats');

const templateCache = new Map<string, HandlebarsTemplateDelegate>();

// Register helpers
Handlebars.registerHelper('eq', (a: unknown, b: unknown) => a === b);
Handlebars.registerHelper('ifCond', function (this: unknown, v1: unknown, v2: unknown, options: Handlebars.HelperOptions) {
  return v1 === v2 ? options.fn(this) : options.inverse(this);
});

export async function renderTemplate(
  formatName: string,
  vars: TemplateVars,
): Promise<string> {
  let template = templateCache.get(formatName);

  if (!template) {
    const templatePath = join(TEMPLATES_DIR, `${formatName}.html`);
    const templateHtml = await readFile(templatePath, 'utf-8');
    template = Handlebars.compile(templateHtml);
    templateCache.set(formatName, template);
  }

  return template(vars);
}

export function clearTemplateCache(): void {
  templateCache.clear();
}

export function renderTemplateString(
  templateHtml: string,
  vars: TemplateVars,
): string {
  const template = Handlebars.compile(templateHtml);
  return template(vars);
}
