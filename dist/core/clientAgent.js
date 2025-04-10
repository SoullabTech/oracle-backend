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
    }
}
