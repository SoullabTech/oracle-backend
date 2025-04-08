// src/core/mainOracleAgent.ts
import { OracleAgent } from './oracleAgent.js';
import { detectElement, adjustGuidance } from './elementalFramework.js';
import { retrieveMemory } from '../memory/persistentMemory.js';
import { storeInsightMemory } from './unifiedMemory.js';
import { enhanceResponseWithMemory } from '../core/agent/memoryManager.ts';  // Correct import path
import { selectLLM, callLLM } from './dualLLMRouting.js';
import { runLangChain, triggerPrefectFlow } from './orchestrator.js';
import type { AgentResponse } from '../types.ts';  // Correct import path

// src/core/mainOracleAgent.ts

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
      metadata: baseResponse.metadata ?? {},  // Ensure metadata is initialized if it's undefined
      routingPath: [...(baseResponse.routingPath ?? []), 'mainOracleAgent'],
      confidence: 0.85  // Example confidence value, modify as necessary
    };

    // Add additional steps (LLM, memory enhancement, etc.) here...

    // Ensure we return the finalResponse object at the end
    return finalResponse;  // <-- Add return here
  }
}

