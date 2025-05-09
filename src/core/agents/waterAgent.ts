"use strict";

import { OracleAgent } from './oracleAgent';
import { logOracleInsight } from '../../utils/oracleLogger';
import MemoryModule from "../../utils/memoryModule";
import ModelService from '../../utils/modelService';
import type { AgentResponse } from './types';


/**
 * WaterAgent: Embodies emotional depth, reflection, and intuitive flow.
 */
export class WaterAgent extends OracleAgent {
  constructor() {
    super({ debug: false });
  }

  public async processQuery(query: { input: string; userId?: string }): Promise<AgentResponse> {
    const contextMemory = MemoryModule.getRecentEntries(3);

    const contextHeader = contextMemory.length
      ? `⟳ Ripples of past reflection:\n${contextMemory.map(e => `- ${e.response}`).join("\n")}\n\n`
      : "";

    const augmentedInput = `${contextHeader}${query.input}`;
    const augmentedQuery = {
      ...query,
      input: augmentedInput,
    };

    const baseResponse: AgentResponse = await ModelService.getResponse(augmentedQuery);

    const personalityFlair = `\n\n💧 Let stillness reveal your truth beneath the surface.`;
    const enhancedResponse = `${baseResponse.response}${personalityFlair}`;

    MemoryModule.addEntry({
      timestamp: new Date().toISOString(),
      query: query.input,
      response: enhancedResponse,
    });

    await logOracleInsight({
      anon_id: query.userId || null,
      archetype: baseResponse.metadata?.archetype || "Water",
      element: "Water",
      insight: {
        message: enhancedResponse,
        raw_input: query.input,
      },
      emotion: baseResponse.metadata?.emotion_score ?? 0.87,
      phase: baseResponse.metadata?.phase || "Water Phase",
      context: contextMemory,
    });

    return {
      ...baseResponse,
      response: enhancedResponse,
      confidence: baseResponse.confidence ?? 0.87,
      routingPath: [...(baseResponse.routingPath || []), "water-agent"],
    };
  }
}
