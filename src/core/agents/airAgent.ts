"use strict";

import { OracleAgent } from "./oracleAgent";
import { logOracleInsight } from '../../utils/oracleLogger';
import MemoryModule from "../../utils/memoryModule";
import ModelService from "../../utils/modelService";
import type { AgentResponse } from "./types";

/**
 * AirAgent: Embodies intellectual clarity, higher perspective, and swift understanding.
 */
export class AirAgent extends OracleAgent {
  constructor() {
    super({ debug: false });
  }

  public async processQuery(query: { input: string; userId?: string }): Promise<AgentResponse> {
    const contextMemory = MemoryModule.getRecentEntries(3);

    const contextHeader = contextMemory.length
      ? `⟳ Whispers on the wind:\n${contextMemory.map(e => `- ${e.response}`).join("\n")}\n\n`
      : "";

    const augmentedInput = `${contextHeader}${query.input}`;
    const augmentedQuery = {
      ...query,
      input: augmentedInput,
    };

    const baseResponse: AgentResponse = await ModelService.getResponse(augmentedQuery);

    const personalityFlair = `\n\n🌬️ Let ideas soar—your thoughts shape the horizon.`;
    const enhancedResponse = `${baseResponse.response}${personalityFlair}`;

    MemoryModule.addEntry({
      timestamp: new Date().toISOString(),
      query: query.input,
      response: enhancedResponse,
    });

    await logOracleInsight({
      anon_id: query.userId || null,
      archetype: baseResponse.metadata?.archetype || "Air",
      element: "Air",
      insight: {
        message: enhancedResponse,
        raw_input: query.input,
      },
      emotion: baseResponse.metadata?.emotion_score ?? 0.86,
      phase: baseResponse.metadata?.phase || "Air Phase",
      context: contextMemory,
    });

    return {
      ...baseResponse,
      response: enhancedResponse,
      confidence: baseResponse.confidence ?? 0.86,
      routingPath: [...(baseResponse.routingPath || []), "air-agent"],
    };
  }
}
