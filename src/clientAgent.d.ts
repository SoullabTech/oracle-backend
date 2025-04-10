import { OracleAgent } from './oracleAgent.js';
import type { AgentResponse } from './types.js';
export declare class ClientAgent extends OracleAgent {
    private clientId;
    constructor(clientId: string);
    processQuery(query: string): Promise<AgentResponse>;
}
