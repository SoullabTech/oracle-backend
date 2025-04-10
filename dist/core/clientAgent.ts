import { AgentResponse } from './types.js';

export class ClientAgent {
  private clientId: string;

  constructor(clientId: string) {
    this.clientId = clientId;
  }

  async process(baseResponse: AgentResponse): Promise<AgentResponse> {
    console.log(`[ClientAgent] Processing response for client: ${this.clientId}`);
    
    // Add client-specific personalization to the response
    const personalizedResponse = `${baseResponse.response}\n\nTailored for client: ${this.clientId}`;
    
    return {
      response: personalizedResponse,
      confidence: baseResponse.confidence,
      metadata: {
        ...baseResponse.metadata,
        timestamp: new Date().toISOString(),
        clientId: this.clientId,
      },
      routingPath: baseResponse.routingPath ? 
        [...baseResponse.routingPath, 'clientAgent'] : 
        ['clientAgent']
    };
  }
}