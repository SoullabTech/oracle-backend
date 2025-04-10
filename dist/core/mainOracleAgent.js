<<<<<<< HEAD
import { OracleAgent } from './oracleAgent.js';
export class MainOracleAgent extends OracleAgent {
    async process(baseResponse) {
        console.log("[MainOracleAgent] Processing response");
        // Add main oracle processing logic here
        const enhancedResponse = `${baseResponse.response}\n\nThe Oracle has spoken.`;
        // Fix the metadata initialization with required timestamp
        const updatedMetadata = {
            ...(baseResponse.metadata || {}),
            timestamp: new Date().toISOString()
        };
        return {
            ...baseResponse,
            response: enhancedResponse,
            confidence: baseResponse.confidence ?? 0.9,
            metadata: updatedMetadata,
            routingPath: [...(baseResponse.routingPath ?? []), 'mainOracleAgent']
        };
=======
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
>>>>>>> 268cb604fe12a917c8e4d04e4a80dde66f880973
    }
}
