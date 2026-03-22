import type { OllamaResponse } from '../types.js';

export class OllamaClient {
  private host: string;
  private model: string;

  constructor(host: string, model: string) {
    this.host = host.replace(/\/$/, '');
    this.model = model;
  }

  async generate(systemPrompt: string, userPrompt: string): Promise<string> {
    const url = `${this.host}/api/generate`;
    const body = {
      model: this.model,
      prompt: userPrompt,
      system: systemPrompt,
      stream: false,
      options: {
        temperature: 0.8,
        num_predict: 2048,
      },
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Ollama error: ${response.status} ${response.statusText}`);
    }

    const data = (await response.json()) as OllamaResponse;
    return data.response;
  }

  async generateJSON<T>(systemPrompt: string, userPrompt: string): Promise<T> {
    const raw = await this.generate(systemPrompt, userPrompt);
    return parseJSONResponse<T>(raw);
  }

  async isAvailable(): Promise<boolean> {
    try {
      const response = await fetch(`${this.host}/api/tags`);
      return response.ok;
    } catch {
      return false;
    }
  }

  async hasModel(): Promise<boolean> {
    try {
      const response = await fetch(`${this.host}/api/tags`);
      if (!response.ok) return false;
      const data = (await response.json()) as { models: { name: string }[] };
      return data.models.some((m) => m.name.includes(this.model));
    } catch {
      return false;
    }
  }
}

export function parseJSONResponse<T>(raw: string): T {
  let cleaned = raw.trim();

  // Strip markdown code fences
  const fenceMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) {
    cleaned = fenceMatch[1].trim();
  }

  // Find first { or [
  const objStart = cleaned.indexOf('{');
  const arrStart = cleaned.indexOf('[');
  let start = -1;

  if (objStart === -1 && arrStart === -1) {
    throw new Error('No JSON object or array found in response');
  }

  if (objStart === -1) start = arrStart;
  else if (arrStart === -1) start = objStart;
  else start = Math.min(objStart, arrStart);

  // Find matching end
  const isArray = cleaned[start] === '[';
  let depth = 0;
  let end = -1;
  const openChar = isArray ? '[' : '{';
  const closeChar = isArray ? ']' : '}';
  let inString = false;
  let escaped = false;

  for (let i = start; i < cleaned.length; i++) {
    const ch = cleaned[i];
    if (escaped) {
      escaped = false;
      continue;
    }
    if (ch === '\\') {
      escaped = true;
      continue;
    }
    if (ch === '"') {
      inString = !inString;
      continue;
    }
    if (inString) continue;
    if (ch === openChar) depth++;
    if (ch === closeChar) {
      depth--;
      if (depth === 0) {
        end = i;
        break;
      }
    }
  }

  if (end === -1) {
    throw new Error('Malformed JSON in response');
  }

  const jsonStr = cleaned.slice(start, end + 1);
  return JSON.parse(jsonStr) as T;
}
