// src/core/agent/memoryManager.ts

export interface MemoryItem {
  id: string;
  content: string;
  timestamp: number;
  clientId?: string;
}

let memoryStore: MemoryItem[] = [];

/**
 * Stores a memory item in memoryStore.
 */
export async function storeMemory(item: MemoryItem): Promise<void> {
  memoryStore.push(item);
  console.log(`✅ Memory stored: ${item.id}`);
}

/**
 * Retrieves all memory items.
 */
export async function retrieveMemory(): Promise<MemoryItem[]> {
  return memoryStore;
}

/**
 * Enhances a response by appending the latest memory.
 */
export async function enhanceResponseWithMemory(response: string): Promise<string> {
  const memories = await retrieveMemory();
  const last = memories[memories.length - 1];
  if (last) {
    return `${response}\n\n🧠 Related memory: "${last.content}"`;
  }
  return response;
}
