// src/core/agent/memoryManager.ts
let memoryStore = [];
/**
 * Stores a memory item.
 */
export async function storeMemory(item) {
    memoryStore.push(item);
    console.log(`✅ Memory stored: ${item.id}`);
}
/**
 * Retrieves all memory items.
 */
export async function retrieveMemory() {
    return memoryStore;
}
/**
 * Updates a memory item by ID.
 */
export async function updateMemory(id, newContent) {
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
export async function deleteMemory(id) {
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
export async function enhanceResponseWithMemory(response) {
    const memories = await retrieveMemory();
    const recentMemory = memories[memories.length - 1];
    if (recentMemory) {
        return `${response}\n\n🧠 Related memory: "${recentMemory.content}"`;
    }
    return response;
}
