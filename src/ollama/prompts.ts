import { readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROMPTS_DIR = join(__dirname, '..', '..', 'templates', 'prompts');

const promptCache = new Map<string, string>();

export async function loadPrompt(name: string): Promise<string> {
  if (promptCache.has(name)) {
    return promptCache.get(name)!;
  }

  const filePath = join(PROMPTS_DIR, `${name}.txt`);
  const content = await readFile(filePath, 'utf-8');
  promptCache.set(name, content);
  return content;
}

export function clearPromptCache(): void {
  promptCache.clear();
}
