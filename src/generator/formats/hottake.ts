import { OllamaClient } from '../../ollama/client.js';
import { loadPrompt } from '../../ollama/prompts.js';

interface HotTakeResult {
  items: { take: string; counter: string }[];
}

export async function generateHotTake(
  client: OllamaClient,
  topic: string,
  tone: string,
): Promise<{ format: 'hot-take'; items: { content: string; counter: string; id: string }[] }> {
  const systemPrompt = await loadPrompt('hot-take');
  const userPrompt = `Topic: ${topic}\nTone: ${tone}`;
  const result = await client.generateJSON<HotTakeResult>(systemPrompt, userPrompt);
  return {
    format: 'hot-take',
    items: result.items.map((item, i) => ({
      content: item.take,
      counter: item.counter,
      id: `hot-take-${i}`,
    })),
  };
}
