cat > src / core / guideAgent.ts << 'EOF';
import { OracleAgent } from './oracleAgent';
export class GuideAgent extends OracleAgent {
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
                guide: true,
                timestamp: new Date().toISOString() // Make sure timestamp is included
            },
            routingPath: baseResponse.routingPath ? [...baseResponse.routingPath, 'guideAgent'] : ['guideAgent']
        };
    }
}
EOF;
