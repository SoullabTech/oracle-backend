import type { Metadata } from './types/metadata.ts';

export interface GeneratePromptRequest {
  query: string;
  userId: string;
  config?: Record<string, unknown>;
}

export interface GeneratePromptResponse {
  prompt: string;
  metadata?: Metadata;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: unknown;
}

const BACKEND_URL = "https://my-oracle-backend.onrender.com";

export const generatePrompt = async (
  query: string, 
  userId: string
): Promise<string> => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/generate-prompt`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ 
        query, 
        userId, 
        config: {} 
      } as GeneratePromptRequest)
    });

    if (!response.ok) {
      const error = await response.json() as ApiError;
      throw new Error(error.message || "Failed to fetch Oracle response");
    }

    const data = await response.json() as GeneratePromptResponse;
    return data.prompt;
  } catch (error) {
    console.error("API Error:", error);
    throw error instanceof Error 
      ? error 
      : new Error("An unexpected error occurred");
  }
};