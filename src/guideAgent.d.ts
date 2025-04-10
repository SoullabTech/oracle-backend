import { OracleAgent } from './oracleAgent.js';
import type { AgentResponse } from './types.js';
export declare class GuideAgent extends OracleAgent {
    processQuery(query: string): Promise<AgentResponse>;
}
