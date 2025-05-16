// src/core/agents/aetherAgent.ts

"use strict";

import { OracleAgent } from "./oracleAgent.js";
import { logOracleInsight } from "../../utils/oracleLogger.js";
import * as MemoryModule from "../../utils/memoryModule.js";
import ModelService from "../../utils/modelService.js";
import type { AgentResponse } from "../../types/ai.js";

/**
 * AetherAgent: Embodies integration of all elements and subtle synthesis.
 */
export class AetherAgent extends OracleAgent {
  public async processQuery(query: {
    input: string;
    userId?: string;
  }): Promise<AgentResponse> {
    // 🔮 Retrieve recent aether (integrative) memories
    const contextMemory = MemoryModule.getRecentEntries(3);

    const contextHeader = contextMemory.length
      ? `✨ Weaving threads of past insights:\n${contextMemory
          .map((e) => `- ${e.response}`)
          .join("\n")}\n\n`
      : "";

    const augmentedInput = `${contextHeader}${query.input}`;
    const baseResponse = await ModelService.getResponse({ ...query, input: augmentedInput });
    const personalityFlair = "\n\n🌟 Let the harmonies of the elements guide your path.";
    const enhancedResponse = `${baseResponse.response}${personalityFlair}`;

    // 🧠 Save Aether memory
    MemoryModule.addEntry({
      timestamp: new Date().toISOString(),
      query: query.input,
      response: enhancedResponse,
    });

    // 🔍 Log Aether insight
    await logOracleInsight({
      anon_id: query.userId || null,
      archetype: baseResponse.metadata?.archetype || "Aether",
      element: "aether",
      insight: {
        message: enhancedResponse,
        raw_input: query.input,
      },
      emotion: baseResponse.metadata?.emotion_score ?? 0.9,
      phase: baseResponse.metadata?.phase || "integration",
      context: contextMemory,
    });

    return {
      ...baseResponse,
      response: enhancedResponse,
      confidence: baseResponse.confidence ?? 0.93,
      routingPath: [...(baseResponse.routingPath || []), "aether-agent"],
    };
  }
}
