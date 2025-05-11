// src/core/agents/MainOracleAgent.ts

import { elementalOracle } from "../../services/elementalOracleService";
import { getUserProfile } from "../../services/profileService";
import { getPersonalityWeights } from "../../services/monitoringService";
import {
  storeMemoryItem,
  getRelevantMemories,
} from "../../services/memoryService";
import { logInsight } from "../../utils/oracleLogger";
import { runShadowWork } from "../../modules/shadowWorkModule";
import { scoreQuery } from "../../utils/agentScoreUtil";
import { detectFacetFromInput } from "../../utils/facetUtil";
import { FireAgent } from "./fireAgent";
import { WaterAgent } from "./waterAgent";
import { EarthAgent } from "./earthAgent";
import { AirAgent } from "./airAgent";
import { AetherAgent } from "./aetherAgent";
import { FacilitatorAgent } from "./facilitatorAgent";
import logger from "../../utils/logger";
import { feedbackPrompts } from "../../constants/feedbackPrompts";
import type { AIResponse } from "../../types/ai";
import type { StoryRequest, OracleContext } from "../../types/oracle";

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

  async processQuery(query: QueryInput): Promise<AIResponse> {
    try {
      logger.info("Processing query", {
        metadata: {
          userId: query.userId,
          queryLength: query.input.length,
        },
      });

      const [profile, weights, relevantMemories] = await Promise.all([
        getUserProfile(query.userId),
        getPersonalityWeights(),
        getRelevantMemories(query.userId, 5),
      ]);

      if (!profile) throw new Error("User profile not found");

      const storyRequest = this.parseStoryRequest(query.input);
      if (storyRequest) {
        logger.info("Processing story request", {
          metadata: { userId: query.userId },
        });

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
            provider: "elemental-oracle",
            model: "gpt-4",
            storyRequest,
            reflections: story.reflections,
            symbols: story.symbols,
          },
          feedbackPrompt: feedbackPrompts.story,
        };

        await this.storeExchange(query.userId, query.input, finalResponse);
        await logInsight({
          userId: query.userId,
          insightType: "story",
          content: finalResponse.content,
          metadata: {
            archetype: storyRequest.archetype,
            element: storyRequest.elementalTheme,
          },
        });

        return finalResponse;
      }

      const shadowInsight = await runShadowWork(query.input, query.userId);
      if (shadowInsight) {
        logger.info("Shadow insight surfaced", { userId: query.userId });
        return {
          ...shadowInsight,
          feedbackPrompt: feedbackPrompts.shadow,
        };
      }

      const scores = scoreQuery(query.input);
      let chosenAgent = this.aetherAgent;
      let maxScore = scores.aether;

      for (const [element, score] of Object.entries(scores)) {
        if (score > maxScore && element !== "aether") {
          maxScore = score;
          chosenAgent = {
            fire: this.fireAgent,
            water: this.waterAgent,
            earth: this.earthAgent,
            air: this.airAgent,
          }[element as keyof typeof scores]!;
          logger.info(`Routing query to ${chosenAgent.constructor.name}`, {
            scores,
            selected: chosenAgent.constructor.name,
          });
        }
      }

      if (chosenAgent === this.aetherAgent) {
        logger.info("Routing to AetherAgent (default)");
      }

      const elementalResponse = await chosenAgent.processQuery(query);

      const detectedFacet = await detectFacetFromInput(query.input);
      elementalResponse.metadata = {
        ...elementalResponse.metadata,
        facet: detectedFacet,
        provider:
          elementalResponse.metadata?.provider || chosenAgent.constructor.name,
        model: elementalResponse.metadata?.model || "gpt-4",
      };

      elementalResponse.feedbackPrompt = feedbackPrompts.elemental;

      await this.storeExchange(query.userId, query.input, elementalResponse);
      await logInsight({
        userId: query.userId,
        insightType: "elemental",
        content: elementalResponse.content,
        metadata: {
          element: elementalResponse.metadata?.element,
          phase: elementalResponse.metadata?.phase,
          archetype: elementalResponse.metadata?.archetype,
          facet: detectedFacet,
        },
      });

      const facilitatorSuggestion =
        await this.facilitatorAgent.proposeIntervention(query.userId);
      logger.info("Facilitator suggestion", {
        suggestion: facilitatorSuggestion,
      });

      return elementalResponse;
    } catch (error) {
      logger.error("Error processing query:", error);
      throw error;
    }
  }

  private parseStoryRequest(text: string): StoryRequest | null {
    const kws = ["tell me a story", "share a story", "create a story"];
    if (!kws.some((k) => text.toLowerCase().includes(k))) return null;

    const themes = ["fire", "water", "earth", "air", "aether"] as const;
    const theme =
      themes.find((t) => text.toLowerCase().includes(t)) ?? "aether";

    return {
      focusArea: "personal growth",
      elementalTheme: theme,
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
      const element = response.metadata?.element || "aether";
      await Promise.all([
        storeMemoryItem({
          content: query,
          element,
          sourceAgent: "user",
          clientId: userId,
          confidence: 0.7,
          metadata: { role: "user", originalQuery: true },
        }),
        storeMemoryItem({
          content: response.content,
          element,
          sourceAgent: response.provider,
          clientId: userId,
          confidence: response.confidence,
          metadata: { role: "oracle", query, ...response.metadata },
        }),
      ]);
    } catch (err) {
      logger.error("Error storing oracle exchange in memory:", err);
    }
  }

  async handleFeedback(feedback: {
    userId: string;
    messageId: string;
    rating: number;
    emotion?: string;
  }) {
    try {
      await storeMemoryItem({
        content: `User rated ${feedback.rating}/5 for message ${feedback.messageId}${feedback.emotion ? ` with emotion: ${feedback.emotion}` : ""}`,
        element: "aether",
        sourceAgent: "feedback-endpoint",
        clientId: feedback.userId,
        confidence: 1,
        metadata: {
          originalMessageId: feedback.messageId,
          rating: feedback.rating,
          emotion: feedback.emotion,
          role: "feedback",
        },
      });

      logger.info("Feedback stored successfully", {
        userId: feedback.userId,
        messageId: feedback.messageId,
        rating: feedback.rating,
        emotion: feedback.emotion,
      });
    } catch (err) {
      logger.error("Error handling feedback:", err);
    }
  }
}

export const oracle = new MainOracleAgent();
