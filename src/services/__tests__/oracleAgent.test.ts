import { describe, it, expect, beforeEach, vi } from 'vitest';
import { OracleAgent } from '../OracleAgent';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

// Mocks must be declared before class instantiation
vi.mock('openai', () => ({
  default: vi.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: vi.fn(),
      },
    },
  })),
}));

vi.mock('@anthropic-ai/sdk', () => ({
  default: vi.fn().mockImplementation(() => ({
    messages: {
      create: vi.fn(),
    },
  })),
}));

describe('Oracle Agent Task Execution Tests', () => {
  let oracleAgent: OracleAgent;

  const config = {
    openaiApiKey: 'test-openai-key',
    anthropicApiKey: 'test-anthropic-key',
    defaultModel: 'gpt-4' as const,
    temperature: 0.7,
  };

  beforeEach(() => {
    oracleAgent = new OracleAgent(config);
    vi.clearAllMocks();
  });

  it('should perform a task successfully', async () => {
    const mockResponse = {
      choices: [{ message: { content: 'Successful response' } }],
      usage: { total_tokens: 42 },
    };

    const mockedOpenAI = (OpenAI as unknown as vi.Mock).mock.results[0].value;
    mockedOpenAI.chat.completions.create.mockResolvedValueOnce(mockResponse);

    const result = await oracleAgent.performTask('What is the meaning of life?');

    expect(result.content).toBe('Successful response');
    expect(result.metadata.tokens).toBe(42);
    expect(result.model).toBe('gpt-4-turbo-preview');
  });

  it('should handle errors correctly during task execution', async () => {
    const mockedOpenAI = (OpenAI as unknown as vi.Mock).mock.results[0].value;
    mockedOpenAI.chat.completions.create.mockRejectedValueOnce(new Error('Network failure'));

    await expect(oracleAgent.performTask('Broken input')).rejects.toThrow('OracleAgent error: Network failure');
  });
});
