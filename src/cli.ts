import { Command } from 'commander';
import chalk from 'chalk';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { runGenerate } from './commands/generate.js';
import { runBatch } from './commands/batch.js';
import { runPreview } from './commands/preview.js';
import { runInit } from './commands/init.js';
import { PLATFORMS, THEMES, FORMAT_NAMES } from './config/platforms.js';
import { OllamaClient } from './ollama/client.js';
import { loadConfig } from './config/schema.js';
import type { Format, GenerateOptions } from './types.js';

const program = new Command();

program
  .name('viral')
  .description('One topic -> 30+ ready-to-post viral images')
  .version('1.0.0');

program
  .command('generate')
  .argument('<topic>', 'Topic to generate content about')
  .option('-p, --platform <platform>', 'Target platform', 'tiktok')
  .option('-f, --formats <formats>', 'Comma-separated formats', '')
  .option('-c, --count <number>', 'Target image count', '30')
  .option('--min-score <number>', 'Minimum virality score', '70')
  .option('-t, --tone <tone>', 'Content tone', 'dark-humor')
  .option('-n, --niche <niche>', 'Target niche')
  .option('--theme <theme>', 'Visual theme')
  .option('--dry-run', 'Generate copy only, skip rendering', false)
  .option('--preview', 'Open output in browser', false)
  .action(async (topic: string, opts: Record<string, string | boolean>) => {
    const formatList = typeof opts.formats === 'string' && opts.formats
      ? (opts.formats as string).split(',').map((f) => f.trim()) as Format[]
      : [];

    const options: GenerateOptions = {
      platform: opts.platform as GenerateOptions['platform'],
      formats: formatList,
      count: parseInt(opts.count as string, 10),
      minScore: parseInt(opts.minScore as string, 10),
      tone: opts.tone as GenerateOptions['tone'],
      niche: opts.niche as GenerateOptions['niche'],
      theme: opts.theme as GenerateOptions['theme'],
      dryRun: opts.dryRun as boolean,
      preview: opts.preview as boolean,
    };

    await runGenerate(topic, options);
  });

program
  .command('batch')
  .argument('<file>', 'File with one topic per line')
  .option('-p, --platform <platform>', 'Target platform', 'tiktok')
  .option('-f, --formats <formats>', 'Comma-separated formats', '')
  .option('-c, --count <number>', 'Target image count', '30')
  .option('--min-score <number>', 'Minimum virality score', '70')
  .option('-t, --tone <tone>', 'Content tone', 'dark-humor')
  .option('-n, --niche <niche>', 'Target niche')
  .option('--theme <theme>', 'Visual theme')
  .option('--dry-run', 'Generate copy only', false)
  .option('--preview', 'Open output in browser', false)
  .action(async (file: string, opts: Record<string, string | boolean>) => {
    const formatList = typeof opts.formats === 'string' && opts.formats
      ? (opts.formats as string).split(',').map((f) => f.trim()) as Format[]
      : [];

    const options: GenerateOptions = {
      platform: opts.platform as GenerateOptions['platform'],
      formats: formatList,
      count: parseInt(opts.count as string, 10),
      minScore: parseInt(opts.minScore as string, 10),
      tone: opts.tone as GenerateOptions['tone'],
      niche: opts.niche as GenerateOptions['niche'],
      theme: opts.theme as GenerateOptions['theme'],
      dryRun: opts.dryRun as boolean,
      preview: opts.preview as boolean,
    };

    await runBatch(file, options);
  });

program
  .command('preview')
  .argument('<format>', 'Format to preview')
  .action(async (format: string) => {
    await runPreview(format as Format);
  });

program
  .command('themes')
  .description('List available themes')
  .action(() => {
    console.log(chalk.bold('\nAvailable Themes:\n'));
    for (const [name, colors] of Object.entries(THEMES)) {
      console.log(`  ${chalk.cyan(name.padEnd(16))} bg: ${colors.background.substring(0, 20).padEnd(20)} text: ${colors.text_color}`);
    }
    console.log();
  });

program
  .command('formats')
  .description('List available formats')
  .action(() => {
    console.log(chalk.bold('\nAvailable Formats:\n'));
    const descriptions: Record<string, string> = {
      'relatable': 'Dark bg, one big sentence, massive font',
      'hot-take': 'Bold claim, editorial layout',
      'comparison': 'Two-column left/right contrast',
      'fake-tweet': 'Looks like a real Twitter/X post',
      'fake-text': 'iPhone-style SMS conversation',
      'list-card': '5-7 bullet points',
      'quote-card': 'Beautiful typography, atmospheric bg',
      'roast': 'Checkbox list roast',
    };
    for (const name of FORMAT_NAMES) {
      console.log(`  ${chalk.cyan(name.padEnd(16))} ${descriptions[name] || ''}`);
    }
    console.log();
  });

program
  .command('init')
  .description('Create viral.config.yaml')
  .action(async () => {
    await runInit();
  });

program
  .command('doctor')
  .description('Check Ollama connection and model')
  .action(async () => {
    const config = await loadConfig();
    const client = new OllamaClient(config.ollama.host, config.ollama.model);

    console.log(chalk.bold('\nViral Content Engine - Doctor\n'));

    const available = await client.isAvailable();
    console.log(`  Ollama server:  ${available ? chalk.green('connected') : chalk.red('not reachable')}`);

    if (available) {
      const hasModel = await client.hasModel();
      console.log(`  Model (${config.ollama.model}):  ${hasModel ? chalk.green('available') : chalk.red('not found')}`);

      if (!hasModel) {
        console.log(chalk.yellow(`\n  Run: ollama pull ${config.ollama.model}`));
      }
    } else {
      console.log(chalk.yellow('\n  Run: ollama serve'));
    }
    console.log();
  });

program
  .command('last')
  .description('Show last job output path')
  .action(async () => {
    const config = await loadConfig();
    try {
      const lastJob = await readFile(resolve(config.output.dir, '.last-job'), 'utf-8');
      console.log(lastJob.trim());
    } catch {
      console.log(chalk.yellow('No previous job found.'));
    }
  });

export { program };
