import { OracleAgent } from './oracleAgent';
import type { AgentResponse, Metadata } from '../../types';
import { enhanceResponseWithMemory } from '../agent/memoryManager';

export class MentorAgent extends OracleAgent {
  async processQuery(query: string): Promise<AgentResponse> {
    const baseResponse = await super.processQuery(query);
    
    console.log("[MentorAgent] Processing response");
    
    const mentorResponse = `${baseResponse.response}\n\nMentor's wisdom: Apply this knowledge mindfully.`;
    const enhancedResponse = await enhanceResponseWithMemory(mentorResponse);
    
    const updatedMetadata: Metadata = {
      ...(baseResponse.metadata || {}),
      timestamp: new Date().toISOString(),
      mentor: true
    };

    return {
      ...baseResponse,
      response: enhancedResponse,
      metadata: updatedMetadata,
      routingPath: [...(baseResponse.routingPath ?? []), 'mentorAgent'],
      memoryEnhanced: true
    };
  }
}