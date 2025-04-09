import { OracleAgent } from './oracleAgent';
export class MentorAgent extends OracleAgent {
    /**
     * Processes a query with added long-term mentoring advice.
     * @param query The user's query.
     * @returns A customized AgentResponse including mentoring guidance.
     */
    async processQuery(query) {
        // Get the base response from the OracleAgent
        const baseResponse = await super.processQuery(query);
        // Add additional mentoring advice
        const mentoringAdvice = " As a mentor, I advise you to set clear long-term goals and periodically review your progress to stay on track.";
        // Create a final response by merging the base response with mentoring advice
        const finalResponse = {
            ...baseResponse,
            response: `${baseResponse.response}${mentoringAdvice}`,
            metadata: {
                ...baseResponse.metadata,
                mentor: true,
                adviceType: "long-term coaching"
            },
            routingPath: [...baseResponse.routingPath, "mentorAgent"]
        };
        return finalResponse;
    }
}
