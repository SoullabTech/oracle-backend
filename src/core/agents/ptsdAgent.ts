// src/agents/ptsdAgent.ts

import { OracleResponse, OracleInput } from '@/types/oracle';
import { detectCrisisLanguage, suggestSomaticPractice, generateReframe } from '@/utils/shamanUtils';
import { logOracleInsight } from '@/utils/oracleLogger';
import { ShadowAgent } from './shadowAgent';
import { InnerGuideAgent } from './innerGuideAgent';
import { MentorAgent } from './mentorAgent';
import { GaiaAgent } from './gaiaAgent';

/**
 * PTSD Agent — Trauma Integrator
 * Archetypes: Wounded Healer, Depth Diver
 * Element: Water-Aether
 */

export class PTSDAgent {
  static async process(input: OracleInput): Promise<OracleResponse> {
    const { userId, message, emotionalTone } = input;

    // Step 1: Detect trauma or flashback indicators
    const isCrisis = detectCrisisLanguage(message);
    const insightLog = [];

    if (isCrisis) {
      const breathPrompt = suggestSomaticPractice('crisis');
      insightLog.push("⚠️ Crisis indicators detected — initiating trauma-informed response.");
      await logOracleInsight(userId, 'PTSD Agent', message, 'Crisis Mode', breathPrompt);

      return {
        agent: 'PTSD Agent',
        response: `I sense this may be a sensitive moment. Let's slow down and take a breath. ${breathPrompt}`,
        tone: 'Calm',
        emotion: 'Compassion',
        followUps: ['Would you like to journal what’s coming up?', 'Would you prefer to speak with the Inner Guide?'],
      };
    }

    // Step 2: Attempt gentle reframing
    const reframe = generateReframe(message);
    const nextAgent = message.includes('dream') ? ShadowAgent : InnerGuideAgent;
    insightLog.push("✨ Reframe offered. Routing toward deeper integration.");

    await logOracleInsight(userId, 'PTSD Agent', message, 'Reframe', reframe);

    return {
      agent: 'PTSD Agent',
      response: reframe,
      tone: 'Soothing',
      emotion: 'Empathic',
      next: nextAgent.name,
    };
  }
}
