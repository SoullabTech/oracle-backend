// src/services/__mocks__/langchain.ts
export const LLMChain = vi.fn().mockImplementation(() => ({
  call: vi.fn().mockResolvedValue("Mocked LLM Response"),
}));
export const PromptTemplate = vi.fn().mockImplementation(() => ({
  apply: vi.fn().mockResolvedValue("Mocked Prompt Output"),
}));
export const langChainClient = {
  LLMChain,
  PromptTemplate,
};
