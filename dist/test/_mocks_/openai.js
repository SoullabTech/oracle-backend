// _mocks_/openai.js
import { vi } from "vitest";
// Mocking OpenAI chat completions function
export const createChatCompletion = vi.fn().mockResolvedValue({
  choices: [{ message: { role: "assistant", content: "Mocked response" } }],
});
