import { getAIResponse } from './aiService';
import { queryChatGPTOracle } from './chatgptOracleService';
import { elementalOracle } from './elementalOracleService';
import { getUserProfile } from './profileService';
import { getPersonalityWeights } from './monitoringService';
import { storeMemoryItem, getRelevantMemories } from './memoryService';
import { logger } from '../utils/logger';
import type { AIResponse } from '../types/ai';
import type { StoryRequest, OracleContext } from '../types/oracle';

interface QueryInput {
  input: string;
  userId: string;
  context?: Record<string, unknown>;
}

export class MainOracleAgent {
  async processQuery(query: QueryInput): Promise<AIResponse> {
    try {
      logger.info('Processing query', {
        metadata: {
          userId: query.userId,
          queryLength: query.input.length,
        },
      });

      // Get user profile and personality weights
      const [profile, weights, relevantMemories] = await Promise.all([
        getUserProfile(query.userId),
        getPersonalityWeights(),
        getRelevantMemories(undefined, undefined, 5), // Get recent memories
      ]);

      if (!profile) {
        throw new Error('User profile not found');
      }

      // Check if query is requesting a story
      const storyRequest = this.parseStoryRequest(query.input);
      
      if (storyRequest) {
        logger.info('Processing story request', {
          metadata: { userId: query.userId },
        });

        const context: OracleContext = {
          elementalProfile: {
            fire: profile.fire,
            water: profile.water,
            earth: profile.earth,
            air: profile.air,
            aether: profile.aether,
          },
          crystalFocus: profile.crystal_focus,
          memories: relevantMemories,
        };

        const story = await elementalOracle.generateStory(storyRequest, context);

        return {
          content: this.formatStoryResponse(story),
          provider: 'elemental-oracle',
          model: 'gpt-4',
          confidence: 0.9,
          metadata: {
            storyRequest,
            reflections: story.reflections,
            symbols: story.symbols,
          },
        };
      }

      // Determine if query should be routed to ChatGPT Oracle
      const shouldUseChatGPTOracle = this.shouldRouteToChatGPTOracle(query.input, weights);

      let response: AIResponse;

      if (shouldUseChatGPTOracle) {
        logger.info('Routing to ChatGPT Oracle', {
          metadata: { userId: query.userId },
        });

        response = await queryChatGPTOracle({
          query: query.input,
          context: {
            profile,
            weights,
            memories: relevantMemories,
            ...query.context,
          },
        });
      } else {
        logger.info('Using standard AI response', {
          metadata: { userId: query.userId },
        });

        response = await getAIResponse(query.input, query.userId, profile);
      }

      // Store response in memory
      await this.storeResponse(query.userId, query.input, response);

      return response;
    } catch (error) {
      logger.error('Error processing query:', error);
      throw error;
    }
  }

  private parseStoryRequest(query: string): StoryRequest | null {
    // Simple heuristic for detecting story requests
    const storyKeywords = ['tell me a story', 'share a story', 'create a story'];
    const isStoryRequest = storyKeywords.some(keyword => 
      query.toLowerCase().includes(keyword)
    );

    if (!isStoryRequest) return null;

    // Extract story parameters from query
    const elementalThemes = ['fire', 'water', 'earth', 'air', 'aether'];
    const elementalTheme = elementalThemes.find(theme => 
      query.toLowerCase().includes(theme)
    ) || 'aether';

    return {
      focusArea: 'personal growth', // Default focus area
      elementalTheme: elementalTheme as any,
      archetype: 'Seeker', // Default archetype
      depthLevel: 3, // Default depth level
    };
  }

  private formatStoryResponse(story: { narrative: string; reflections: string[]; symbols: string[] }): string {
    return `
${story.narrative}

Reflections:
${story.reflections.map(r => `- ${r}`).join('\n')}

Symbolic Elements:
${story.symbols.map(s => `- ${s}`).join('\n')}
    `.trim();
  }

  private shouldRouteToChatGPTOracle(query: string, weights: any[]): boolean {
    // Add logic to determine routing based on query characteristics and weights
    const complexityThreshold = 0.7;
    const queryComplexity = this.calculateQueryComplexity(query);
    
    // Route to ChatGPT Oracle for complex queries or when specific elements are dominant
    return queryComplexity > complexityThreshold || this.hasSpecialElements(weights);
  }

  private calculateQueryComplexity(query: string): number {
    // Implement complexity calculation logic
    const factors = {
      length: query.length / 1000, // Normalize by max expected length
      questionMarks: (query.match(/\?/g) || []).length / 5,
      complexWords: (query.match(/\b\w{10,}\b/g) || []).length / 10,
    };

    return Math.min(
      1,
      (factors.length + factors.questionMarks + factors.complexWords) / 3
    );
  }

  private hasSpecialElements(weights: any[]): boolean {
    // Check if certain elements have high weights
    return weights.some(w => w.weight > 0.8);
  }

  private async storeResponse(userId: string, query: string, response: AIResponse) {
    try {
      await storeMemoryItem({
        content: response.content,
        element: response.metadata.elementalAdjustments?.emphasis?.[0] || 'aether',
        sourceAgent: response.provider,
        userId,
        confidence: response.confidence,
        metadata: {
          query,
          ...response.metadata,
        },
      });
    } catch (error) {
      logger.error('Error storing response in memory:', error);
    }
  }
}

export const oracle = new MainOracleAgent();