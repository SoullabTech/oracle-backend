import { OracleAgent } from './oracleAgent.js';
import type { AgentResponse, Metadata } from './types.js';

export class ClientAgent extends OracleAgent {
  private clientId: string;

  constructor(clientId: string) {
    super();
    this.clientId = clientId;
  }

  async processQuery(query: string): Promise<AgentResponse> {
    const baseResponse = await super.processQuery(query);
    
    console.log(`[ClientAgent] Processing response for client: ${this.clientId}`);
    
    // Add client-specific personalization to the response
    const personalizedResponse = `${baseResponse.response}\n\nTailored for you, valued client.`;
    
    const updatedMetadata: Metadata = {
      ...(baseResponse.metadata || {}),
      timestamp: new Date().toISOString(),
      clientId: this.clientId
    };

    return {
      ...baseResponse,
      response: personalizedResponse,
      metadata: updatedMetadata,
      routingPath: [...(baseResponse.routingPath ?? []), 'clientAgent']
    };
  }
}