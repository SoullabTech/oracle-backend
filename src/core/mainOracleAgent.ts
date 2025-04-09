// src/core/mainOracleAgent.ts
import { OracleAgent } from './oracleAgent.js';
import { detectElement, adjustGuidance } from './elementalFramework.js';
import { retrieveMemory } from '../memory/persistentMemory.js';
import { storeInsightMemory } from './unifiedMemory.js';
import { enhanceResponseWithMemory } from '../core/agent/memoryManager';  // ✅ removed `.ts`
import { selectLLM, callLLM } from './dualLLMRouting.js';
import type { AgentResponse } from './types.js';  // ✅ removed `.ts`

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

    // Step 1: Get base response from OracleAgent
    const baseResponse = await this.oracleAgent.processQuery(query);

    // Step 2: Adjust response with elemental guidance
    const adjusted = adjustGuidance(query, baseResponse.response);
    const element = detectElement(query);

    // Initialize metadata if it's undefined
    let finalResponse: AgentResponse = {
      ...baseResponse,
      response: adjusted,
      metadata: baseResponse.metadata ?? {},
      routingPath: [...(baseResponse.routingPath ?? []), 'mainOracleAgent'],
      confidence: 0.85
    };

    return finalResponse;
  }
}
