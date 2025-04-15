import { getAIResponse } from '../aiService';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import type { ElementalProfile } from '../../types/survey';

// Mock OpenAI and Anthropic
jest.mock('openai');
jest.mock('@anthropic-ai/sdk');

describe('AI Service', () => {
  const mockProfile: ElementalProfile = {
    fire: 80,
    water: 60,
    earth: 70,
    air: 50,
    aether: 40,
    crystal_focus: {
      type: 'spiritual',
      challenges: 'Finding inner peace',
      aspirations: 'Deeper connection with self',
    },
    user_id: 'test-user',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should route creative queries to Anthropic', async () => {
    const query = 'Imagine a story about a magical journey';
    const mockAnthropicResponse = {
      content: [{ text: 'Creative response' }],
      usage: { output_tokens: 100 },
    };

    (Anthropic.prototype.messages.create as jest.Mock).mockResolvedValue(mockAnthropicResponse);

    const response = await getAIResponse(query, 'test-user', mockProfile);

    expect(response.provider).toBe('anthropic');
    expect(response.model).toBe('claude-3-opus');
    expect(Anthropic.prototype.messages.create).toHaveBeenCalled();
  });

  it('should route analytical queries to OpenAI', async () => {
    const query = 'Analyze the implications of quantum computing';
    const mockOpenAIResponse = {
      choices: [{ message: { content: 'Analytical response' } }],
      usage: { total_tokens: 150 },
    };

    (OpenAI.prototype.chat.completions.create as jest.Mock).mockResolvedValue(mockOpenAIResponse);

    const response = await getAIResponse(query, 'test-user', mockProfile);

    expect(response.provider).toBe('openai');
    expect(response.model).toBe('gpt-4-turbo-preview');
    expect(OpenAI.prototype.chat.completions.create).toHaveBeenCalled();
  });

  it('should consider elemental profile in routing', async () => {
    const spiritualProfile = {
      ...mockProfile,
      aether: 90,
      crystal_focus: {
        type: 'spiritual',
        challenges: 'Finding meaning',
        aspirations: 'Spiritual growth',
      },
    };

    const query = 'Guide me on my spiritual journey';
    const mockAnthropicResponse = {
      content: [{ text: 'Spiritual guidance' }],
      usage: { output_tokens: 120 },
    };

    (Anthropic.prototype.messages.create as jest.Mock).mockResolvedValue(mockAnthropicResponse);

    const response = await getAIResponse(query, 'test-user', spiritualProfile);

    expect(response.provider).toBe('anthropic');
    expect(response.model).toBe('claude-3-opus');
    expect(response.metadata.routingCriteria.queryType).toBe('spiritual');
  });

  it('should handle complex queries appropriately', async () => {
    const complexQuery = 'Can you provide a detailed analysis of the interconnections between quantum mechanics, consciousness, and spiritual experiences, considering both scientific and metaphysical perspectives?';
    const mockOpenAIResponse = {
      choices: [{ message: { content: 'Complex analysis' } }],
      usage: { total_tokens: 200 },
    };

    (OpenAI.prototype.chat.completions.create as jest.Mock).mockResolvedValue(mockOpenAIResponse);

    const response = await getAIResponse(complexQuery, 'test-user', mockProfile);

    expect(response.metadata.routingCriteria.queryComplexity).toBeGreaterThan(0.5);
    expect(response.confidence).toBeLessThan(1);
  });

  it('should include routing criteria in metadata', async () => {
    const query = 'How do I solve this problem?';
    const mockOpenAIResponse = {
      choices: [{ message: { content: 'Solution steps' } }],
      usage: { total_tokens: 80 },
    };

    (OpenAI.prototype.chat.completions.create as jest.Mock).mockResolvedValue(mockOpenAIResponse);

    const response = await getAIResponse(query, 'test-user', mockProfile);

    expect(response.metadata.routingCriteria).toBeDefined();
    expect(response.metadata.routingCriteria.elementalProfile).toBeDefined();
    expect(response.metadata.routingCriteria.queryComplexity).toBeDefined();
    expect(response.metadata.routingCriteria.queryType).toBeDefined();
  });
});