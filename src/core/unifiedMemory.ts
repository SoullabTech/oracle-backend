// src/core/unifiedMemory.ts
import { storeMemory, retrieveMemory } from '../memory/persistentMemory';
import type { MemoryItem } from '../memory/persistentMemory';

/**
 * Stores a memory item with additional processing.
 * In a more advanced version, you could analyze the content to generate
 * a "strength" rating or classify the insight type.
 *
 * @param item A memory item to store.
 * @returns A promise that resolves to the stored memory item.
 */
export async function storeInsightMemory(item: MemoryItem): Promise<MemoryItem> {
  // (Advanced processing can be added here)
  await storeMemory(item);
  return item;
}

/**
 * Retrieves and aggregates memory insights for a specific client.
 *
 * @param clientId The client identifier.
 * @returns A concatenated string of all memory contents for that client.
 */
export async function getMemoryInsights(clientId: string): Promise<string> {
  const memories = await retrieveMemory();
  const userMemories = memories.filter(m => m.clientId === clientId);
  return userMemories.map(m => m.content).join(" | ");
}
