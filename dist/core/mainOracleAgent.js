// src/core/mainOracleAgent.ts
import { OracleAgent } from './oracleAgent.js';
import { detectElement, adjustGuidance } from './elementalFramework.js';
export class MainOracleAgent {
    oracleAgent;
    debug;
    constructor(options = {}) {
        this.debug = options.debug ?? false;
        this.oracleAgent = new OracleAgent({ debug: this.debug });
    }
    async processQuery(query) {
        if (this.debug) {
            console.log('[MainOracleAgent] Received query:', query);
        }
        // Step 1: Get base response from OracleAgent
        const baseResponse = await this.oracleAgent.processQuery(query);
        // Step 2: Adjust response with elemental guidance
        const adjusted = adjustGuidance(query, baseResponse.response);
        const element = detectElement(query);
        // Initialize metadata if it's undefined
        let finalResponse = {
            ...baseResponse,
            response: adjusted,
            metadata: baseResponse.metadata ?? {},
            routingPath: [...(baseResponse.routingPath ?? []), 'mainOracleAgent'],
            confidence: 0.85
        };
        return finalResponse;
    }
}
