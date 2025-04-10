import { OracleAgent } from './oracleAgent';
import type { AgentResponse } from './types';

export class MentorAgent extends OracleAgent {
  async processQuery(query: string): Promise<AgentResponse> {
    const baseResponse = await super.processQuery(query);
    
    console.log("[MentorAgent] Processing response");
    
    // Add mentor-specific guidance to the response
    const mentorResponse = `${baseResponse.response}\n\nMentor's wisdom: Apply this knowledge mindfully.`;
    
    const updatedMetadata = {
      ...(baseResponse.metadata || {}),
      timestamp: new Date().toISOString(),
      mentor: true
    };

    return {
      ...baseResponse,
      response: mentorResponse,
      metadata: updatedMetadata,
      routingPath: [...(baseResponse.routingPath ?? []), 'mentorAgent']
    };
  }
}
