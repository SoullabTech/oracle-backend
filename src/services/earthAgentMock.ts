// src/services/earthAgent.ts

import { OracleAgent } from './oracleAgent.js';
import type { AIResponse } from '../types/ai.js';
import { logOracleInsight } from '../utils/oracleLogger;

export class EarthAgent extends OracleAgent {
  element = .js'earth';

  async processQuery(query: { input: string; userId: string }): Promise<AIResponse> {
    const response: AIResponse = {
      response: `🌍 Earth guidance for: "${query.input}"`,
      provider: 'EarthAgent',
      confidence: 0.9,
      metadata: {
        element: 'earth',
        phase: 'foundation',
        archetype: 'Builder',
        emotion_score: 0.6,
      },
    };

    await logOracleInsight({
      anon_id: query.userId,
      element: 'earth',
      insight: response.response,
      emotion: response.metadata?.emotion_score ?? 0.6,
      archetype: response.metadata.archetype,
      phase: response.metadata.phase,
    });

    return response;
  }
}
