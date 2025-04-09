"use strict";
// src/core/orchestrator.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runLangChain = runLangChain;
exports.triggerPrefectFlow = triggerPrefectFlow;
const chains_1 = require("langchain/chains");
const openai_js_1 = require("langchain/llms/openai.js"); // Note the added .js extension
const axios_1 = __importDefault(require("axios"));
/**
 * Uses LangChain to process the query.
 * This example uses OpenAI as the underlying LLM.
 */
async function runLangChain(query) {
    // Create an instance of OpenAI LLM using your API key
    const openai = new openai_js_1.OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    // Create a simple chain with a prompt template
    const chain = new chains_1.LLMChain({
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
async function triggerPrefectFlow(payload) {
    const prefectApiUrl = process.env.PREFECT_API_URL || 'https://your-prefect-server/api/flows/trigger';
    try {
        const response = await axios_1.default.post(prefectApiUrl, payload);
        return response.data;
    }
    catch (error) {
        console.error('Error triggering Prefect flow:', error);
        throw error;
    }
}
