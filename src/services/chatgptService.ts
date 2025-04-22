import OpenAI from "openai";
import { env } from "../lib/config";
import logger from "../utils/logger";
import type { AIResponse } from "../types/ai";

const openai = new OpenAI({
  apiKey: env.VITE_OPENAI_API_KEY,
});

interface ChatGPTRequest {
  query: string;
  context?: string;
  options?: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
  };
}

export async function getChatGPTResponse(
  request: ChatGPTRequest,
): Promise<AIResponse> {
  try {
    const startTime = Date.now();

    const completion = await openai.chat.completions.create({
      model: request.options?.model || "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content:
            "You are a wise and insightful oracle, providing guidance with depth and clarity.",
        },
        ...(request.context
          ? [{ role: "system", content: request.context }]
          : []),
        { role: "user", content: request.query },
      ],
      temperature: request.options?.temperature ?? 0.7,
      max_tokens: request.options?.maxTokens,
    });

    const content = completion.choices[0].message.content || "";
    const tokens = completion.usage?.total_tokens || 0;

    logger.info("ChatGPT response generated", {
      metadata: {
        model: request.options?.model || "gpt-4-turbo-preview",
        tokens,
        processingTime: Date.now() - startTime,
      },
    });

    return {
      content,
      provider: "openai",
      model: request.options?.model || "gpt-4-turbo-preview",
      confidence: 0.9,
      metadata: {
        tokens,
        processingTime: Date.now() - startTime,
      },
    };
  } catch (error) {
    logger.error("Error getting ChatGPT response:", error);
    throw new Error("Failed to get ChatGPT response");
  }
}
