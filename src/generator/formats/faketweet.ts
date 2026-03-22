import { OllamaClient } from '../../ollama/client.js';
import { loadPrompt } from '../../ollama/prompts.js';

interface FakeTweetResult {
  tweets: { name: string; handle: string; text: string; likes: string; retweets: string }[];
}

export async function generateFakeTweet(
  client: OllamaClient,
  topic: string,
  tone: string,
): Promise<{ format: 'fake-tweet'; items: { name: string; handle_name: string; content: string; likes: string; retweets: string; id: string }[] }> {
  const systemPrompt = await loadPrompt('fake-tweet');
  const userPrompt = `Topic: ${topic}\nTone: ${tone}`;
  const result = await client.generateJSON<FakeTweetResult>(systemPrompt, userPrompt);
  return {
    format: 'fake-tweet',
    items: result.tweets.map((tweet, i) => ({
      name: tweet.name,
      handle_name: tweet.handle,
      content: tweet.text,
      likes: tweet.likes,
      retweets: tweet.retweets,
      id: `fake-tweet-${i}`,
    })),
  };
}
