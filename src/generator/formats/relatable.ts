import { OllamaClient } from '../../ollama/client.js';
import { loadPrompt } from '../../ollama/prompts.js';

interface RelatableResult {
  items: string[];
}

export async function generateRelatable(
  client: OllamaClient,
  topic: string,
  tone: string,
): Promise<{ format: 'relatable'; items: { content: string; id: string }[] }> {
  const systemPrompt = await loadPrompt('relatable');
  const userPrompt = `Topic: ${topic}\nTone: ${tone}`;
  const result = await client.generateJSON<RelatableResult>(systemPrompt, userPrompt);
  return {
    format: 'relatable',
    items: result.items.map((item, i) => ({
      content: item,
      id: `relatable-${i}`,
    })),
  };
}
