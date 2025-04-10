import type { MemoryItem } from '../core/types.js';
export declare function storeMemory(memory: MemoryItem): Promise<MemoryItem>;
export declare function getMemoryInsights(): Promise<string[]>;
