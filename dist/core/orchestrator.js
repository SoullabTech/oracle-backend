// src/core/orchestrator.ts
import { LLMChain } from 'langchain/chains';
import { OpenAI } from 'langchain/llms/openai.js'; // Note the added .js extension
import axios from 'axios';
/**
 * Uses LangChain to process the query.
 * This example uses OpenAI as the underlying LLM.
 */
export async function runLangChain(query) {
    // Create an instance of OpenAI LLM using your API key
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    // Create a simple chain with a prompt template
    const chain = new LLMChain({
        llm: openai,
        prompt: `You are a wise oracle. Provide a poetic and thoughtful response to: ${query}`
    });
    // Run the chain and return its output
    const result = await chain.run(query);
    return result;
}
/**
 * Triggers a Prefect flow via its API.
 */
export async function triggerPrefectFlow(payload) {
    const prefectApiUrl = process.env.PREFECT_API_URL || 'https://your-prefect-server/api/flows/trigger';
    try {
        const response = await axios.post(prefectApiUrl, payload);
        return response.data;
    }
    catch (error) {
        console.error('Error triggering Prefect flow:', error);
        throw error;
    }
}
