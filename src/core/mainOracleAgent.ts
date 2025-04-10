import { OracleAgent } from './oracleAgent.js';
<<<<<<< HEAD
import type { AgentResponse, Metadata } from './types.js';

export class MainOracleAgent extends OracleAgent {
  async process(baseResponse: AgentResponse): Promise<AgentResponse> {
    console.log("[MainOracleAgent] Processing response");
    
    // Add main oracle processing logic here
    const enhancedResponse = `${baseResponse.response}\n\nThe Oracle has spoken.`;
    
    // Fix the metadata initialization with required timestamp
    const updatedMetadata: Metadata = {
      ...(baseResponse.metadata || {}),
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
=======
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
>>>>>>> 268cb604fe12a917c8e4d04e4a80dde66f880973
