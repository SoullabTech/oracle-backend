// src/services/earthAgent.ts
import { OracleAgent } from "../agents/oracleAgent";

import { logOracleInsight } from "../utils/oracleLogger";
export class EarthAgent extends OracleAgent {
  element = "earth";
  async processQuery(query) {
    const response = {
      response: `🌍 Earth guidance for: "${query.input}"`,
      provider: "EarthAgent",
      confidence: 0.9,
      metadata: {
        element: "earth",
        phase: "foundation",
        archetype: "Builder",
        emotion_score: 0.6,
      },
    };
    await logOracleInsight({
      anon_id: query.userId,
      element: "earth",
      insight: response.response,
      emotion: response.metadata?.emotion_score ?? 0.6,
      archetype: response.metadata.archetype,
      phase: response.metadata.phase,
    });
    return response;
  }
}
