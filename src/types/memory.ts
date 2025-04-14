import { Metadata } from "metadata.js";


export interface MemoryItem {
  id: string;
  content: string;
  timestamp: number;
  clientId?: string;
  metadata?: Metadata;
}