import { getOracleResponse } from './oracleService';
import { storeMemoryItem, getAggregatedWisdom } from './memoryService';
import type { AIResponse } from '../types/ai';
import type { MemoryItem } from './memoryService';

interface QueryInput {
  input: string;
  userId: string;
}

export class MainOracleAgent {
  async processQuery(query: QueryInput): Promise<AIResponse> {
    try {
      // Get relevant wisdom before processing
      const wisdom = await getAggregatedWisdom(
        ['fire', 'water', 'earth', 'air', 'aether'],
        ['all'],
        0.7
      );

      // Get AI response with context from wisdom
      const response = await getOracleResponse(query.input, query.userId, wisdom);

      // Store the response as a memory item
      await storeMemoryItem({
        content: response.content,
        element: response.metadata.elementalAdjustments?.emphasis?.[0] || 'aether',
        sourceAgent: response.provider,
        userId: query.userId,
        confidence: response.confidence,
        metadata: {
          ...response.metadata,
          query: query.input,
        },
      });

      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to process query');
    }
  }
}

export const oracle = new MainOracleAgent();