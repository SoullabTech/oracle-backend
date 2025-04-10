export interface MemoryItem {
    id: string;
    content: string;
    timestamp: number;
    clientId?: string;
}
/**
 * Stores a memory item in memoryStore.
 */
export declare function storeMemory(item: MemoryItem): Promise<void>;
/**
 * Retrieves all memory items.
 */
export declare function retrieveMemory(): Promise<MemoryItem[]>;
/**
 * Enhances a response by appending the latest memory.
 */
export declare function enhanceResponseWithMemory(response: string): Promise<string>;
