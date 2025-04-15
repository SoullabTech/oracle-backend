import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import axios from "axios";

export async function runLangChain(query: string): Promise<string> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY environment variable is not set");
  }

  // Initialize the LLM model
  const model = new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    temperature: 0.7,
    modelName: "gpt-3.5-turbo",
  });

  // Wrap the model in a Runnable
  const runnableModel = model;

  // Create a prompt template
  const prompt = ChatPromptTemplate.fromTemplate(
    "You are a wise oracle. Provide a poetic and thoughtful response to: {query}"
  );

  // Use LCEL's pipe method to chain the prompt and model
  const chain = prompt.pipe(runnableModel);

  try {
    // Invoke the chain with the query
    const result = await chain.invoke({ query });
    return result.text || "No response generated";
  } catch (error) {
    console.error("Error in runLangChain:", error);
    throw error;
  }
}

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