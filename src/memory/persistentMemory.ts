export interface MemoryItem {
  id: string;
  content: string;
  timestamp: number;
  clientId?: string;
}

let memoryStore: MemoryItem[] = [];

/**
 * Stores a memory item.
 * @param item The memory item to store.
 */
export async function storeMemory(item: MemoryItem): Promise<void> {
  memoryStore.push(item);
  console.log(`Memory stored: ${item.id}`);
}

/**
 * Retrieves all memory items.
 * @returns An array of MemoryItem.
 */
export async function retrieveMemory(): Promise<MemoryItem[]> {
  return memoryStore;
}

/**
 * Updates a memory item by id.
 * @param id The ID of the memory to update.
 * @param newContent The new content for the memory.
 * @returns True if the update succeeded, false otherwise.
 */
export async function updateMemory(id: string, newContent: string): Promise<boolean> {
  const index = memoryStore.findIndex(item => item.id === id);
  if (index !== -1) {
    memoryStore[index].content = newContent;
    console.log(`Memory updated: ${id}`);
    return true;
  }
  return false;
}

/**
 * Deletes a memory item by id.
 * @param id The ID of the memory to delete.
 * @returns True if deletion succeeded, false otherwise.
 */
export async function deleteMemory(id: string): Promise<boolean> {
  const initialLength = memoryStore.length;
  memoryStore = memoryStore.filter(item => item.id !== id);
  if (memoryStore.length < initialLength) {
    console.log(`Memory deleted: ${id}`);
    return true;
  }
  return false;
}export {};
