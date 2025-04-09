import { OracleAgent } from './oracleAgent';
import type { AgentResponse } from './types';

export class GuideAgent extends OracleAgent {
  /**
   * Processes a user query by extending the base OracleAgent logic with
   * additional insights and guidance.
   * @param query The user's query.
   * @returns A customized AgentResponse with extra guidance.
   */
  async processQuery(query: string): Promise<AgentResponse> {
    // Call the base OracleAgent processQuery
    const baseResponse = await super.processQuery(query);
    
    // Define additional guidance for deeper insight
    const additionalInsight = "Consider reflecting deeply on this matter and jotting down your thoughts in a journal.";
    
    // Return the enhanced response with extra metadata and updated routing path
    return {
      ...baseResponse,
      response: `${baseResponse.response} ${additionalInsight}`,
      metadata: {
        ...baseResponse.metadata,
        guide: true
      },
      routingPath: [...baseResponse.routingPath, 'guideAgent']
    };
  }
}
