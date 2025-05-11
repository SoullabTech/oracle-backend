import { storeMemory, retrieveMemory } from '../memory/persistentMemory;
import type { MemoryItem } from '../core/types;

export async function storeInsightMemory(item: MemoryItem): Promise<MemoryItem> {
  await storeMemory(item);
  return item;
}

export async function getMemoryInsights(clientId: string): Promise<string> {
  const memories = await retrieveMemory();
  const userMemories = memories.filter((m: MemoryItem) => m.clientId === clientId);
  return userMemories.map(m => m.content).join(" | ");
}