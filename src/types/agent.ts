import type { Metadata } from './metadata.js';

export interface AgentResponse {
  response: string;
  metadata?: Metadata;
  routingPath?: string[];
  memoryEnhanced?: boolean;
}