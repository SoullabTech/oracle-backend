// src/services/__tests__/oracleAgentInitialization.test.ts
import { describe, it, expect } from "vitest";
import { OracleAgent } from "../OracleAgent";
describe("Oracle Agent Initialization Tests", () => {
  const validConfig = {
    openaiApiKey: "test-openai-key",
    anthropicApiKey: "test-anthropic-key",
    defaultModel: "gpt-4",
    temperature: 0.7,
  };
  it("should initialize with valid config", () => {
    const agent = new OracleAgent(validConfig);
    expect(agent).toBeInstanceOf(OracleAgent);
  });
  it("should throw an error for missing config", () => {
    // @ts-expect-error - intentionally passing undefined
    expect(() => new OracleAgent()).toThrow(/Required/);
  });
  it("should throw error for invalid temperature", () => {
    const badConfig = { ...validConfig, temperature: 5 };
    expect(() => new OracleAgent(badConfig)).toThrow(
      /Number must be less than or equal to 1/,
    );
  });
  it("should throw error for invalid defaultModel", () => {
    const badConfig = { ...validConfig, defaultModel: "davinci" };
    expect(() => new OracleAgent(badConfig)).toThrow(/Invalid enum value/);
  });
  it("should throw if openaiApiKey is missing", () => {
    const badConfig = { ...validConfig };
    delete badConfig.openaiApiKey;
    expect(() => new OracleAgent(badConfig)).toThrow(/Required/);
  });
});
