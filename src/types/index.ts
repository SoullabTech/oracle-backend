// src/types/index.ts - Update or create this interface

import { User } from '@supabase/supabase-js';
import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user: User;
}

export interface User {
  id: string;
  email: string;
  created_at: string;
  last_login?: string;
}

export interface Memory {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  metadata?: Record<string, unknown>;
}

export interface Session {
  id: string;
  user_id: string;
  started_at: string;
  ended_at?: string;
  status: 'active' | 'completed';
  metadata?: Record<string, unknown>;
}

export interface SessionStats {
  totalSessions: number;
  activeSessions: number;
  completedSessions: number;
  lastSessionTime: string;
  clientId: string;
}

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role?: string;
  };
}

export * from './auth.js';
export * from './memory.js';
export * from './session.js';