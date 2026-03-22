import { OllamaClient } from '../../ollama/client.js';
import { loadPrompt } from '../../ollama/prompts.js';

interface ListCardResult {
  lists: { title: string; items: string[] }[];
}

export async function generateListCard(
  client: OllamaClient,
  topic: string,
  tone: string,
): Promise<{ format: 'list-card'; items: { title: string; items: string[]; content: string; id: string }[] }> {
  const systemPrompt = await loadPrompt('list-card');
  const userPrompt = `Topic: ${topic}\nTone: ${tone}`;
  const result = await client.generateJSON<ListCardResult>(systemPrompt, userPrompt);
  return {
    format: 'list-card',
    items: result.lists.map((list, i) => ({
      title: list.title,
      items: list.items,
      content: list.title,
      id: `list-card-${i}`,
    })),
  };
}
