// src/core/agents/waterAgent.ts

"use strict";

import { OracleAgent } from "./oracleAgent.js";
import { logOracleInsight } from "../../utils/oracleLogger.js";
import * as MemoryModule from "../../utils/memoryModule.js";
import ModelService from "../../utils/modelService.js";
import type { AgentResponse } from "../../types/ai.js";

/**
 * WaterAgent: Embodies flow, healing, and reflection.
 */
export class WaterAgent extends OracleAgent {
  public async processQuery(query: {
    input: string;
    userId?: string;
  }): Promise<AgentResponse> {
    // 💧 Retrieve recent water memories
    const contextMemory = MemoryModule.getRecentEntries(3);

    const contextHeader = contextMemory.length
      ? `🌊 Echoes of flow:\n${contextMemory
          .map((e) => `- ${e.response}`)
          .join("\n")}\n\n`
      : "";

    const augmentedInput = `${contextHeader}${query.input}`;
    const baseResponse = await ModelService.getResponse({ ...query, input: augmentedInput });
    const personalityFlair = "\n\n💧 Let your emotions ripple with clarity.";
    const enhancedResponse = `${baseResponse.response}${personalityFlair}`;

    // 🧠 Save Water memory
    MemoryModule.addEntry({
      timestamp: new Date().toISOString(),
      query: query.input,
      response: enhancedResponse,
    });

    // 🔍 Log Water insight
    await logOracleInsight({
      anon_id: query.userId || null,
      archetype: baseResponse.metadata?.archetype || "Water",
      element: "water",
      insight: {
        message: enhancedResponse,
        raw_input: query.input,
      },
      emotion: baseResponse.metadata?.emotion_score ?? 0.88,
      phase: baseResponse.metadata?.phase || "flow",
      context: contextMemory,
    });

    return {
      ...baseResponse,
      response: enhancedResponse,
      confidence: baseResponse.confidence ?? 0.90,
      routingPath: [...(baseResponse.routingPath || []), "water-agent"],
    };
  }
}
