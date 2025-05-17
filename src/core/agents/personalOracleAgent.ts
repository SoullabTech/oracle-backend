// src/agents/personalOracleAgent.ts

import { getUserProfile } from '../services/profileService';
import { getRelevantMemories, storeMemoryItem } from '../services/memoryService';
import { logOracleInsight } from '../utils/oracleLogger';
import { synthesizeVoice } from '../services/voiceService';
import ModelService from '../utils/modelService';
import logger from '../utils/logger';
import type { AIResponse } from '../types/ai';

interface QueryInput {
  userId: string;
  input: string;
  context?: Record<string, any>;
}

export class PersonalOracleAgent {
  async process(query: QueryInput): Promise<AIResponse> {
    const { userId, input } = query;

    try {
      const profile = await getUserProfile(userId);
      const memories = await getRelevantMemories(userId, 5);

      const memoryContext = memories.map(m => `- ${m.content}`).join('\n');
      const prompt = `You are ${profile.inner_guide_name || 'a wise inner guide'}, devoted to this person's growth.\nUser's recent memories:\n${memoryContext}\n\nQuery:\n${input}`;

      const modelOutput = await ModelService.getResponse({ input: prompt });

      const response: AIResponse = {
        content: modelOutput.response,
        provider: 'personal-oracle',
        model: 'gpt-4',
        confidence: modelOutput.confidence || 0.9,
        metadata: {
          routedFrom: 'personal-oracle',
          emotion: modelOutput.metadata?.emotion_score ?? 0.88,
          symbols: modelOutput.metadata?.symbols || [],
          reflections: modelOutput.metadata?.reflections || [],
        },
      };

      // 🎧 Synthesize voice if profile has voiceId
      if (profile.voice_id) {
        const voicePath = `./public/audio/${userId}-guide.mp3`;
        try {
          await synthesizeVoice({
            text: response.content,
            voiceId: profile.voice_id,
            outputPath: voicePath,
          });
          response.metadata.audioUrl = `/audio/${userId}-guide.mp3`;
        } catch (err) {
          logger.warn(`[Voice Synthesis] Failed for user ${userId}:`, err);
        }
      }

      await storeMemoryItem({
        clientId: userId,
        content: response.content,
        sourceAgent: 'personal-oracle',
        confidence: response.confidence,
        element: 'aether',
        metadata: response.metadata,
      });

      await logOracleInsight({
        anon_id: userId,
        archetype: 'Inner Guide',
        element: 'aether',
        insight: {
          message: response.content,
          raw_input: input,
        },
        emotion: response.metadata?.emotion || 0.88,
        phase: 'personal-guidance',
        context: memories,
      });

      return response;
    } catch (err) {
      logger.error('[PersonalOracleAgent] Error processing:', err);
      throw err;
    }
  }
}

export const personalOracle = new PersonalOracleAgent();
