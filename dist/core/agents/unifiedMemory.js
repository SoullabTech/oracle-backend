import { storeMemory, retrieveMemory } from '../memory/persistentMemory';
export async function storeInsightMemory(item) {
    await storeMemory(item);
    return item;
}
export async function getMemoryInsights(clientId) {
    const memories = await retrieveMemory();
    const userMemories = memories.filter((m) => m.clientId === clientId);
    return userMemories.map(m => m.content).join(" | ");
}
