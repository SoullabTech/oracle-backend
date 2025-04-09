import { LLMChain } from "langchain/chains";
import { OpenAI } from "langchain/llms/openai";
import { Anthropic } from "langchain/llms/anthropic";
import { PromptTemplate } from "@langchain/core/prompts";
import axios from "axios";
export async function runLangChain(query, options) {
    try {
        // Choose the LLM based on the provided option (default to OpenAI)
        let llm;
        if (options?.llmType === "anthropic") {
            llm = new Anthropic({
                anthropicApiKey: process.env.ANTHROPIC_API_KEY,
                temperature: 0.7,
            });
        }
        else {
            llm = new OpenAI({
                openAIApiKey: process.env.OPENAI_API_KEY,
                temperature: 0.7,
            });
        }
        const prompt = new PromptTemplate({
            inputVariables: ["query"],
            template: "You are a wise oracle. Provide a poetic and thoughtful response to: {query}",
        });
        const chain = new LLMChain({ llm, prompt });
        const result = await chain.run({ query });
        console.log(`[Oracle] Response for query "${query}":`, result);
        if (options?.userId || options?.element) {
            console.log(`[Oracle] Metadata:`, {
                userId: options.userId,
                element: options.element,
            });
        }
        return result;
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("[Oracle] LangChain error:", error.message);
        }
        else {
            console.error("[Oracle] Unexpected error:", error);
        }
        return "Oracle is silent... please try again later.";
    }
}
export async function triggerPrefectFlow(payload) {
    const prefectApiUrl = process.env.PREFECT_API_URL || "https://your-prefect-server/api/flows/trigger";
    try {
        const response = await axios.post(prefectApiUrl, payload);
        console.log("[Oracle] Prefect flow triggered successfully:", response.data);
        return response.data;
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("[Oracle] Prefect flow error:", error.message);
        }
        else {
            console.error("[Oracle] Prefect flow unexpected error:", error);
        }
        throw error;
    }
}
