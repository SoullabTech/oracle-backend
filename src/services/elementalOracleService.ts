// src/services/elementalOracleService.ts

import { env } from "../lib/config.js";
import logger from "../utils/logger.js";
import { logOracleInsight } from "../utils/oracleLogger.js";

export interface StoryRequest {
  elementalTheme: string;
  archetype: string;
  focusArea: string;
  depthLevel: number;
}

export interface StoryContext {
  userId: string;
  elementalProfile: {
    fire: number;
    water: number;
    earth: number;
    air: number;
    aether: number;
  };
  crystalFocus: Record<string, any>;
  memories?: any[];
  phase?: string;
}

export interface StoryResponse {
  narrative: string;
  reflections: string[];
  symbols: string[];
  [key: string]: any;
}

export class ElementalOracleService {
  private baseUrl = env.VITE_CHATGPT_ORACLE_URL;
  private apiKey = env.VITE_CHATGPT_ORACLE_API_KEY;

  async generateStory(
    request: StoryRequest,
    context: StoryContext
  ): Promise<StoryResponse> {
    const url = `${this.baseUrl}/storyRequest`;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        ...request,
        context: {
          userId: context.userId,
          elementalProfile: context.elementalProfile,
          crystalFocus: context.crystalFocus,
          phase: context.phase ?? "story",
          memories: context.memories,
        },
      }),
    });

    if (!res.ok) {
      throw new Error(`Story generation failed: ${res.status} ${res.statusText}`);
    }

    const data = (await res.json()) as StoryResponse;

    await logOracleInsight({
      anon_id: context.userId,
      archetype: request.archetype,
      element: request.elementalTheme,
      insight: {
        message: `Generated story with theme: ${request.elementalTheme}, archetype: ${request.archetype}`,
        raw_input: JSON.stringify(request),
      },
      emotion: 0.9,
      phase: context.phase ?? "story",
      context: context.memories,
    });

    logger.info("✨ Story generated successfully", {
      elementalTheme: request.elementalTheme,
      archetype: request.archetype,
      focusArea: request.focusArea,
      depthLevel: request.depthLevel,
    });

    return data;
  }

  async generateReflection(
    storyId: string,
    context: StoryContext
  ): Promise<string[]> {
    const url = `${this.baseUrl}/storyRequest/${storyId}/reflections`;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        context: {
          userId: context.userId,
          elementalProfile: context.elementalProfile,
          crystalFocus: context.crystalFocus,
          phase: context.phase,
          memories: context.memories,
        },
      }),
    });

    if (!res.ok) {
      throw new Error(
        `Reflection generation failed: ${res.status} ${res.statusText}`
      );
    }

    const payload = (await res.json()) as { reflections: string[] };

    await logOracleInsight({
      anon_id: context.userId,
      archetype: "Reflection",
      element: storyId,
      insight: {
        message: `Generated reflections for story: ${storyId}`,
        raw_input: storyId,
      },
      emotion: 0.85,
      phase: context.phase ?? "reflection",
      context: context.memories,
    });

    logger.info("🔍 Reflections generated successfully", { storyId });
    return payload.reflections;
  }
}

export const elementalOracle = new ElementalOracleService();
