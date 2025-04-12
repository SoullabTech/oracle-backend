import { OracleAgent } from './oracleAgent.js';
import type { AgentResponse } from './types.js';

export class GuideAgent extends OracleAgent {
  async processQuery(query: string): Promise<AgentResponse> {
    const baseResponse = await super.processQuery(query);
    
    const additionalInsight = "Consider reflecting deeply on this matter and jotting down your thoughts in a journal.";
    
    return {
      ...baseResponse,
      response: `${baseResponse.response} ${additionalInsight}`,
      metadata: {
        ...baseResponse.metadata,
        guide: true,
        timestamp: new Date().toISOString()
      },
      routingPath: baseResponse.routingPath ? [...baseResponse.routingPath, 'guideAgent'] : ['guideAgent']
    };
  }
}