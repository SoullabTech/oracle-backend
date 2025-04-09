"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainOracleAgent = void 0;
// src/core/mainOracleAgent.ts
const oracleAgent_js_1 = require("./oracleAgent.js");
const elementalFramework_js_1 = require("./elementalFramework.js");
// src/core/mainOracleAgent.ts
class MainOracleAgent {
    constructor(options = {}) {
        this.debug = options.debug ?? false;
        this.oracleAgent = new oracleAgent_js_1.OracleAgent({ debug: this.debug });
    }
    async processQuery(query) {
        if (this.debug) {
            console.log('[MainOracleAgent] Received query:', query);
        }
        // Step 1: Get base response from OracleAgent
        const baseResponse = await this.oracleAgent.processQuery(query);
        // Step 2: Adjust response with elemental guidance
        const adjusted = (0, elementalFramework_js_1.adjustGuidance)(query, baseResponse.response);
        const element = (0, elementalFramework_js_1.detectElement)(query);
        // Initialize metadata if it's undefined
        let finalResponse = {
            ...baseResponse,
            response: adjusted,
            metadata: baseResponse.metadata ?? {}, // Ensure metadata is initialized if it's undefined
            routingPath: [...(baseResponse.routingPath ?? []), 'mainOracleAgent'],
            confidence: 0.85 // Example confidence value, modify as necessary
        };
        // Add additional steps (LLM, memory enhancement, etc.) here...
        // Ensure we return the finalResponse object at the end
        return finalResponse; // <-- Add return here
    }
}
exports.MainOracleAgent = MainOracleAgent;
