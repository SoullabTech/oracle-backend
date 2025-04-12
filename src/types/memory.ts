import type { Metadata } from './metadata';

export interface MemoryItem {
  id: string;
  content: string;
  timestamp: number;
  clientId?: string;
  metadata?: Metadata;
}