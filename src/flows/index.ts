import type { Session, MemoryItem, SessionStats } from '../types/index.js';
import { SessionService } from '../services/sessionService.js';
import { MemoryService } from '../services/memoryService.js';
import { MetaService } from '../services/metaService.js';

export class FlowManager {
  private sessionService: SessionService;
  private memoryService: MemoryService;

  constructor() {
    this.sessionService = new SessionService();
    this.memoryService = new MemoryService();
  }

  async startLearningFlow(clientId: string): Promise<{
    session: Session;
    initialMemory: MemoryItem;
  }> {
    try {
      // Create a new session
      const session = await this.sessionService.createSession(clientId);

      // Initialize with a starting memory
      const initialMemory = await this.memoryService.storeMemory({
        content: 'Learning flow initiated',
        clientId,
        metadata: MetaService.createMeta(),
        timestamp: new Date().getTime()
      });

      return {
        session,
        initialMemory
      };
    } catch (error) {
      console.error('Error in learning flow:', error);
      throw new Error('Failed to start learning flow');
    }
  }

  async processInteractionFlow(
    clientId: string,
    sessionId: string,
    content: string
  ): Promise<{
    memory: MemoryItem;
    insights: string[];
  }> {
    try {
      // Store the interaction memory
      const memory = await this.memoryService.storeMemory({
        content,
        clientId,
        metadata: MetaService.createMeta(),
        timestamp: new Date().getTime()
      });

      // Generate insights based on stored memories
      const insights = await this.memoryService.getMemoryInsights(clientId);

      return {
        memory,
        insights
      };
    } catch (error) {
      console.error('Error in interaction flow:', error);
      throw new Error('Failed to process interaction');
    }
  }

  async completeLearningFlow(
    clientId: string,
    sessionId: string
  ): Promise<{
    sessionStats: SessionStats;
    finalInsights: string[];
  }> {
    try {
      // End the session
      await this.sessionService.endSession(sessionId, clientId);

      // Get final statistics and insights
      const [sessionStats, finalInsights] = await Promise.all([
        this.sessionService.getSessionStats(clientId),
        this.memoryService.getMemoryInsights(clientId)
      ]);

      return {
        sessionStats,
        finalInsights
      };
    } catch (error) {
      console.error('Error completing learning flow:', error);
      throw new Error('Failed to complete learning flow');
    }
  }
}