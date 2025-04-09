// src/core/agent/memoryManager.ts
let memoryStore = [];
/**
 * Stores a memory item in memoryStore.
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
 * Enhances a response by appending the latest memory.
 */
export async function enhanceResponseWithMemory(response) {
    const memories = await retrieveMemory();
    const last = memories[memories.length - 1];
    if (last) {
        return `${response}\n\n🧠 Related memory: "${last.content}"`;
    }
    return response;
}
