import { oracle } from './MainOracleAgent';
import type { AIResponse } from '../types/ai';

interface QueryContext {
  userId: string;
  elementalEmphasis?: string[];
  facets?: string[];
  confidence?: number;
  context?: Record<string, unknown>;
}

export async function getOracleResponse(
  query: string,
  context: QueryContext
): Promise<AIResponse> {
  return oracle.processQuery({
    input: query,
    userId: context.userId,
    context: {
      elementalEmphasis: context.elementalEmphasis,
      facets: context.facets,
      confidence: context.confidence,
      ...context.context,
    },
  });
}