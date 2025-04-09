// src/core/mainOracleAgent.ts

import { OracleAgent } from './oracleAgent.js';
import { detectElement, adjustGuidance } from './elementalFramework.js';
import type { AgentResponse } from './types.js';

export class MainOracleAgent {
  oracleAgent: OracleAgent;
  debug: boolean;

  constructor(options: { debug?: boolean } = {}) {
    this.debug = options.debug ?? false;
    this.oracleAgent = new OracleAgent({ debug: this.debug });
  }

  async processQuery(query: string): Promise<AgentResponse> {
    if (this.debug) {
      console.log('[MainOracleAgent] Received query:', query);
    }

    // Step 1: Get the base response from OracleAgent
    const baseResponse = await this.oracleAgent.processQuery(query);

    // Step 2: Adjust the response with elemental guidance
    const adjustedResponse = adjustGuidance(query, baseResponse.response);
    const element = detectElement(query);
    if (this.debug) {
      console.log('[MainOracleAgent] Detected element:', element);
    }

    // Construct and return the final response
    const finalResponse: AgentResponse = {
      ...baseResponse,
      response: adjustedResponse,
      metadata: baseResponse.metadata ?? { timestamp: new Date().toISOString() },
      routingPath: [...(baseResponse.routingPath ?? []), 'mainOracleAgent'],
      confidence: 0.85
    };

    return finalResponse;
  }
}
