import { OracleAgent } from './oracleAgent.js';
import type { AgentResponse, Metadata } from './types.js';

export class MainOracleAgent extends OracleAgent {
  async process(baseResponse: AgentResponse): Promise<AgentResponse> {
    console.log("[MainOracleAgent] Processing response");
    
    // Add main oracle processing logic here
    const enhancedResponse = `${baseResponse.response}\n\nThe Oracle has spoken.`;
    
    // Fix the metadata initialization with required timestamp
    const updatedMetadata: Metadata = {
      ...(baseResponse.metadata || {}),
      timestamp: new Date().toISOString()
    };
    
    return {
      ...baseResponse,
      response: enhancedResponse,
      confidence: baseResponse.confidence ?? 0.9,
      metadata: updatedMetadata,
      routingPath: [...(baseResponse.routingPath ?? []), 'mainOracleAgent']
    };
  }
}