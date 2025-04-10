cat > src/core/orchestrator.ts << 'EOF'
// src/core/orchestrator.ts
import { LLMChain } from 'langchain/chains';
import { OpenAI } from 'langchain/llms/openai'; // Remove .js extension
import { PromptTemplate } from 'langchain/prompts'; // Add import for PromptTemplate
import axios from 'axios';
/**
 * Uses LangChain to process the query.
 * This example uses OpenAI as the underlying LLM.
 */
export async function runLangChain(query: string): Promise<string> {
  // Create an instance of OpenAI LLM using your API key
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  
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
}
/**
 * Triggers a Prefect flow via its API.
 */
export async function triggerPrefectFlow(payload: any): Promise<any> {
  const prefectApiUrl = process.env.PREFECT_API_URL || 'https://your-prefect-server/api/flows/trigger';
  
  try {
    const response = await axios.post(prefectApiUrl, payload);
    return response.data;
  } catch (error) {
    console.error('Error triggering Prefect flow:', error);
    throw error;
  }
}
EOF