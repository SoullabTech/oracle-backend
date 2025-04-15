import { MainOracleAgent } from '../OracleAgent';
import { updateUserProfile } from '../profileService';
import { getOracleResponse } from '../oracleService';
import type { AIResponse } from '../../types/ai';
import type { ElementalProfile } from '../../types/survey';

// Mock dependencies
jest.mock('../profileService');
jest.mock('../oracleService');

describe('MainOracleAgent Integration', () => {
  const agent = new MainOracleAgent();
  const mockUserId = 'user-123';

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
    user_id: mockUserId,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const mockResponse: AIResponse = {
    content: 'Test response with spiritual guidance',
    provider: 'openai',
    model: 'gpt-4',
    confidence: 0.9,
    metadata: {
      tokens: 100,
      processingTime: 500,
      elementalAdjustments: {
        tone: 'mystical',
        style: 'intuitive',
        emphasis: ['spirituality', 'transcendence'],
      },
    },
  };

  beforeAll(async () => {
    // Set up mock profile
    (updateUserProfile as jest.Mock).mockResolvedValue(mockProfile);
    (getOracleResponse as jest.Mock).mockResolvedValue(mockResponse);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should process query with personality adjustment', async () => {
    const query = { input: 'Tell me a creative story', userId: mockUserId };
    const response = await agent.processQuery(query);

    // Verify the response structure
    expect(response).toHaveProperty('content');
    expect(response).toHaveProperty('metadata');
    expect(response).toHaveProperty('provider');
    expect(response).toHaveProperty('model');
    expect(response).toHaveProperty('confidence');

    // Verify oracle service was called with correct parameters
    expect(getOracleResponse).toHaveBeenCalledWith(query.input, query.userId);

    // Verify response contains personality adjustments
    expect(response.metadata.elementalAdjustments).toBeDefined();
    expect(response.metadata.elementalAdjustments?.tone).toBe('mystical');
    expect(response.metadata.elementalAdjustments?.style).toBe('intuitive');
  });

  it('should handle errors gracefully', async () => {
    const query = { input: 'Invalid query', userId: 'invalid-user' };
    (getOracleResponse as jest.Mock).mockRejectedValue(new Error('User not found'));

    await expect(agent.processQuery(query)).rejects.toThrow('User not found');
  });

  it('should include crystal focus context in response', async () => {
    const query = { input: 'Guide me', userId: mockUserId };
    const response = await agent.processQuery(query);

    expect(response.metadata).toHaveProperty('elementalAdjustments');
    expect(response.metadata.elementalAdjustments?.emphasis).toContain('spirituality');
  });

  it('should preserve original response metadata', async () => {
    const query = { input: 'Test query', userId: mockUserId };
    const response = await agent.processQuery(query);

    expect(response.provider).toBe(mockResponse.provider);
    expect(response.model).toBe(mockResponse.model);
    expect(response.confidence).toBe(mockResponse.confidence);
    expect(response.metadata.tokens).toBe(mockResponse.metadata.tokens);
    expect(response.metadata.processingTime).toBe(mockResponse.metadata.processingTime);
  });

  it('should handle missing crystal focus gracefully', async () => {
    const profileWithoutFocus = { ...mockProfile, crystal_focus: null };
    (updateUserProfile as jest.Mock).mockResolvedValueOnce(profileWithoutFocus);

    const query = { input: 'Test query', userId: mockUserId };
    const response = await agent.processQuery(query);

    expect(response).toBeDefined();
    expect(response.metadata.elementalAdjustments).toBeDefined();
  });
});