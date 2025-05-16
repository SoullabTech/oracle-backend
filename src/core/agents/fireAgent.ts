// src/core/agents/fireAgent.ts

"use strict";

import { OracleAgent } from "./oracleAgent.js";
import { logOracleInsight } from "../../utils/oracleLogger.js";
import { getRelevantMemories, storeMemoryItem } from "../../services/memoryService.js";
import ModelService from "../../utils/modelService.js";
import type { AgentResponse } from "../../types/ai.js";
import * as MemoryModule from "../../utils/memoryModule.js";
/**
 * FireAgent: Embodies bold, transformative energy.
 */
export class FireAgent extends OracleAgent {
  public async processQuery(query: {
    input: string;
    userId?: string;
  }): Promise<AgentResponse> {
    const contextMemory = await getRelevantMemories(query.userId || "", 3);

    const contextHeader = contextMemory.length
      ? `⟳ Sparks of recent fire:\n${contextMemory
          .map((e) => `- ${e.response}`)
          .join("\n")}\n\n`
      : "";

    const augmentedInput = `${contextHeader}${query.input}`;
    const enhancedResponse = `${(
      await ModelService.getResponse({ ...query, input: augmentedInput })
    ).response}\n\n🔥 Like a blazing comet, let your vision ignite.`;

    await storeMemoryItem({
      clientId: query.userId || "",
      content: enhancedResponse,
      metadata: {},
    });

    await logOracleInsight({
      anon_id: query.userId || null,
      archetype: "Fire",
      element: "fire",
      insight: { message: enhancedResponse, raw_input: query.input },
      emotion: 0.9,
      phase: "ignition",
      context: contextMemory,
    });

    return {
      response: enhancedResponse,
      confidence: 0.95,
      metadata: {},
      routingPath: ["fire-agent"],
    };
  }
}
