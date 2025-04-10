import { OracleAgent } from './oracleAgent.js';
<<<<<<< HEAD
import type { AgentResponse, Metadata } from './types.js';
=======
import type { AgentResponse } from './types'; // ✅ Removed .js for TS compatibility
>>>>>>> 268cb604fe12a917c8e4d04e4a80dde66f880973

export class ClientAgent extends OracleAgent {
  private clientId: string;

  constructor(clientId: string) {
    super();
    this.clientId = clientId;
  }

<<<<<<< HEAD
  async processQuery(query: string): Promise<AgentResponse> {
    const baseResponse = await super.processQuery(query);
    
    console.log(`[ClientAgent] Processing response for client: ${this.clientId}`);
    
    // Add client-specific personalization to the response
    const personalizedResponse = `${baseResponse.response}\n\nTailored for you, valued client.`;
    
    const updatedMetadata: Metadata = {
      ...(baseResponse.metadata || {}),
      timestamp: new Date().toISOString(),
      clientId: this.clientId
=======
  /**
   * Processes a user query and customizes the OracleAgent's response.
   * @param query The user's query.
   * @returns A personalized AgentResponse.
   */
  async handleQuery(query: string): Promise<AgentResponse> {
    console.log(`[ClientAgent ${this.clientId}] Processing query: "${query}"`);
    const baseResponse = await this.oracleAgent.processQuery(query);

    const customizedResponse: AgentResponse = {
      ...baseResponse,
      response: `[Client ${this.clientId}] ${baseResponse.response}`,
      metadata: {
        ...baseResponse.metadata,
        clientId: this.clientId,
        personalized: true
      },
      routingPath: [...(baseResponse.routingPath ?? []), `client-${this.clientId}`]
>>>>>>> 268cb604fe12a917c8e4d04e4a80dde66f880973
    };

    return {
      ...baseResponse,
      response: personalizedResponse,
      metadata: updatedMetadata,
      routingPath: [...(baseResponse.routingPath ?? []), 'clientAgent']
    };
  }
}