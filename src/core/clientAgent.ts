// src/clientAgent.ts
import { OracleAgent } from './oracleAgent.js';
import type { AgentResponse } from '../types/index.js';

export class ClientAgent {
  clientId: string;
  oracleAgent: OracleAgent;

  constructor(clientId: string, debug = false) {
    this.clientId = clientId;
    this.oracleAgent = new OracleAgent({ debug });
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
      routingPath: [...baseResponse.routingPath, `client-${this.clientId}`]
    };

    return customizedResponse;
  }
}
