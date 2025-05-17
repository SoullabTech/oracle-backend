// src/services/memoryService.ts

export interface MemoryItem {
  userId: string;
  content: string;
  timestamp: Date;
}

const memories: MemoryItem[] = [];

export const memoryService = {
  store: (userId: string, content: string): MemoryItem => {
    const item = { userId, content, timestamp: new Date() };
    memories.push(item);
    return item;
  },

  recall: (userId: string): MemoryItem[] => {
    return memories.filter(m => m.userId === userId);
  },
};
