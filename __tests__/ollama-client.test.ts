import { jest } from '@jest/globals';
import { OllamaClient, parseJSONResponse } from '../src/ollama/client.js';

// Mock global fetch
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockFetch = jest.fn<any>();
global.fetch = mockFetch as unknown as typeof fetch;

describe('OllamaClient', () => {
  let client: OllamaClient;

  beforeEach(() => {
    client = new OllamaClient('http://localhost:11434', 'llama3.2');
    mockFetch.mockReset();
  });

  describe('generate', () => {
    it('should call Ollama API with correct parameters', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ model: 'llama3.2', response: '{"items":["test"]}', done: true }),
      });

      await client.generate('system prompt', 'user prompt');

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:11434/api/generate',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        }),
      );

      const body = JSON.parse((mockFetch.mock.calls[0][1] as Record<string, string>).body);
      expect(body.model).toBe('llama3.2');
      expect(body.prompt).toBe('user prompt');
      expect(body.system).toBe('system prompt');
      expect(body.stream).toBe(false);
    });

    it('should return response text', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ model: 'llama3.2', response: 'hello world', done: true }),
      });

      const result = await client.generate('sys', 'user');
      expect(result).toBe('hello world');
    });

    it('should throw on non-ok response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      });

      await expect(client.generate('sys', 'user')).rejects.toThrow('Ollama error: 500');
    });

    it('should handle trailing slash in host URL', async () => {
      const clientWithSlash = new OllamaClient('http://localhost:11434/', 'llama3.2');
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ model: 'llama3.2', response: 'test', done: true }),
      });

      await clientWithSlash.generate('sys', 'user');
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:11434/api/generate',
        expect.anything(),
      );
    });
  });

  describe('generateJSON', () => {
    it('should parse JSON response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ model: 'llama3.2', response: '{"items":["a","b"]}', done: true }),
      });

      const result = await client.generateJSON<{ items: string[] }>('sys', 'user');
      expect(result.items).toEqual(['a', 'b']);
    });

    it('should handle markdown-wrapped JSON', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          model: 'llama3.2',
          response: '```json\n{"items":["a"]}\n```',
          done: true,
        }),
      });

      const result = await client.generateJSON<{ items: string[] }>('sys', 'user');
      expect(result.items).toEqual(['a']);
    });
  });

  describe('isAvailable', () => {
    it('should return true when server responds ok', async () => {
      mockFetch.mockResolvedValueOnce({ ok: true });
      expect(await client.isAvailable()).toBe(true);
    });

    it('should return false when server is unreachable', async () => {
      mockFetch.mockRejectedValueOnce(new Error('ECONNREFUSED'));
      expect(await client.isAvailable()).toBe(false);
    });

    it('should return false when server returns error', async () => {
      mockFetch.mockResolvedValueOnce({ ok: false });
      expect(await client.isAvailable()).toBe(false);
    });
  });

  describe('hasModel', () => {
    it('should return true when model exists', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ models: [{ name: 'llama3.2:latest' }] }),
      });
      expect(await client.hasModel()).toBe(true);
    });

    it('should return false when model does not exist', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ models: [{ name: 'other-model' }] }),
      });
      expect(await client.hasModel()).toBe(false);
    });

    it('should return false on connection error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('ECONNREFUSED'));
      expect(await client.hasModel()).toBe(false);
    });
  });
});

describe('parseJSONResponse', () => {
  it('should parse clean JSON', () => {
    const result = parseJSONResponse<{ items: string[] }>('{"items":["test"]}');
    expect(result.items).toEqual(['test']);
  });

  it('should parse JSON with preamble text', () => {
    const result = parseJSONResponse<{ items: string[] }>('Here is the JSON:\n{"items":["test"]}');
    expect(result.items).toEqual(['test']);
  });

  it('should parse JSON wrapped in markdown fences', () => {
    const result = parseJSONResponse<{ items: string[] }>('```json\n{"items":["test"]}\n```');
    expect(result.items).toEqual(['test']);
  });

  it('should parse JSON wrapped in plain fences', () => {
    const result = parseJSONResponse<{ items: string[] }>('```\n{"items":["test"]}\n```');
    expect(result.items).toEqual(['test']);
  });

  it('should parse JSON array', () => {
    const result = parseJSONResponse<string[]>('["a","b","c"]');
    expect(result).toEqual(['a', 'b', 'c']);
  });

  it('should handle nested braces in strings', () => {
    const result = parseJSONResponse<{ text: string }>('{"text":"hello {world}"}');
    expect(result.text).toBe('hello {world}');
  });

  it('should handle escaped quotes in strings', () => {
    const result = parseJSONResponse<{ text: string }>('{"text":"he said \\"hello\\""}');
    expect(result.text).toBe('he said "hello"');
  });

  it('should throw on no JSON found', () => {
    expect(() => parseJSONResponse('no json here')).toThrow('No JSON object or array found');
  });

  it('should throw on malformed JSON', () => {
    expect(() => parseJSONResponse('{"items": [')).toThrow();
  });

  it('should handle JSON with trailing text', () => {
    const result = parseJSONResponse<{ items: string[] }>('{"items":["test"]} some trailing text');
    expect(result.items).toEqual(['test']);
  });
});
