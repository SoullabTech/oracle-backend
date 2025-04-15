import type { MemoryItem } from '../types.js';
import { storeMemory, retrieveMemory } from './persistentMemory.js';

export async function storeInsightMemory(item: MemoryItem): Promise<MemoryItem> {
  await storeMemory(item);
  return item;
}

export async function getMemoryInsights(clientId: string): Promise<string> {
  const memories = await retrieveMemory();
  const userMemories = memories.filter((m: MemoryItem) => m.clientId === clientId);
  return userMemories.map(m => m.content).join(" | ");
}