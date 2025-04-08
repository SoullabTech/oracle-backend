// src/core/agent/memoryManager.ts

export interface MemoryItem {
  id: string;
  content: string;
  timestamp: number;
  clientId?: string;
}

let memoryStore: MemoryItem[] = [];

/**
 * Stores a memory item.
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
 * Updates a memory item by ID.
 */
export async function updateMemory(id: string, newContent: string): Promise<boolean> {
  const index = memoryStore.findIndex(item => item.id === id);
  if (index !== -1) {
    memoryStore[index].content = newContent;
    console.log(`✏️ Memory updated: ${id}`);
    return true;
  }
  return false;
}

/**
 * Deletes a memory item by ID.
 */
export async function deleteMemory(id: string): Promise<boolean> {
  const initialLength = memoryStore.length;
  memoryStore = memoryStore.filter(item => item.id !== id);
  if (memoryStore.length < initialLength) {
    console.log(`🗑️ Memory deleted: ${id}`);
    return true;
  }
  return false;
}

/**
 * Enhances a response by appending related memory (naively for now).
 */
export async function enhanceResponseWithMemory(response: string): Promise<string> {
  const memories = await retrieveMemory();
  const recentMemory = memories[memories.length - 1];
  if (recentMemory) {
    return `${response}\n\n🧠 Related memory: "${recentMemory.content}"`;
  }
  return response;
}
