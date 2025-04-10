import { OracleAgent } from './oracleAgent.js';
import type { AgentResponse, Metadata } from './types'; // ✅ Removed .js for TS compatibility

export class ClientAgent extends OracleAgent {
  private clientId: string;

  constructor(clientId: string) {
    super();
    this.clientId = clientId;
  }

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
    };

    return {
      ...baseResponse,
      response: customizedResponse.response,
      metadata: customizedResponse.metadata,
      routingPath: customizedResponse.routingPath
    };
  }
}
