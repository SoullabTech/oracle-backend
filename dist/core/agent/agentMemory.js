"use strict";
// src/core/agent/memoryManager.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.storeMemory = storeMemory;
exports.retrieveMemory = retrieveMemory;
exports.enhanceResponseWithMemory = enhanceResponseWithMemory;
let memoryStore = [];
/**
 * Stores a memory item in memoryStore.
 */
async function storeMemory(item) {
    memoryStore.push(item);
    console.log(`✅ Memory stored: ${item.id}`);
}
/**
 * Retrieves all memory items.
 */
async function retrieveMemory() {
    return memoryStore;
}
/**
 * Enhances a response by appending the latest memory.
 */
async function enhanceResponseWithMemory(response) {
    const memories = await retrieveMemory();
    const last = memories[memories.length - 1];
    if (last) {
        return `${response}\n\n🧠 Related memory: "${last.content}"`;
    }
    return response;
}
