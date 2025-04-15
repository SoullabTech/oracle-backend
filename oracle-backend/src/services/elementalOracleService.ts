import { env } from '../lib/config';
import { logger } from '../utils/logger';
import type { StoryRequest, StoryResponse, OracleContext } from '../types/oracle';

export class ElementalOracleService {
  private readonly baseUrl = env.VITE_CHATGPT_ORACLE_URL;
  private readonly apiKey = env.VITE_CHATGPT_ORACLE_API_KEY;

  async generateStory(request: StoryRequest, context: OracleContext): Promise<StoryResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/storyRequest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          ...request,
          context: {
            elementalProfile: context.elementalProfile,
            crystalFocus: context.crystalFocus,
            currentPhase: context.currentPhase,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Story generation failed: ${response.statusText}`);
      }

      const data = await response.json();

      logger.info('Story generated successfully', {
        metadata: {
          focusArea: request.focusArea,
          elementalTheme: request.elementalTheme,
          archetype: request.archetype,
        },
      });

      return data;
    } catch (error) {
      logger.error('Error generating story:', error);
      throw new Error('Failed to generate story');
    }
  }

  async generateReflection(storyId: string, context: OracleContext): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseUrl}/storyRequest/${storyId}/reflections`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({ context }),
      });

      if (!response.ok) {
        throw new Error(`Reflection generation failed: ${response.statusText}`);
      }

      const data = await response.json();

      logger.info('Reflections generated successfully', {
        metadata: { storyId },
      });

      return data.reflections;
    } catch (error) {
      logger.error('Error generating reflections:', error);
      throw new Error('Failed to generate reflections');
    }
  }
}

export const elementalOracle = new ElementalOracleService();