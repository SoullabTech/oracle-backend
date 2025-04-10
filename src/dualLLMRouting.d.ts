export type LLMProvider = 'gpt' | 'claude';
/**
 * Selects an LLM provider based on simple keyword heuristics.
 * For example, if the query contains words related to feelings or spirituality, it selects 'claude';
 * otherwise, it defaults to 'gpt'.
 *
 * @param query The user query.
 * @returns 'claude' if the query appears emotional or spiritual, otherwise 'gpt'.
 */
export declare function selectLLM(query: string): LLMProvider;
/**
 * Simulates calling an LLM provider.
 * In a full implementation, this function would call external APIs (e.g., OpenAI or Anthropic).
 *
 * @param provider The selected LLM provider.
 * @param query The query to process.
 * @returns A simulated response string.
 */
export declare function callLLM(provider: LLMProvider, query: string): Promise<string>;
