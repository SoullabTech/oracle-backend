// src/core/langchainHelpers.ts
import { LLMChain } from "langchain/chains";
import { OpenAI } from "langchain/llms/openai";
import { Anthropic } from "langchain/llms/anthropic";
// If your LangChain version expects PromptTemplate from 'langchain/prompts',
// change the import below accordingly.
import { PromptTemplate } from "@langchain/core/prompts"; 
import axios from "axios";

/**
 * Options for running the LangChain.
 */
export interface LangChainOptions {
  userId?: string;
  element?: string;
  llmType?: "openai" | "anthropic";
}

/**
 * Runs a language model chain to generate a response.
 * 
 * @param query The query to send to the language model.
 * @param options Optional parameters to choose the LLM or pass metadata.
 * @returns A promise that resolves to a string response from the LLM.
 */
export async function runLangChain(
  query: string,
  options?: LangChainOptions
): Promise<string> {
  try {
    // Choose the LLM based on the provided option (default to OpenAI)
    let llm;
    if (options?.llmType === "anthropic") {
      llm = new Anthropic({
        anthropicApiKey: process.env.ANTHROPIC_API_KEY!,
        temperature: 0.7,
      });
    } else {
      llm = new OpenAI({
        openAIApiKey: process.env.OPENAI_API_KEY!,
        temperature: 0.7,
      });
    }

    // Create a prompt template for the query.
    const prompt = new PromptTemplate({
      inputVariables: ["query"],
      template: "You are a wise oracle. Provide a poetic and thoughtful response to: {query}",
    });

    // Create and run the LLM chain.
    const chain = new LLMChain({ llm, prompt });
    const result = await chain.run({ query });

    console.log(`[Oracle] Response for query "${query}":`, result);

    if (options?.userId || options?.element) {
      console.log("[Oracle] Metadata:", {
        userId: options.userId,
        element: options.element,
      });
    }
    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("[Oracle] LangChain error:", error.message);
    } else {
      console.error("[Oracle] Unexpected error:", error);
    }
    return "Oracle is silent... please try again later.";
  }
}

/**
 * Triggers a Prefect flow via an HTTP POST request.
 *
 * @param payload The payload to send to the Prefect API.
 * @returns A promise that resolves with the API response.
 */
export async function triggerPrefectFlow(payload: any): Promise<any> {
  const prefectApiUrl =
    process.env.PREFECT_API_URL || "https://your-prefect-server/api/flows/trigger";

  try {
    const response = await axios.post(prefectApiUrl, payload);
    console.log("[Oracle] Prefect flow triggered successfully:", response.data);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("[Oracle] Prefect flow error:", error.message);
    } else {
      console.error("[Oracle] Prefect flow unexpected error:", error);
    }
    throw error;
  }
}
