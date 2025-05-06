"use strict";

import { OracleAgent } from "./oracleAgent";
import { logOracleInsight } from '../../utils/oracleLogger';
import MemoryModule from "../../utils/memoryModule";
import ModelService from '../../utils/modelService.ts';
import type { AgentResponse } from "../../types/ai";

/**
 * FireAgent: Embodies bold, transformative energy.
 */
export class FireAgent extends OracleAgent {
  public async processQuery(query: { input: string; userId?: string }): Promise<AgentResponse> {
    // 🔥 Retrieve fire memory context
    const contextMemory = MemoryModule.getRecentEntries(3);

    const contextHeader = contextMemory.length
      ? `⟳ Sparks of recent fire:\n${contextMemory.map(e => `- ${e.response}`).join("\n")}\n\n`
      : "";

    const augmentedInput = `${contextHeader}${query.input}`;
    const augmentedQuery = {
      ...query,
      input: augmentedInput,
    };

    // 🔥 Get response from Fire model
    const baseResponse: AgentResponse = await ModelService.getResponse(augmentedQuery);

    const personalityFlair = "\n\n🔥 Like a blazing comet, let your vision ignite.";
    const enhancedResponse = `${baseResponse.response}${personalityFlair}`;

    // 🧠 Save Fire memory
    MemoryModule.addEntry({
      timestamp: new Date().toISOString(),
      query: query.input,
      response: enhancedResponse,
    });

    // 🔍 Log Fire insight
    await logOracleInsight({
      anon_id: query.userId || null,
      archetype: baseResponse.metadata?.archetype || "Fire",
      element: "fire",
      insight: {
        message: enhancedResponse,
        raw_input: query.input,
      },
      emotion: baseResponse.metadata?.emotion_score ?? 0.9,
      phase: baseResponse.metadata?.phase || "ignition",
      context: contextMemory,
    });

    return {
      ...baseResponse,
      response: enhancedResponse,
      confidence: baseResponse.confidence ?? 0.95,
      routingPath: [...(baseResponse.routingPath || []), "fire-agent"],
    };
  }
}
