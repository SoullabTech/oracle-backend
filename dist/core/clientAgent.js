import { OracleAgent } from './oracleAgent.js';
export class ClientAgent {
    clientId;
    oracleAgent;
    constructor(clientId, debug = false) {
        this.clientId = clientId;
        this.oracleAgent = new OracleAgent({ debug });
    }
    async handleQuery(query) {
        console.log(`[ClientAgent ${this.clientId}] Processing query: "${query}"`);
        const baseResponse = await this.oracleAgent.processQuery(query);
        return {
            ...baseResponse,
            response: `[Client ${this.clientId}] ${baseResponse.response}`,
            routingPath: [...(baseResponse.routingPath ?? []), `client-${this.clientId}`]
        };
    }
}
