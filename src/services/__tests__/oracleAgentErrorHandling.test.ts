// src/services/__tests__/oracleAgentErrorHandling.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { OracleAgent } from '../OracleAgent.js';
import OpenAI from 'openai';

// Mock OpenAI properly
vi.mock('openai', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      chat: {
        completions: {
          create: vi.fn(),
        },
      },
    })),
  };
});

describe('Oracle Agent Error Handling Tests', () => {
  let oracleAgent: OracleAgent;
  let mockedOpenAIInstance: any;

  const config = {
    openaiApiKey: 'test-openai-key',
    anthropicApiKey: 'test-anthropic-key',
    defaultModel: 'gpt-4' as const,
    temperature: 0.7,
  };

  beforeEach(() => {
    oracleAgent = new OracleAgent(config);
    mockedOpenAIInstance = (OpenAI as unknown as vi.Mock).mock.results[0].value;
    vi.clearAllMocks();
  });

  it('should return empty string if response content is missing', async () => {
    const mockEmpty = {
      choices: [{ message: {} }],
      usage: { total_tokens: 20 },
    };

    mockedOpenAIInstance.chat.completions.create.mockResolvedValueOnce(mockEmpty);

    const result = await oracleAgent.performTask();

    expect(result.content).toBe('');
    expect(result.model).toBe('gpt-4-turbo-preview');
  });

  it('should handle null API response gracefully', async () => {
    mockedOpenAIInstance.chat.completions.create.mockResolvedValueOnce(null);

    await expect(oracleAgent.performTask()).rejects.toThrow();
  });

  it('should handle missing choices array in response', async () => {
    const mockBad = { choices: null };
    mockedOpenAIInstance.chat.completions.create.mockResolvedValueOnce(mockBad);

    await expect(oracleAgent.performTask()).rejects.toThrow();
  });

  it('should handle API timeout or delay errors', async () => {
    mockedOpenAIInstance.chat.completions.create.mockRejectedValueOnce(new Error('Timeout'));

    await expect(oracleAgent.performTask()).rejects.toThrow('Timeout');
  });
});
