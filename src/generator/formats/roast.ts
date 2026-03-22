import { OllamaClient } from '../../ollama/client.js';
import { loadPrompt } from '../../ollama/prompts.js';

interface RoastResult {
  title: string;
  items: string[];
}

export async function generateRoast(
  client: OllamaClient,
  topic: string,
  tone: string,
): Promise<{ format: 'roast'; items: { title: string; items: string[]; content: string; id: string }[] }> {
  const systemPrompt = await loadPrompt('roast-checklist');
  const userPrompt = `Topic: ${topic}\nTone: ${tone}`;
  const result = await client.generateJSON<RoastResult>(systemPrompt, userPrompt);
  return {
    format: 'roast',
    items: [{
      title: result.title,
      items: result.items,
      content: result.title,
      id: 'roast-0',
    }],
  };
}
