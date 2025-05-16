"use strict";

import { OracleAgent } from "./oracleAgent.js";
import { logOracleInsight } from "../../utils/oracleLogger.js";
import * as MemoryModule from "../../utils/memoryModule.js";import ModelService from "../../utils/modelService.js";
import type { AgentResponse } from "../../types/ai.js";

/**
 * DreamAgent: Embodies symbolic guidance, imagination, and messages from the subconscious.
 */
export class DreamAgent extends OracleAgent {
  constructor() {
    super({ debug: false });
  }

  public async processQuery(query: { input: string; userId?: string }): Promise<AgentResponse> {
    const contextMemory = MemoryModule.getRecentEntries(2);

    const dreamPrompt = `You are an oracle of dreams. Interpret the symbols and metaphors in the message with mystical depth.`;
    const contextHeader = contextMemory.length
      ? `🌙 Dream echoes:\n${contextMemory.map(e => `- ${e.response}`).join("\n")}\n\n`
      : "";

    const augmentedInput = `${dreamPrompt}\n\n${contextHeader}${query.input}`;

    const augmentedQuery = {
      ...query,
      input: augmentedInput,
    };

    const baseResponse: AgentResponse = await ModelService.getResponse(augmentedQuery);

    const personalityFlair = `\n\n🌀 What stirs in dreams often stirs the soul.`;
    const enhancedResponse = `${baseResponse.response}${personalityFlair}`;

    MemoryModule.addEntry({
      timestamp: new Date().toISOString(),
      query: query.input,
      response: enhancedResponse,
    });

    await logOracleInsight({
      anon_id: query.userId || null,
      archetype: baseResponse.metadata?.archetype || "Dreamer",
      element: "Aether",
      insight: {
        message: enhancedResponse,
        raw_input: query.input,
      },
      emotion: baseResponse.metadata?.emotion_score ?? 0.92,
      phase: baseResponse.metadata?.phase || "Dream Phase",
      context: contextMemory,
    });

    return {
      ...baseResponse,
      response: enhancedResponse,
      confidence: baseResponse.confidence ?? 0.92,
      routingPath: [...(baseResponse.routingPath || []), "dream-agent"],
    };
  }
}
