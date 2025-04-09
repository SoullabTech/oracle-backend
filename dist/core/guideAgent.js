"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuideAgent = void 0;
const oracleAgent_1 = require("./oracleAgent");
class GuideAgent extends oracleAgent_1.OracleAgent {
    /**
     * Processes a user query by extending the base OracleAgent logic with
     * additional insights and guidance.
     * @param query The user's query.
     * @returns A customized AgentResponse with extra guidance.
     */
    async processQuery(query) {
        // Call the base OracleAgent processQuery
        const baseResponse = await super.processQuery(query);
        // Define additional guidance for deeper insight
        const additionalInsight = "Consider reflecting deeply on this matter and jotting down your thoughts in a journal.";
        // Return the enhanced response with extra metadata and updated routing path
        return {
            ...baseResponse,
            response: `${baseResponse.response} ${additionalInsight}`,
            metadata: {
                ...baseResponse.metadata,
                guide: true
            },
            routingPath: [...baseResponse.routingPath, 'guideAgent']
        };
    }
}
exports.GuideAgent = GuideAgent;
