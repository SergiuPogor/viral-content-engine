import { readFile } from 'node:fs/promises';
import chalk from 'chalk';
import { runGenerate } from './generate.js';
import type { GenerateOptions } from '../types.js';

export async function runBatch(
  filePath: string,
  options: GenerateOptions,
): Promise<void> {
  let content: string;
  try {
    content = await readFile(filePath, 'utf-8');
  } catch {
    console.error(chalk.red(`Could not read file: ${filePath}`));
    process.exit(1);
  }

  const topics = content
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith('#'));

  console.log(chalk.bold(`Batch mode: ${topics.length} topics\n`));

  for (let i = 0; i < topics.length; i++) {
    console.log(chalk.cyan(`\n[${i + 1}/${topics.length}] ${topics[i]}`));
    console.log(chalk.gray('─'.repeat(50)));

    try {
      await runGenerate(topics[i], options);
    } catch (error) {
      console.error(chalk.red(`Failed: ${error instanceof Error ? error.message : String(error)}`));
      continue;
    }
  }

  console.log(chalk.green(`\nBatch complete: ${topics.length} topics processed`));
}
