// src/core/guideAgent.ts
import { OracleAgent } from './oracleAgent.js';
export class GuideAgent extends OracleAgent {
    async processQuery(query) {
        const baseResponse = await super.processQuery(query);
        const additionalInsight = " Consider reflecting deeply on this matter and jotting down your thoughts.";
        const updatedMetadata = {
            ...(baseResponse.metadata || {}),
            guide: true, // Custom field for this agent
            timestamp: new Date().toISOString() // ✅ Ensure required field exists
        };
        return {
            ...baseResponse,
            response: `${baseResponse.response}${additionalInsight}`,
            metadata: updatedMetadata,
            routingPath: [...(baseResponse.routingPath ?? []), 'guideAgent']
        };
    }
}
