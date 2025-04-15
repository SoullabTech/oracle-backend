import type { ElementalProfile } from '../lib/database.types';

export type AIProvider = 'openai' | 'anthropic';

export interface AIModelConfig {
  provider: AIProvider;
  model: string;
  temperature?: number;
  maxTokens?: number;
}

export interface RoutingCriteria {
  elementalProfile: ElementalProfile;
  queryComplexity: number;
  queryType: 'analytical' | 'creative' | 'emotional' | 'practical' | 'spiritual';
}

export interface AIResponse {
  content: string;
  provider: AIProvider;
  model: string;
  confidence: number;
  metadata: {
    tokens: number;
    processingTime: number;
    elementalAdjustments?: {
      tone?: string;
      style?: string;
      emphasis?: string[];
    };
  };
}