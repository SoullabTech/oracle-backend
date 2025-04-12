import { BaseAgent } from './baseAgent';
import type { AgentResponse } from '../../types';

export class OracleAgent extends BaseAgent {
  async processQuery(query: string): Promise<AgentResponse> {
    console.log("[OracleAgent] Processing query:", query);
    
    const baseResponse = await super.processQuery(query);
    
    return {
      ...baseResponse,
      response: "Oracle's enhanced response",
      routingPath: [...baseResponse.routingPath, 'oracleAgent']
    };
  }
}