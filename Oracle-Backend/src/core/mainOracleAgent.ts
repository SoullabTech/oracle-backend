import { OracleAgent } from './oracleAgent.js';
import type { AgentResponse, Metadata } from './types.js';

export class MainOracleAgent extends OracleAgent {
  async processQuery(query: string): Promise<AgentResponse> {
    const baseResponse = await super.processQuery(query);
    
    console.log("[MainOracleAgent] Processing response");
    
    const enhancedResponse = `${baseResponse.response}\n\nThe Oracle has spoken.`;
    
    const updatedMetadata: Metadata = {
      ...(baseResponse.metadata || { timestamp: new Date().toISOString() }),
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