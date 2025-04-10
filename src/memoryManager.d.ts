export interface MemoryItem {
    id: string;
    content: string;
    timestamp: number;
    clientId?: string;
}
/**
 * Stores a memory item.
 */
export declare function storeMemory(item: MemoryItem): Promise<void>;
/**
 * Retrieves all memory items.
 */
export declare function retrieveMemory(): Promise<MemoryItem[]>;
/**
 * Updates a memory item by ID.
 */
export declare function updateMemory(id: string, newContent: string): Promise<boolean>;
/**
 * Deletes a memory item by ID.
 */
export declare function deleteMemory(id: string): Promise<boolean>;
/**
 * Enhances a response by appending related memory (naively for now).
 */
export declare function enhanceResponseWithMemory(response: string): Promise<string>;
