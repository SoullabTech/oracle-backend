"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storeInsightMemory = storeInsightMemory;
exports.getMemoryInsights = getMemoryInsights;
// src/core/unifiedMemory.ts
const persistentMemory_1 = require("../memory/persistentMemory");
/**
 * Stores a memory item with additional processing.
 * In a more advanced version, you could analyze the content to generate
 * a "strength" rating or classify the insight type.
 *
 * @param item A memory item to store.
 * @returns A promise that resolves to the stored memory item.
 */
async function storeInsightMemory(item) {
    // (Advanced processing can be added here)
    await (0, persistentMemory_1.storeMemory)(item);
    return item;
}
/**
 * Retrieves and aggregates memory insights for a specific client.
 *
 * @param clientId The client identifier.
 * @returns A concatenated string of all memory contents for that client.
 */
async function getMemoryInsights(clientId) {
    const memories = await (0, persistentMemory_1.retrieveMemory)();
    const userMemories = memories.filter(m => m.clientId === clientId);
    return userMemories.map(m => m.content).join(" | ");
}
