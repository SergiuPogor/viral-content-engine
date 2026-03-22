import { writeFile, access } from 'node:fs/promises';
import { resolve } from 'node:path';
import chalk from 'chalk';

const DEFAULT_CONFIG_YAML = `# Viral Content Engine Configuration
ollama:
  host: "http://localhost:11434"
  model: "llama3.2"

defaults:
  platform: tiktok
  formats:
    - relatable
    - hot-take
    - comparison
    - fake-tweet
    - fake-text
    - list-card
    - quote-card
    - roast
  count: 30
  min_score: 40
  tone: dark-humor
  theme: dark-minimal

branding:
  handle: "@yourhandle"
  font: "Inter"

output:
  dir: "./output"

concurrency: 4
`;

export async function runInit(): Promise<void> {
  const configPath = resolve('viral.config.yaml');

  try {
    await access(configPath);
    console.log(chalk.yellow('viral.config.yaml already exists. Skipping.'));
    return;
  } catch {
    // File doesn't exist, create it
  }

  await writeFile(configPath, DEFAULT_CONFIG_YAML);
  console.log(chalk.green('Created viral.config.yaml'));
  console.log(chalk.gray('\nNext steps:'));
  console.log(chalk.gray('  1. Edit viral.config.yaml with your settings'));
  console.log(chalk.gray('  2. Make sure Ollama is running: ollama serve'));
  console.log(chalk.gray('  3. Pull the model: ollama pull llama3.2'));
  console.log(chalk.gray('  4. Generate: viral generate "your topic"'));
}
