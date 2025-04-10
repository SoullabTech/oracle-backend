<<<<<<< HEAD
cat > src / core / orchestrator.ts << 'EOF';
// src/core/orchestrator.ts
import { LLMChain } from 'langchain/chains';
import { OpenAI } from 'langchain/llms/openai'; // Remove .js extension
import { PromptTemplate } from 'langchain/prompts'; // Add import for PromptTemplate
=======
// src/core/orchestrator.ts
import { LLMChain } from 'langchain/chains';
import { OpenAI } from 'langchain/llms/openai.js'; // Note the added .js extension
>>>>>>> 268cb604fe12a917c8e4d04e4a80dde66f880973
import axios from 'axios';
/**
 * Uses LangChain to process the query.
 * This example uses OpenAI as the underlying LLM.
 */
export async function runLangChain(query) {
    // Create an instance of OpenAI LLM using your API key
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
<<<<<<< HEAD
    // Create a proper PromptTemplate
    const promptTemplate = new PromptTemplate({
        template: "You are a wise oracle. Provide a poetic and thoughtful response to: {query}",
        inputVariables: ["query"]
    });
    // Create a simple chain with the prompt template
    const chain = new LLMChain({
        llm: openai,
        prompt: promptTemplate
    });
    // Run the chain and return its output
    const result = await chain.call({ query });
    return result.text || '';
=======
    // Create a simple chain with a prompt template
    const chain = new LLMChain({
        llm: openai,
        prompt: `You are a wise oracle. Provide a poetic and thoughtful response to: ${query}`
    });
    // Run the chain and return its output
    const result = await chain.run(query);
    return result;
>>>>>>> 268cb604fe12a917c8e4d04e4a80dde66f880973
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
<<<<<<< HEAD
EOF;
=======
>>>>>>> 268cb604fe12a917c8e4d04e4a80dde66f880973
