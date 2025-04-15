// src/types/flowTypes.ts
import type { Session, SessionStats } from './someSharedTypes'; // Adjust path if needed.
import type { MemoryItem } from './coreTypes';

export interface FlowResult {
  success: boolean;
  error?: string;
  data?: any;
}

export interface LearningFlowStart {
  session: Session;
  initialMemory: MemoryItem;
}

export interface LearningFlowInteraction {
  memory: MemoryItem;
  insights: string[];
}

export interface LearningFlowCompletion {
  sessionStats: SessionStats;
  finalInsights: string[];
}
