import { env } from "../lib/config";
import logger from "../utils/logger";
import oracleLogger from "../utils/oracleLogger";
export class ElementalOracleService {
    baseUrl = env.VITE_CHATGPT_ORACLE_URL;
    apiKey = env.VITE_CHATGPT_ORACLE_API_KEY;
    async generateStory(request, context) {
        const url = `${this.baseUrl}/storyRequest`;
        try {
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${this.apiKey}`,
                },
                body: JSON.stringify({
                    ...request,
                    context: {
                        userId: context.userId,
                        elementalProfile: context.elementalProfile,
                        crystalFocus: context.crystalFocus,
                        phase: context.phase ?? "story",
                        memories: context.memories,
                    },
                }),
            });
            if (!res.ok) {
                throw new Error(`Story generation failed: ${res.status} ${res.statusText}`);
            }
            const data = (await res.json());
            await oracleLogger.logInsight({
                userId: context.userId,
                insightType: "story_generation",
                content: `Generated story with theme: ${request.elementalTheme}, archetype: ${request.archetype}`,
                metadata: {
                    theme: request.elementalTheme,
                    archetype: request.archetype,
                    focusArea: request.focusArea,
                    depthLevel: request.depthLevel,
                    elementalProfile: context.elementalProfile,
                    narrative_length: data.narrative.length,
                    reflections_count: data.reflections.length,
                    symbols_count: data.symbols.length,
                },
            });
            logger.info("✨ Story generated successfully", {
                elementalTheme: request.elementalTheme,
                archetype: request.archetype,
                focusArea: request.focusArea,
                depthLevel: request.depthLevel,
            });
            return data;
        }
        catch (err) {
            logger.error("❌ Error in generateStory:", err);
            throw new Error("Failed to generate story");
        }
    }
    async generateReflection(storyId, context) {
        const url = `${this.baseUrl}/storyRequest/${storyId}/reflections`;
        try {
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${this.apiKey}`,
                },
                body: JSON.stringify({
                    context: {
                        userId: context.userId,
                        elementalProfile: context.elementalProfile,
                        crystalFocus: context.crystalFocus,
                        phase: context.phase,
                        memories: context.memories,
                    },
                }),
            });
            if (!res.ok) {
                throw new Error(`Reflection generation failed: ${res.status} ${res.statusText}`);
            }
            const payload = await res.json();
            await oracleLogger.logInsight({
                userId: context.userId,
                insightType: "story_reflection",
                content: `Generated reflections for story: ${storyId}`,
                metadata: {
                    story_id: storyId,
                    reflection_count: payload.reflections.length,
                    elementalProfile: context.elementalProfile,
                },
            });
            logger.info("🔍 Reflections generated successfully", { storyId });
            return payload.reflections;
        }
        catch (err) {
            logger.error("❌ Error in generateReflection:", err);
            throw new Error("Failed to generate reflections");
        }
    }
}
export const elementalOracle = new ElementalOracleService();
