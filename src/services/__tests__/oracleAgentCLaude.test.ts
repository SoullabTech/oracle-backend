import { describe, it, expect, beforeEach, vi } from 'vitest';
import { OracleAgent } from '../OracleAgent.js';
import Anthropic from '@anthropic-ai/sdk';

vi.mock('@anthropic-ai/sdk', () => ({
  default: vi.fn().mockImplementation(() => ({
    messages: {
      create: vi.fn(),
    },
  })),
}));

describe('OracleAgent Claude Path Tests', () => {
  let oracleAgent: OracleAgent;

  const config = {
    openaiApiKey: 'fake-openai-key',
    anthropicApiKey: 'fake-anthropic-key',
    defaultModel: 'claude-3' as const,
    temperature: 0.6,
  };

  beforeEach(() => {
    oracleAgent = new OracleAgent(config);
    vi.clearAllMocks();
  });

  it('should return a valid response from Claude-3', async () => {
    const mockResponse = {
      content: [{ text: 'Claude insight activated' }],
      usage: { output_tokens: 88 },
    };

    const mockedAnthropic = (Anthropic as unknown as vi.Mock).mock.results[0].value;
    mockedAnthropic.messages.create.mockResolvedValueOnce(mockResponse);

    const result = await oracleAgent.performTask('Speak to me, Claude');

    expect(result.content).toBe('Claude insight activated');
    expect(result.model).toBe('claude-3-opus');
    expect(result.provider).toBe('anthropic');
    expect(result.metadata.tokens).toBe(88);
  });

  it('should throw an error if Claude-3 request fails', async () => {
    const mockedAnthropic = (Anthropic as unknown as vi.Mock).mock.results[0].value;
    mockedAnthropic.messages.create.mockRejectedValueOnce(new Error('Claude down'));

    await expect(oracleAgent.performTask('Broken Claude')).rejects.toThrow('OracleAgent error: Claude down');
  });
});
