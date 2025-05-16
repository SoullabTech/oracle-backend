// src/core/agents/persistentMemory.ts

import { OracleAgent } from './oracleAgent.js';
import { getRelevantMemories, storeMemoryItem } from '../services/memoryService.js';
import type { MemoryItem } from '../types/memory.js';
import logger from '../utils/logger.js';

/**
 * PersistentMemoryAgent extends OracleAgent to incorporate user memory context into queries
 */
export class PersistentMemoryAgent extends OracleAgent {
  /**
   * Processes a query by retrieving relevant memories, running the base OracleAgent, and storing the result
   */
  async processWithMemory(params: { input: string; userId: string; }): Promise<any> {
    const { input, userId } = params;

    // Retrieve relevant past memories
    let memories: MemoryItem[] = [];
    try {
      memories = await getRelevantMemories(userId);
      logger.info(`Retrieved ${memories.length} memories for user ${userId}`);
    } catch (err) {
      logger.error('Failed to retrieve memories:', err);
    }

    // Augment input with memory context
    const augmentedInput = `${input}\n
Relevant Memories:\n${memories.map(m => `- ${m.content}`).join('\n')}`;

    // Run the OracleAgent with augmented input
    const response = await this.processQuery({ input: augmentedInput, userId, context: {} });

    // Store the new memory item
    try {
      const memoryItem: MemoryItem = {
        userId,
        content: input,
        timestamp: new Date().toISOString()
      };
      await storeMemoryItem(memoryItem);
      logger.info('Stored new memory item for user', userId);
    } catch (err) {
      logger.error('Failed to store memory item:', err);
    }

    return response;
  }
}
