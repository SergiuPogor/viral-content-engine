import { OllamaClient } from '../../ollama/client.js';
import { loadPrompt } from '../../ollama/prompts.js';

interface FakeTextResult {
  conversations: { messages: { sender: string; text: string }[] }[];
}

export async function generateFakeText(
  client: OllamaClient,
  topic: string,
  tone: string,
): Promise<{ format: 'fake-text'; items: { messages: { sender: string; text: string }[]; content: string; id: string }[] }> {
  const systemPrompt = await loadPrompt('fake-text');
  const userPrompt = `Topic: ${topic}\nTone: ${tone}`;
  const result = await client.generateJSON<FakeTextResult>(systemPrompt, userPrompt);
  return {
    format: 'fake-text',
    items: result.conversations.map((conv, i) => ({
      messages: conv.messages,
      content: conv.messages.map((m) => m.text).join(' | '),
      id: `fake-text-${i}`,
    })),
  };
}
