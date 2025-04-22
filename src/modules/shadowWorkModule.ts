import { getAIResponse } from "../services/aiService";
import { queryChatGPTOracle } from "../services/chatgptOracleService";
import { elementalOracle } from "../services/elementalOracleService";

import { getUserProfile } from "../services/profileService";
import { getPersonalityWeights } from "../services/monitoringService";
import {
  storeMemoryItem,
  getRelevantMemories,
} from "../services/memoryService";
import { logOracleInsight } from "../utils/oracleLogger";
import { runShadowWork } from "../modules/shadowWorkModule";
import { scoreQuery } from "../utils/agentScoreUtil";

import { FireAgent } from "../core/agents/fireAgent";
import { WaterAgent } from "../core/agents/waterAgent";
import { EarthAgent } from "../core/agents/earthAgent";
import { AirAgent } from "../core/agents/airAgent";
import { AetherAgent } from "../core/agents/aetherAgent";

import { FacilitatorAgent } from "../core/agents/facilitatorAgent";
import { MentorAgent } from "../core/agents/mentorAgent";
import { DreamAgent } from "../core/agents/dreamAgent";
import { ShadowAgent } from "../core/agents/shadowAgent";

import logger from "../utils/logger";
import type { AIResponse } from "../types/ai";
import type { StoryRequest, OracleContext } from "../types/oracle";

interface QueryInput {
  input: string;
  userId: string;
  context?: Record<string, unknown>;
}

export class MainOracleAgent {
  private fireAgent = new FireAgent();
  private waterAgent = new WaterAgent();
  private earthAgent = new EarthAgent();
  private airAgent = new AirAgent();
  private aetherAgent = new AetherAgent();
  private facilitatorAgent = new FacilitatorAgent("facilitator-001");
  private mentorAgent = new MentorAgent();
  private dreamAgent = new DreamAgent();
  private shadowAgent = new ShadowAgent();

  async processQuery(query: QueryInput): Promise<AIResponse> {
    try {
      logger.info("Processing query", {
        metadata: { userId: query.userId, queryLength: query.input.length },
      });

      const [profile, weights, relevantMemories] = await Promise.all([
        getUserProfile(query.userId),
        getPersonalityWeights(),
        getRelevantMemories(query.userId, 5),
      ]);

      if (!profile) throw new Error("User profile not found");

      // 1. Story branch
      const storyRequest = this.parseStoryRequest(query.input);
      if (storyRequest) {
        const context: OracleContext = {
          elementalProfile: profile,
          crystalFocus: profile.crystal_focus,
          memories: relevantMemories,
        };

        const story = await elementalOracle.generateStory(
          storyRequest,
          context,
        );
        const finalResponse: AIResponse = {
          content: this.formatStoryResponse(story),
          provider: "elemental-oracle",
          model: "gpt-4",
          confidence: 0.9,
          metadata: {
            storyRequest,
            reflections: story.reflections,
            symbols: story.symbols,
          },
        };

        await this.storeExchange(query.userId, query.input, finalResponse);
        await logOracleInsight({
          anon_id: query.userId,
          archetype: storyRequest.archetype,
          element: storyRequest.elementalTheme,
          insight: finalResponse.content,
          emotion: 0.75,
          phase: "story",
        });

        return finalResponse;
      }

      // 2. Shadow work
      const shadowInsight = await this.shadowAgent.processQuery(query);
      if (shadowInsight) {
        logger.info("Shadow insight surfaced", { userId: query.userId });
        return shadowInsight;
      }

      // 3. Elemental Routing
      const scores = scoreQuery(query.input);
      let chosenAgent = this.aetherAgent;
      let maxScore = scores.aether;

      if (scores.fire > maxScore) {
        maxScore = scores.fire;
        chosenAgent = this.fireAgent;
        logger.info("Routing to FireAgent");
      }
      if (scores.water > maxScore) {
        maxScore = scores.water;
        chosenAgent = this.waterAgent;
        logger.info("Routing to WaterAgent");
      }
      if (scores.earth > maxScore) {
        maxScore = scores.earth;
        chosenAgent = this.earthAgent;
        logger.info("Routing to EarthAgent");
      }
      if (scores.air > maxScore) {
        maxScore = scores.air;
        chosenAgent = this.airAgent;
        logger.info("Routing to AirAgent");
      }
      if (chosenAgent === this.aetherAgent) {
        logger.info("Routing to AetherAgent (default)");
      }

      // 4. Elemental + Dream + Mentor composite path
      let elementalResponse = await chosenAgent.processQuery(query);
      elementalResponse = await this.dreamAgent.processQuery({
        ...query,
        input: elementalResponse.response || elementalResponse.content,
      });
      elementalResponse = await this.mentorAgent.processQuery({
        ...query,
        input: elementalResponse.response || elementalResponse.content,
      });

      await this.storeExchange(query.userId, query.input, elementalResponse);
      await logOracleInsight({
        anon_id: query.userId,
        element: elementalResponse.metadata?.element || "aether",
        insight: elementalResponse.response || elementalResponse.content,
        emotion: elementalResponse.confidence ?? 0.9,
        phase: elementalResponse.metadata?.phase || "",
        archetype: elementalResponse.metadata?.archetype || "",
      });

      const facilitatorSuggestion =
        await this.facilitatorAgent.proposeIntervention(query.userId);
      logger.info("Facilitator Suggestion:", {
        suggestion: facilitatorSuggestion,
      });

      return elementalResponse;
    } catch (error) {
      logger.error("Error processing query:", error);
      throw error;
    }
  }

  private parseStoryRequest(query: string): StoryRequest | null {
    const storyKeywords = [
      "tell me a story",
      "share a story",
      "create a story",
    ];
    const isStoryRequest = storyKeywords.some((keyword) =>
      query.toLowerCase().includes(keyword),
    );
    if (!isStoryRequest) return null;

    const elementalThemes = ["fire", "water", "earth", "air", "aether"];
    const elementalTheme =
      elementalThemes.find((theme) => query.toLowerCase().includes(theme)) ||
      "aether";

    return {
      focusArea: "personal growth",
      elementalTheme: elementalTheme as any,
      archetype: "Seeker",
      depthLevel: 3,
    };
  }

  private formatStoryResponse(story: {
    narrative: string;
    reflections: string[];
    symbols: string[];
  }): string {
    return `
${story.narrative}

Reflections:
${story.reflections.map((r) => `- ${r}`).join("\n")}

Symbolic Elements:
${story.symbols.map((s) => `- ${s}`).join("\n")}
    `.trim();
  }

  private async storeExchange(
    userId: string,
    query: string,
    response: AIResponse,
  ) {
    try {
      const element =
        response.metadata?.elementalAdjustments?.emphasis?.[0] ||
        response.metadata?.element ||
        "aether";

      await Promise.all([
        storeMemoryItem({
          content: query,
          element,
          sourceAgent: "user",
          clientId: userId,
          confidence: 0.7,
          metadata: {
            role: "user",
            originalQuery: true,
          },
        }),
        storeMemoryItem({
          content: response.content || response.response,
          element,
          sourceAgent: response.provider || "oracle",
          clientId: userId,
          confidence: response.confidence,
          metadata: {
            role: "oracle",
            query,
            ...response.metadata,
          },
        }),
      ]);
    } catch (error) {
      logger.error("Error storing oracle exchange in memory:", error);
    }
  }
}

export const oracle = new MainOracleAgent();
