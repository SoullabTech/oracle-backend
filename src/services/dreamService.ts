// src/services/dreamService.ts

export interface Dream {
  id: string;
  userId: string;
  text: string;
  symbols?: string[];
}

const dreams: Dream[] = [];

export const dreamService = {
  record: (dream: Dream): Dream => {
    dreams.push(dream);
    return dream;
  },

  interpret: (dream: Dream): string => {
    return `The dream contains ${dream.symbols?.join(', ') || 'no symbols'}, revealing hidden archetypes.`;
  },
};
