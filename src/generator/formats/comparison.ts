import { OllamaClient } from '../../ollama/client.js';
import { loadPrompt } from '../../ollama/prompts.js';

interface ComparisonResult {
  items: { left_label: string; right_label: string; rows: [string, string][] }[];
}

export async function generateComparison(
  client: OllamaClient,
  topic: string,
  tone: string,
): Promise<{ format: 'comparison'; items: { left_label: string; right_label: string; rows: [string, string][]; content: string; id: string }[] }> {
  const systemPrompt = await loadPrompt('comparison');
  const userPrompt = `Topic: ${topic}\nTone: ${tone}`;
  const result = await client.generateJSON<ComparisonResult>(systemPrompt, userPrompt);
  return {
    format: 'comparison',
    items: result.items.map((item, i) => ({
      left_label: item.left_label,
      right_label: item.right_label,
      rows: item.rows,
      content: `${item.left_label} vs ${item.right_label}`,
      id: `comparison-${i}`,
    })),
  };
}
