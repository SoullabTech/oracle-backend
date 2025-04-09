// src/core/clientAgent.ts
import type { AgentResponse } from './types';  // Use a leading './'
import { OracleAgent } from './oracleAgent.js';

export class ClientAgent {
  clientId: string;
  oracleAgent: OracleAgent;

  constructor(clientId: string, debug = false) {
    this.clientId = clientId;
    this.oracleAgent = new OracleAgent({ debug });
  }

  async handleQuery(query: string): Promise<AgentResponse> {
    console.log(`[ClientAgent ${this.clientId}] Processing query: "${query}"`);
    const baseResponse = await this.oracleAgent.processQuery(query);

    return {
      ...baseResponse,
      response: `[Client ${this.clientId}] ${baseResponse.response}`,
      routingPath: [...(baseResponse.routingPath ?? []), `client-${this.clientId}`]
    };
  }
}
