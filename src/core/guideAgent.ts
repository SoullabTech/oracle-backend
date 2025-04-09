// src/core/guideAgent.ts
import { OracleAgent } from './oracleAgent.js';
import type { AgentResponse, Metadata } from './types';

export class GuideAgent extends OracleAgent {
  async processQuery(query: string): Promise<AgentResponse> {
    const baseResponse = await super.processQuery(query);

    const additionalInsight = " Consider reflecting deeply on this matter and jotting down your thoughts.";

    const updatedMetadata: Metadata = {
      ...(baseResponse.metadata || {}),
      guide: true, // Custom field for this agent
      timestamp: new Date().toISOString() // ✅ Ensure required field exists
    };

    return {
      ...baseResponse,
      response: `${baseResponse.response}${additionalInsight}`,
      metadata: updatedMetadata,
      routingPath: [...(baseResponse.routingPath ?? []), 'guideAgent']
    };
  }
}
