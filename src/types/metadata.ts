// src/types/metadata.ts
export interface Metadata {
    timestamp: number;
    clientId?: string;
    guide?: string;
    mentor?: string;
    category?: string;
    adviceType?: string; // This line must be present
  }
  