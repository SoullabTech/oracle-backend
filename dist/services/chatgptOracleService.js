import { env } from "../lib/config";
import logger from "../utils/logger";
export async function queryChatGPTOracle(request) {
    try {
        const response = await fetch(env.VITE_CHATGPT_ORACLE_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${env.VITE_CHATGPT_ORACLE_API_KEY}`,
            },
            body: JSON.stringify(request),
        });
        if (!response.ok) {
            throw new Error(`ChatGPT Oracle request failed: ${response.statusText}`);
        }
        const data = await response.json();
        return {
            content: data.response,
            provider: "chatgpt-oracle",
            model: data.model || "gpt-4",
            confidence: data.confidence || 0.9,
            metadata: {
                tokens: data.usage?.total_tokens,
                processingTime: data.processingTime,
                ...data.metadata,
            },
        };
    }
    catch (error) {
        logger.error("Error querying ChatGPT Oracle:", error);
        throw new Error("Failed to query ChatGPT Oracle");
    }
}
