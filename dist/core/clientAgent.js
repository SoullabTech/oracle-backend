<<<<<<< HEAD
import { OracleAgent } from './oracleAgent.js';
export class ClientAgent extends OracleAgent {
    constructor(clientId) {
        super();
        this.clientId = clientId;
    }
    async processQuery(query) {
        const baseResponse = await super.processQuery(query);
        console.log(`[ClientAgent] Processing response for client: ${this.clientId}`);
        // Add client-specific personalization to the response
        const personalizedResponse = `${baseResponse.response}\n\nTailored for you, valued client.`;
        const updatedMetadata = {
            ...(baseResponse.metadata || {}),
            timestamp: new Date().toISOString(),
            clientId: this.clientId
        };
        return {
            ...baseResponse,
            response: personalizedResponse,
            metadata: updatedMetadata,
            routingPath: [...(baseResponse.routingPath ?? []), 'clientAgent']
        };
=======
// src/clientAgent.ts
import { OracleAgent } from './oracleAgent.js';
export class ClientAgent {
    clientId;
    oracleAgent;
    constructor(clientId, debug = false) {
        this.clientId = clientId;
        this.oracleAgent = new OracleAgent({ debug });
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
>>>>>>> 268cb604fe12a917c8e4d04e4a80dde66f880973
    }
}
