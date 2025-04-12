import type { MemoryItem } from '../types';
import { MetaService } from './metaService';

export class MemoryService {
  private memories: MemoryItem[] = [];

  async storeMemory(memory: Omit<MemoryItem, 'timestamp'>): Promise<MemoryItem> {
    const newMemory: MemoryItem = {
      ...memory,
      timestamp: Date.now(),
      metadata: MetaService.createMeta()
    };

    this.memories.push(newMemory);
    return newMemory;
  }

  async retrieveMemories(clientId?: string): Promise<MemoryItem[]> {
    if (clientId) {
      return this.memories.filter(m => m.clientId === clientId);
    }
    return this.memories;
  }

  async updateMemory(id: string, content: string): Promise<boolean> {
    const index = this.memories.findIndex(m => m.id === id);
    if (index === -1) return false;

    this.memories[index] = {
      ...this.memories[index],
      content,
      metadata: MetaService.enrichMeta(
        this.memories[index].metadata || {},
        { lastModified: new Date().toISOString() }
      )
    };

    return true;
  }

  async deleteMemory(id: string): Promise<boolean> {
    const initialLength = this.memories.length;
    this.memories = this.memories.filter(m => m.id !== id);
    return this.memories.length < initialLength;
  }

  async getMemoryInsights(clientId: string): Promise<string[]> {
    const clientMemories = await this.retrieveMemories(clientId);
    if (clientMemories.length === 0) {
      return ["No memories found for analysis"];
    }

    return [
      "Insight 1: Patterns show consistent engagement",
      "Insight 2: Memory retention improving over time",
      "Insight 3: Key concepts are being reinforced"
    ];
  }
}