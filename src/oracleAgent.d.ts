import type { AgentResponse } from './types.js';
export declare class OracleAgent {
    debug: boolean;
    constructor(options?: {
        debug?: boolean;
    });
    processQuery(query: string): Promise<AgentResponse>;
    private detectElement;
}
