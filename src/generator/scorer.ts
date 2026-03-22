import { OllamaClient } from '../ollama/client.js';
import { loadPrompt } from '../ollama/prompts.js';
import type { ViralityScores } from '../types.js';

interface ScorerResult {
  scores: {
    id: string;
    specificity: number;
    tension: number;
    emotion: number;
    zero_friction: number;
    tag_target: number;
    total: number;
  }[];
}

export function calculateViralityScore(scores: Omit<ViralityScores, 'total'>): number {
  return Math.round(
    (scores.specificity * 0.30 +
      scores.tension * 0.25 +
      scores.emotion * 0.20 +
      scores.zero_friction * 0.15 +
      scores.tag_target * 0.10) *
      100,
  );
}

export async function scoreContent(
  client: OllamaClient,
  items: { id: string; content: string }[],
): Promise<Map<string, ViralityScores>> {
  const systemPrompt = await loadPrompt('scorer');
  const contentList = items
    .map((item) => `[${item.id}]: ${item.content}`)
    .join('\n');

  const result = await client.generateJSON<ScorerResult>(
    systemPrompt,
    `Score this content:\n${contentList}`,
  );

  const scoreMap = new Map<string, ViralityScores>();

  for (const score of result.scores) {
    const total = calculateViralityScore({
      specificity: score.specificity,
      tension: score.tension,
      emotion: score.emotion,
      zero_friction: score.zero_friction,
      tag_target: score.tag_target,
    });

    scoreMap.set(score.id, {
      specificity: score.specificity,
      tension: score.tension,
      emotion: score.emotion,
      zero_friction: score.zero_friction,
      tag_target: score.tag_target,
      total,
    });
  }

  return scoreMap;
}
