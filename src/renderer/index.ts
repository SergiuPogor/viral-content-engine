import { createServer, type Server, type IncomingMessage, type ServerResponse } from 'node:http';
import { readFile } from 'node:fs/promises';
import { join, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderTemplate } from './inject.js';
import { processScreenshot, type ExportOptions } from './export.js';
import type { Format, TemplateVars } from '../types.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const TEMPLATES_ROOT = join(__dirname, '..', '..', 'templates');

const MIME_TYPES: Record<string, string> = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
};

const FORMAT_TO_TEMPLATE: Record<Format, string> = {
  'relatable': 'relatable',
  'hot-take': 'hot-take',
  'comparison': 'comparison',
  'fake-tweet': 'fake-tweet',
  'fake-text': 'fake-text',
  'list-card': 'list-card',
  'quote-card': 'quote-card',
  'roast': 'roast-checklist',
};

export class Renderer {
  private server: Server | null = null;
  private port: number = 0;
  private browser: unknown = null;
  private pages: unknown[] = [];
  private pagePool: unknown[] = [];
  private poolSize: number;

  constructor(poolSize: number = 4) {
    this.poolSize = poolSize;
  }

  async start(): Promise<void> {
    // Start local HTTP server for fonts
    this.server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
      const url = req.url || '/';
      const filePath = join(TEMPLATES_ROOT, url);
      const ext = extname(filePath);
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';

      try {
        const data = await readFile(filePath);
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
      } catch {
        res.writeHead(404);
        res.end('Not found');
      }
    });

    await new Promise<void>((resolve) => {
      this.server!.listen(0, '127.0.0.1', () => {
        const addr = this.server!.address();
        if (addr && typeof addr === 'object') {
          this.port = addr.port;
        }
        resolve();
      });
    });

    // Launch Playwright browser
    const { chromium } = await import('playwright');
    this.browser = await chromium.launch({ headless: true });

    // Create page pool
    for (let i = 0; i < this.poolSize; i++) {
      const page = await (this.browser as { newPage: () => Promise<unknown> }).newPage();
      this.pages.push(page);
      this.pagePool.push(page);
    }
  }

  private async acquirePage(): Promise<unknown> {
    while (this.pagePool.length === 0) {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
    return this.pagePool.pop()!;
  }

  private releasePage(page: unknown): void {
    this.pagePool.push(page);
  }

  async render(
    format: Format,
    vars: TemplateVars,
    exportOptions: ExportOptions,
  ): Promise<Record<string, string>> {
    const templateName = FORMAT_TO_TEMPLATE[format];
    const html = await renderTemplate(templateName, vars);

    const baseUrl = `http://127.0.0.1:${this.port}/`;
    const fullHtml = html.replace(
      '<head>',
      `<head><base href="${baseUrl}">`,
    );

    const page = await this.acquirePage();

    try {
      const typedPage = page as {
        setViewportSize: (size: { width: number; height: number }) => Promise<void>;
        setContent: (html: string, options?: { waitUntil?: string }) => Promise<void>;
        screenshot: (options?: { fullPage?: boolean }) => Promise<Buffer>;
      };

      await typedPage.setViewportSize({
        width: vars.width,
        height: vars.height,
      });

      await typedPage.setContent(fullHtml, { waitUntil: 'networkidle' });

      const screenshot = await typedPage.screenshot({ fullPage: false });

      return await processScreenshot(
        Buffer.from(screenshot),
        exportOptions,
      );
    } finally {
      this.releasePage(page);
    }
  }

  async stop(): Promise<void> {
    if (this.browser) {
      await (this.browser as { close: () => Promise<void> }).close();
      this.browser = null;
    }
    if (this.server) {
      await new Promise<void>((resolve) => {
        this.server!.close(() => resolve());
      });
      this.server = null;
    }
    this.pages = [];
    this.pagePool = [];
  }

  getPort(): number {
    return this.port;
  }
}
