import type { Metadata } from './metadata.js';

export interface Session {
  id: string;
  clientId: string;
  startTime: string;
  meta: Metadata;
  status: 'active' | 'completed';
}

export interface SessionStats {
  totalSessions: number;
  activeSessions: number;
  completedSessions: number;
  lastSessionTime: string;
  clientId: string;
}