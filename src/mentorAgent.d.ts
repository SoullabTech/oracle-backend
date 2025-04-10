import { OracleAgent } from './oracleAgent.js';
import type { AgentResponse } from './types.js';
export declare class MentorAgent extends OracleAgent {
    processQuery(query: string): Promise<AgentResponse>;
}
