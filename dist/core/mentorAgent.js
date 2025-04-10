<<<<<<< HEAD
import { OracleAgent } from './oracleAgent.js';
export class MentorAgent extends OracleAgent {
    async processQuery(query) {
        const baseResponse = await super.processQuery(query);
        console.log("[MentorAgent] Processing response");
        // Add mentor-specific guidance to the response
        const mentorResponse = `${baseResponse.response}\n\nMentor's wisdom: Apply this knowledge mindfully.`;
        const updatedMetadata = {
            ...(baseResponse.metadata || {}),
            timestamp: new Date().toISOString(),
            mentor: true
        };
        return {
            ...baseResponse,
            response: mentorResponse,
            metadata: updatedMetadata,
            routingPath: [...(baseResponse.routingPath ?? []), 'mentorAgent']
        };
=======
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
>>>>>>> 268cb604fe12a917c8e4d04e4a80dde66f880973
    }
}
