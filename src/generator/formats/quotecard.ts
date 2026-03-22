import { OllamaClient } from '../../ollama/client.js';
import { loadPrompt } from '../../ollama/prompts.js';

interface QuoteCardResult {
  quotes: string[];
}

export async function generateQuoteCard(
  client: OllamaClient,
  topic: string,
  tone: string,
): Promise<{ format: 'quote-card'; items: { content: string; id: string }[] }> {
  const systemPrompt = await loadPrompt('quote-card');
  const userPrompt = `Topic: ${topic}\nTone: ${tone}`;
  const result = await client.generateJSON<QuoteCardResult>(systemPrompt, userPrompt);
  return {
    format: 'quote-card',
    items: result.quotes.map((quote, i) => ({
      content: quote,
      id: `quote-card-${i}`,
    })),
  };
}
