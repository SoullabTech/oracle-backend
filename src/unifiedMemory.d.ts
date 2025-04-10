import type { MemoryItem } from '../core/types.js';
export declare function storeInsightMemory(item: MemoryItem): Promise<MemoryItem>;
export declare function getMemoryInsights(clientId: string): Promise<string>;
