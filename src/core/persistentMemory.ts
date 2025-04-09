// src/core/persistentMemory.ts
import type { MemoryItem } from './types';

// Simple in-memory store for memory items
let memoryStore: MemoryItem[] = [];

/**
 * Stores a memory item in the in-memory store.
 * @param item The memory item to store.
 */
export async function storeMemory(item: MemoryItem): Promise<void> {
  memoryStore.push(item);
  console.log(`[Memory] Stored: ${item.id}`);
}

/**
 * Retrieves all memory items from the store.
 * @returns An array of MemoryItem.
 */
export async function retrieveMemory(): Promise<MemoryItem[]> {
  return memoryStore;
}

/**
 * Updates a memory item by ID.
 * @param id The ID of the memory to update.
 * @param newContent The new content for the memory.
 * @returns True if the update was successful, false otherwise.
 */
export async function updateMemory(id: string, newContent: string): Promise<boolean> {
  const index = memoryStore.findIndex(item => item.id === id);
  if (index !== -1) {
    memoryStore[index].content = newContent;
    console.log(`[Memory] Updated: ${id}`);
    return true;
  }
  return false;
}

/**
 * Deletes a memory item by ID.
 * @param id The ID of the memory to delete.
 * @returns True if the memory was deleted, false otherwise.
 */
export async function deleteMemory(id: string): Promise<boolean> {
  const initialLength = memoryStore.length;
  memoryStore = memoryStore.filter(item => item.id !== id);
  if (memoryStore.length < initialLength) {
    console.log(`[Memory] Deleted: ${id}`);
    return true;
  }
  return false;
}
