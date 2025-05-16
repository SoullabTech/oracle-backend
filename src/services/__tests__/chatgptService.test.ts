import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getChatGPTResponse } from '../chatgptService.js';
import OpenAI from 'openai';

// Mock OpenAI
vi.mock('openai');

describe('ChatGPT Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should generate a response successfully', async () => {
    const mockCompletion = {
      choices: [{ message: { content: 'Test response' } }],
      usage: { total_tokens: 100 },
    };

    (OpenAI.prototype.chat.completions.create as any).mockResolvedValue(mockCompletion);

    const response = await getChatGPTResponse({
      query: 'Test query',
    });

    expect(response.content).toBe('Test response');
    expect(response.provider).toBe('openai');
    expect(response.model).toBe('gpt-4-turbo-preview');
    expect(response.metadata.tokens).toBe(100);
  });

  it('should include context in the request when provided', async () => {
    const mockCompletion = {
      choices: [{ message: { content: 'Test response' } }],
      usage: { total_tokens: 100 },
    };

    (OpenAI.prototype.chat.completions.create as any).mockResolvedValue(mockCompletion);

    await getChatGPTResponse({
      query: 'Test query',
      context: 'Additional context',
    });

    expect(OpenAI.prototype.chat.completions.create).toHaveBeenCalledWith(
      expect.objectContaining({
        messages: expect.arrayContaining([
          expect.objectContaining({
            role: 'system',
            content: 'Additional context',
          }),
        ]),
      })
    );
  });

  it('should handle custom options', async () => {
    const mockCompletion = {
      choices: [{ message: { content: 'Test response' } }],
      usage: { total_tokens: 100 },
    };

    (OpenAI.prototype.chat.completions.create as any).mockResolvedValue(mockCompletion);

    const options = {
      model: 'gpt-4',
      temperature: 0.5,
      maxTokens: 1000,
    };

    await getChatGPTResponse({
      query: 'Test query',
      options,
    });

    expect(OpenAI.prototype.chat.completions.create).toHaveBeenCalledWith(
      expect.objectContaining({
        model: options.model,
        temperature: options.temperature,
        max_tokens: options.maxTokens,
      })
    );
  });

  it('should handle errors gracefully', async () => {
    const mockError = new Error('API error');
    (OpenAI.prototype.chat.completions.create as any).mockRejectedValue(mockError);

    await expect(
      getChatGPTResponse({
        query: 'Test query',
      })
    ).rejects.toThrow('Failed to get ChatGPT response');
  });
});
