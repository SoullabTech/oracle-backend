"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientAgent = void 0;
// src/clientAgent.ts
const oracleAgent_js_1 = require("./oracleAgent.js");
class ClientAgent {
    constructor(clientId, debug = false) {
        this.clientId = clientId;
        this.oracleAgent = new oracleAgent_js_1.OracleAgent({ debug });
    }
    /**
     * Processes a user query and customizes the OracleAgent's response.
     * @param query The user's query.
     * @returns A personalized AgentResponse.
     */
    async handleQuery(query) {
        console.log(`[ClientAgent ${this.clientId}] Processing query: "${query}"`);
        const baseResponse = await this.oracleAgent.processQuery(query);
        const customizedResponse = {
            ...baseResponse,
            response: `[Client ${this.clientId}] ${baseResponse.response}`,
            metadata: {
                ...baseResponse.metadata,
                clientId: this.clientId,
                personalized: true
            },
            routingPath: [...baseResponse.routingPath, `client-${this.clientId}`]
        };
        return customizedResponse;
    }
}
exports.ClientAgent = ClientAgent;
