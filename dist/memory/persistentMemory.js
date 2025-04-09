"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storeMemory = storeMemory;
exports.retrieveMemory = retrieveMemory;
exports.updateMemory = updateMemory;
exports.deleteMemory = deleteMemory;
let memoryStore = [];
/**
 * Stores a memory item.
 * @param item The memory item to store.
 */
async function storeMemory(item) {
    memoryStore.push(item);
    console.log(`Memory stored: ${item.id}`);
}
/**
 * Retrieves all memory items.
 * @returns An array of MemoryItem.
 */
async function retrieveMemory() {
    return memoryStore;
}
/**
 * Updates a memory item by id.
 * @param id The ID of the memory to update.
 * @param newContent The new content for the memory.
 * @returns True if the update succeeded, false otherwise.
 */
async function updateMemory(id, newContent) {
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
async function deleteMemory(id) {
    const initialLength = memoryStore.length;
    memoryStore = memoryStore.filter(item => item.id !== id);
    if (memoryStore.length < initialLength) {
        console.log(`Memory deleted: ${id}`);
        return true;
    }
    return false;
}
