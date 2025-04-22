import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import type { AIResponse } from "../types/ai";
import { MemoryService } from "./memoryService"; // 👈 import the service
import logger from "../utils/logger";

export const oracleAgentConfigSchema = z.object({
  openaiApiKey: z.string(),
  anthropicApiKey: z.string(),
  defaultModel: z.enum(["gpt-4", "claude-3"]),
  temperature: z.number().min(0).max(1).default(0.7),
});

export type OracleAgentConfig = z.infer<typeof oracleAgentConfigSchema>;

const OPENAI_MODEL = "gpt-4-turbo-preview";
const CLAUDE_MODEL = "claude-3-opus-20240229";

export class OracleAgent {
  private openai: OpenAI;
  private anthropic: Anthropic;
  private config: OracleAgentConfig;
  private memoryService: MemoryService;

  constructor(config: OracleAgentConfig) {
    this.config = oracleAgentConfigSchema.parse(config);
    this.openai = new OpenAI({ apiKey: this.config.openaiApiKey });
    this.anthropic = new Anthropic({ apiKey: this.config.anthropicApiKey });
    this.memoryService = new MemoryService(); // 👈 instantiate
  }

  async performTask(
    prompt: string,
    clientId = "anonymous",
  ): Promise<AIResponse> {
    try {
      // 🧠 Store prompt as memory
      await this.memoryService.storeMemory({
        clientId,
        content: prompt,
        metadata: { role: "user", source: "oracle" },
      });

      // (Optional) Retrieve previous context
      const previous = await this.memoryService.retrieveMemories(clientId);

      if (this.config.defaultModel === "gpt-4") {
        const completion = await this.openai.chat.completions.create({
          model: OPENAI_MODEL,
          messages: [
            ...previous
              .slice(-3)
              .map((m) => ({ role: "user", content: m.content })),
            { role: "user", content: prompt },
          ],
          temperature: this.config.temperature,
        });

        const responseContent = completion.choices[0].message.content ?? "";

        // 🧠 Store AI response as memory
        await this.memoryService.storeMemory({
          clientId,
          content: responseContent,
          metadata: { role: "oracle", source: "openai" },
        });

        return {
          content: responseContent,
          provider: "openai",
          model: OPENAI_MODEL,
          confidence: 0.9,
          metadata: {
            tokens: completion.usage?.total_tokens ?? 0,
            processingTime: 0,
          },
        };
      } else {
        const message = await this.anthropic.messages.create({
          model: CLAUDE_MODEL,
          messages: [
            ...previous
              .slice(-3)
              .map((m) => ({ role: "user", content: m.content })),
            { role: "user", content: prompt },
          ],
          temperature: this.config.temperature,
        });

        const responseText = message.content[0]?.text ?? "";

        // 🧠 Store AI response as memory
        await this.memoryService.storeMemory({
          clientId,
          content: responseText,
          metadata: { role: "oracle", source: "anthropic" },
        });

        return {
          content: responseText,
          provider: "anthropic",
          model: CLAUDE_MODEL,
          confidence: 0.9,
          metadata: {
            tokens: message.usage?.output_tokens ?? 0,
            processingTime: 0,
          },
        };
      }
    } catch (err: any) {
      logger.error("OracleAgent task failed", { error: err.message || err });
      throw new Error(`OracleAgent error: ${err.message || err}`);
    }
  }
}
