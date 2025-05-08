import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { env } from "../lib/config";
import { queryChatGPTOracle } from "./chatgptOracleService";
import logger from "../utils/logger";
import { z } from "zod";
const openai = new OpenAI({
    apiKey: env.VITE_OPENAI_API_KEY,
});
const anthropic = new Anthropic({
    apiKey: env.VITE_CLAUDE_API_KEY,
});
const modelConfigs = {
    analytical: {
        provider: "openai",
        model: "gpt-4-turbo-preview",
        temperature: 0.3,
    },
    creative: {
        provider: "anthropic",
        model: "claude-3-opus",
        temperature: 0.9,
    },
    emotional: {
        provider: "chatgpt-oracle",
        model: "gpt-4",
        temperature: 0.7,
    },
    practical: {
        provider: "openai",
        model: "gpt-4-turbo-preview",
        temperature: 0.5,
    },
    spiritual: {
        provider: "anthropic",
        model: "claude-3-opus",
        temperature: 0.6,
    },
};
const querySchema = z.object({
    text: z.string().min(1),
    userId: z.string().uuid(),
    profile: z.object({
        fire: z.number(),
        water: z.number(),
        earth: z.number(),
        air: z.number(),
        aether: z.number(),
        crystal_focus: z
            .object({
            type: z.string(),
            challenges: z.string(),
            aspirations: z.string(),
            customDescription: z.string().optional(),
        })
            .optional(),
    }),
});
export async function getAIResponse(query, userId, profile) {
    const startTime = Date.now();
    // Validate input
    const validatedInput = querySchema.parse({
        text: query,
        userId,
        profile,
    });
    // Determine routing criteria
    const criteria = {
        elementalProfile: profile,
        queryComplexity: calculateQueryComplexity(validatedInput.text),
        queryType: determineQueryType(validatedInput.text, profile),
    };
    // Select model configuration
    const config = modelConfigs[criteria.queryType];
    // Get response from selected provider
    let content;
    let tokens;
    let metadata = {};
    try {
        if (config.provider === "openai") {
            const completion = await openai.chat.completions.create({
                model: config.model,
                messages: [{ role: "user", content: validatedInput.text }],
                temperature: config.temperature,
            });
            content = completion.choices[0].message.content || "";
            tokens = completion.usage?.total_tokens || 0;
        }
        else if (config.provider === "anthropic") {
            const message = await anthropic.messages.create({
                model: config.model,
                messages: [{ role: "user", content: validatedInput.text }],
                temperature: config.temperature,
            });
            content = message.content[0].text;
            tokens = message.usage?.output_tokens || 0;
        }
        else if (config.provider === "chatgpt-oracle") {
            const oracleResponse = await queryChatGPTOracle({
                query: validatedInput.text,
                context: {
                    profile,
                    criteria,
                },
                options: {
                    temperature: config.temperature,
                },
            });
            content = oracleResponse.content;
            tokens = oracleResponse.metadata.tokens || 0;
            metadata = oracleResponse.metadata;
        }
        else {
            throw new Error(`Unsupported provider: ${config.provider}`);
        }
        logger.info("AI response generated", {
            metadata: {
                provider: config.provider,
                model: config.model,
                queryType: criteria.queryType,
                processingTime: Date.now() - startTime,
            },
        });
        return {
            content,
            provider: config.provider,
            model: config.model,
            confidence: 0.8,
            metadata: {
                tokens,
                processingTime: Date.now() - startTime,
                routingCriteria: criteria,
                ...metadata,
            },
        };
    }
    catch (error) {
        logger.error("Error getting AI response:", error);
        throw new Error("Failed to get AI response");
    }
}
function calculateQueryComplexity(text) {
    const words = text.split(/\s+/).length;
    const sentences = text.split(/[.!?]+/).length;
    const avgWordsPerSentence = words / sentences;
    let complexity = 0;
    complexity += words / 50; // Length factor
    complexity += avgWordsPerSentence / 10; // Sentence complexity
    complexity += text.includes("?") ? 0.2 : 0; // Question complexity
    complexity +=
        (text.match(/\b(why|how|what if|compare|analyze)\b/gi) || []).length * 0.3; // Analytical terms
    return Math.min(Math.max(complexity, 0), 1);
}
function determineQueryType(text, profile) {
    // Keyword-based classification with elemental weighting
    const keywords = {
        analytical: ["analyze", "compare", "evaluate", "reason", "logic"],
        creative: ["imagine", "create", "design", "inspire", "innovative"],
        emotional: ["feel", "emotion", "relationship", "empathy", "heart"],
        practical: ["how to", "steps", "implement", "solve", "fix"],
        spiritual: ["meaning", "purpose", "spirit", "soul", "divine"],
    };
    const textLower = text.toLowerCase();
    // Calculate base scores from keywords
    const baseScores = Object.entries(keywords).map(([type, words]) => ({
        type,
        score: words.filter((word) => textLower.includes(word)).length,
    }));
    // Apply elemental profile weights
    const weightedScores = baseScores.map((score) => {
        let weight = 1;
        switch (score.type) {
            case "analytical":
                weight += profile.air / 100;
                break;
            case "creative":
                weight += profile.fire / 100;
                break;
            case "emotional":
                weight += profile.water / 100;
                break;
            case "practical":
                weight += profile.earth / 100;
                break;
            case "spiritual":
                weight += profile.aether / 100;
                break;
        }
        return {
            type: score.type,
            score: score.score * weight,
        };
    });
    // Consider crystal focus
    if (profile.crystal_focus) {
        const focusBonus = 0.5;
        switch (profile.crystal_focus.type) {
            case "career":
                weightedScores.find((s) => s.type === "practical").score += focusBonus;
                break;
            case "spiritual":
                weightedScores.find((s) => s.type === "spiritual").score += focusBonus;
                break;
            case "creative":
                weightedScores.find((s) => s.type === "creative").score += focusBonus;
                break;
            case "relational":
                weightedScores.find((s) => s.type === "emotional").score += focusBonus;
                break;
        }
    }
    const bestMatch = weightedScores.reduce((prev, current) => current.score > prev.score ? current : prev);
    return bestMatch.type;
}
