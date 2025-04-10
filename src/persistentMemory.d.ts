import type { MemoryItem } from '../core/types.js';
export declare function storeMemory(item: MemoryItem): Promise<void>;
export declare function retrieveMemory(): Promise<MemoryItem[]>;
export declare function updateMemory(id: string, newContent: string): Promise<boolean>;
export declare function deleteMemory(id: string): Promise<boolean>;
