"use strict";
import { OracleAgent } from "./oracleAgent.js";
import { logOracleInsight } from "../../utils/oracleLogger.js";
import * as MemoryModule from "../../utils/memoryModule.js";import ModelService from "../../utils/modelService.js";
import type { AgentResponse } from "../../types/ai.js";

/**
 * EarthAgent: Embodies grounded stability, practicality, and nurturing wisdom.
 */
export class EarthAgent extends OracleAgent {
  constructor() {
    super({ debug: false });
  }

  public async processQuery(query: { input: string; userId?: string }): Promise<AgentResponse> {
    const contextMemory = MemoryModule.getRecentEntries(3);

    const contextHeader = contextMemory.length
      ? `⟳ Footprints of grounded thought:\n${contextMemory.map(e => `- ${e.response}`).join("\n")}\n\n`
      : "";

    const augmentedInput = `${contextHeader}${query.input}`;
    const augmentedQuery = {
      ...query,
      input: augmentedInput,
    };

    const baseResponse: AgentResponse = await ModelService.getResponse(augmentedQuery);

    const personalityFlair = `\n\n🌱 Root your path in presence and let wisdom grow from the soil of experience.`;
    const enhancedResponse = `${baseResponse.response}${personalityFlair}`;

    MemoryModule.addEntry({
      timestamp: new Date().toISOString(),
      query: query.input,
      response: enhancedResponse,
    });

    await logOracleInsight({
      anon_id: query.userId || null,
      archetype: baseResponse.metadata?.archetype || "Earth",
      element: "Earth",
      insight: {
        message: enhancedResponse,
        raw_input: query.input,
      },
      emotion: baseResponse.metadata?.emotion_score ?? 0.89,
      phase: baseResponse.metadata?.phase || "Earth Phase",
      context: contextMemory,
    });

    return {
      ...baseResponse,
      response: enhancedResponse,
      confidence: baseResponse.confidence ?? 0.89,
      routingPath: [...(baseResponse.routingPath || []), "earth-agent"],
    };
  }
}
