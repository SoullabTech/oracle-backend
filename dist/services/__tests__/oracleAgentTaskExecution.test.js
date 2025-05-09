import { vi, describe, it, expect, beforeEach } from "vitest";
import { OracleAgent } from "../OracleAgent";
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
// ---- MOCKS ----
vi.mock("openai", () => {
    return {
        default: vi.fn().mockImplementation(() => ({
            chat: {
                completions: {
                    create: vi.fn(),
                },
            },
        })),
    };
});
vi.mock("@anthropic-ai/sdk", () => {
    return {
        default: vi.fn().mockImplementation(() => ({
            messages: {
                create: vi.fn(),
            },
        })),
    };
});
// ---- CONFIG ----
const openaiConfig = {
    openaiApiKey: "test-openai-key",
    anthropicApiKey: "test-anthropic-key",
    defaultModel: "gpt-4",
    temperature: 0.7,
};
const claudeConfig = {
    ...openaiConfig,
    defaultModel: "claude-3",
};
// ---- TESTS ----
describe("Oracle Agent Extended Tests", () => {
    let oracleAgent;
    beforeEach(() => {
        vi.clearAllMocks();
    });
    it("should return correct token metadata from OpenAI", async () => {
        oracleAgent = new OracleAgent(openaiConfig);
        const mockCompletion = {
            choices: [{ message: { content: "With tokens" } }],
            usage: { total_tokens: 123 },
        };
        const mockedOpenAIInstance = OpenAI.mock.results[0]
            .value;
        mockedOpenAIInstance.chat.completions.create.mockResolvedValueOnce(mockCompletion);
        const result = await oracleAgent.performTask();
        expect(result.metadata.tokens).toBe(123);
    });
    it("should perform a task with Claude successfully", async () => {
        oracleAgent = new OracleAgent(claudeConfig);
        const mockMessage = {
            content: [{ text: "Claude reply" }],
            usage: { output_tokens: 456 },
        };
        const mockedAnthropicInstance = Anthropic.mock
            .results[0].value;
        mockedAnthropicInstance.messages.create.mockResolvedValueOnce(mockMessage);
        const result = await oracleAgent.performTask();
        expect(result.content).toBe("Claude reply");
        expect(result.provider).toBe("anthropic");
        expect(result.model).toBe("claude-3-opus");
        expect(result.metadata.tokens).toBe(456);
    });
    it("should throw error if config is invalid (Zod enforcement)", () => {
        expect(() => new OracleAgent({})).toThrow();
    });
});
