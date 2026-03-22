import { mkdir, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { randomUUID } from 'node:crypto';
import chalk from 'chalk';
import ora from 'ora';
import { loadConfig } from '../config/schema.js';
import { generateContent, type GeneratedItem } from '../generator/index.js';
import { Renderer } from '../renderer/index.js';
import { getPlatformDimensions, ALL_PLATFORMS } from '../config/platforms.js';
import type { Format, Manifest, ManifestItem, Platform, GenerateOptions } from '../types.js';

export async function runGenerate(
  topic: string,
  options: GenerateOptions,
): Promise<void> {
  const config = await loadConfig();

  const platform = options.platform || config.defaults.platform;
  const formats = options.formats.length > 0 ? options.formats : config.defaults.formats;
  const count = options.count || config.defaults.count;
  const minScore = options.minScore ?? config.defaults.min_score;
  const tone = options.tone || config.defaults.tone;
  const theme = options.theme || config.defaults.theme;

  const jobId = randomUUID().slice(0, 8);
  const outputDir = resolve(config.output.dir, `job-${jobId}`);
  await mkdir(outputDir, { recursive: true });

  console.log(chalk.bold(`\nViral Content Engine`));
  console.log(chalk.gray(`Topic: ${topic}`));
  console.log(chalk.gray(`Formats: ${formats.join(', ')}`));
  console.log(chalk.gray(`Platform: ${platform}`));
  console.log(chalk.gray(`Min score: ${minScore}`));
  console.log(chalk.gray(`Output: ${outputDir}\n`));

  // Generate content
  const spinner = ora('Generating content with Ollama...').start();
  let items: GeneratedItem[];

  try {
    items = await generateContent(
      config,
      topic,
      formats,
      tone,
      minScore,
      platform,
      theme,
    );
    spinner.succeed(`Generated ${items.length} content pieces (score >= ${minScore})`);
  } catch (error) {
    spinner.fail('Content generation failed');
    console.error(chalk.red(error instanceof Error ? error.message : String(error)));
    process.exit(1);
  }

  if (items.length === 0) {
    console.log(chalk.yellow('No content passed the virality threshold. Try lowering --min-score.'));
    return;
  }

  // Limit to requested count
  const selected = items.slice(0, count);

  if (options.dryRun) {
    console.log(chalk.bold('\nDry run - content only:\n'));
    for (const item of selected) {
      console.log(chalk.cyan(`[${item.format}] `) + chalk.white(item.content) + chalk.gray(` (score: ${item.score})`));
    }

    // Write manifest even in dry run
    const manifest: Manifest = {
      job_id: jobId,
      topic,
      niche: options.niche,
      generated_at: new Date().toISOString(),
      total_images: 0,
      items: selected.map((item) => ({
        id: item.id,
        format: item.format,
        content: item.content,
        score: item.score,
        files: {},
      })),
    };
    await writeFile(join(outputDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
    console.log(chalk.green(`\nManifest: ${join(outputDir, 'manifest.json')}`));
    return;
  }

  // Render images
  const renderSpinner = ora('Rendering images...').start();
  const renderer = new Renderer(config.concurrency);

  try {
    await renderer.start();

    const platforms: Platform[] = platform === 'all' ? ALL_PLATFORMS : [platform as Platform];
    const manifestItems: ManifestItem[] = [];

    let rendered = 0;
    for (const item of selected) {
      const allFiles: Record<string, string> = {};

      for (const p of platforms) {
        const dims = getPlatformDimensions(p);
        const vars = {
          ...item.templateVars,
          width: dims.width,
          height: dims.height,
        };

        const files = await renderer.render(item.format, vars, {
          outputDir,
          id: `${item.id}_${p}`,
          platform: p,
          width: dims.width,
          height: dims.height,
        });

        for (const [key, path] of Object.entries(files)) {
          allFiles[`${p}_${key}`] = path;
        }
      }

      manifestItems.push({
        id: item.id,
        format: item.format,
        content: item.content,
        score: item.score,
        files: allFiles,
      });

      rendered++;
      renderSpinner.text = `Rendering images... ${rendered}/${selected.length}`;
    }

    renderSpinner.succeed(`Rendered ${rendered} images`);

    // Write manifest
    const manifest: Manifest = {
      job_id: jobId,
      topic,
      niche: options.niche,
      generated_at: new Date().toISOString(),
      total_images: rendered * platforms.length,
      items: manifestItems,
    };
    await writeFile(join(outputDir, 'manifest.json'), JSON.stringify(manifest, null, 2));

    // Generate preview HTML
    const previewHtml = generatePreviewHtml(manifestItems, topic, jobId);
    await writeFile(join(outputDir, 'preview.html'), previewHtml);

    console.log(chalk.green(`\nOutput: ${outputDir}`));
    console.log(chalk.green(`Manifest: ${join(outputDir, 'manifest.json')}`));
    console.log(chalk.green(`Preview: ${join(outputDir, 'preview.html')}`));

    // Save last job path
    await writeFile(join(resolve(config.output.dir), '.last-job'), outputDir);

    if (options.preview) {
      const { exec } = await import('node:child_process');
      exec(`open "${join(outputDir, 'preview.html')}" || xdg-open "${join(outputDir, 'preview.html')}"`);
    }
  } finally {
    await renderer.stop();
  }
}

function generatePreviewHtml(items: ManifestItem[], topic: string, jobId: string): string {
  const imageCards = items
    .map((item) => {
      const firstFile = Object.values(item.files).find((f) => f.endsWith('.png') && !f.includes('_thumb'));
      if (!firstFile) return '';
      const relativePath = firstFile.split('/').slice(-2).join('/');
      return `
      <div class="card">
        <img src="${relativePath}" alt="${item.id}" loading="lazy" />
        <div class="info">
          <span class="format">${item.format}</span>
          <span class="score">Score: ${item.score}</span>
        </div>
        <p class="content">${item.content}</p>
      </div>`;
    })
    .join('');

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Viral Content - ${topic}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #0a0a0a; color: #fff; font-family: system-ui; padding: 2rem; }
    h1 { margin-bottom: 0.5rem; }
    .meta { color: #666; margin-bottom: 2rem; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem; }
    .card { background: #1a1a1a; border-radius: 12px; overflow: hidden; }
    .card img { width: 100%; aspect-ratio: 9/16; object-fit: cover; }
    .info { padding: 0.75rem 1rem 0; display: flex; justify-content: space-between; }
    .format { background: #ff3366; padding: 2px 8px; border-radius: 4px; font-size: 0.75rem; }
    .score { color: #666; font-size: 0.85rem; }
    .content { padding: 0.5rem 1rem 1rem; font-size: 0.85rem; color: #999; }
  </style>
</head>
<body>
  <h1>Viral Content: ${topic}</h1>
  <p class="meta">Job: ${jobId} | ${items.length} items</p>
  <div class="grid">${imageCards}</div>
</body>
</html>`;
}
