import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { LLMChain } from "langchain/chains";
import axios from "axios";
export async function runLangChain(query) {
    if (!process.env.OPENAI_API_KEY) {
        throw new Error("OPENAI_API_KEY environment variable is not set");
    }
    const model = new ChatOpenAI({
        openAIApiKey: process.env.OPENAI_API_KEY,
        temperature: 0.7,
        modelName: "gpt-3.5-turbo",
    });
    const template = "You are a wise oracle. Provide a poetic and thoughtful response to: {query}";
    const promptTemplate = PromptTemplate.fromTemplate(template);
    const chain = new LLMChain({
        llm: model,
        prompt: promptTemplate,
    });
    try {
        const result = await chain.invoke({ query });
        return result.text || "No response generated";
    }
    catch (error) {
        console.error("Error in runLangChain:", error);
        throw error;
    }
}
export async function triggerPrefectFlow(payload) {
    const prefectApiUrl = process.env.PREFECT_API_URL ||
        "https://your-prefect-server/api/flows/trigger";
    try {
        const response = await axios.post(prefectApiUrl, payload);
        return response.data;
    }
    catch (error) {
        console.error("Error triggering Prefect flow:", error);
        throw error;
    }
}
