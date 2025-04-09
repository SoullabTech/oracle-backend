// src/core/mentorAgent.ts
import { OracleAgent } from './oracleAgent.js';
import type { AgentResponse, Metadata } from './types.js';

export class MentorAgent extends OracleAgent {
  async processQuery(query: string): Promise<AgentResponse> {
    const baseResponse = await super.processQuery(query);

    const mentoringAdvice = " As a mentor, I advise you to set clear long-term goals and periodically review your progress to stay on track.";

    const updatedMetadata: Metadata = {
      ...(baseResponse.metadata || {}),
      mentor: true,
      adviceType: "long-term coaching",
      timestamp: baseResponse.metadata?.timestamp || new Date().toISOString()
    };

    return {
      ...baseResponse,
      response: `${baseResponse.response}${mentoringAdvice}`,
      metadata: updatedMetadata,
      routingPath: [...(baseResponse.routingPath ?? []), "mentorAgent"]
    };
  }
}
