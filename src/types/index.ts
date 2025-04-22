import { User as SupabaseUser } from "@supabase/supabase-js";
import { Request } from "express";

// Interface for Authenticated Request with a User from Supabase
export interface AuthenticatedRequest extends Request {
  user?: SupabaseUser; // Assuming 'user' can be optional in case of unauthenticated requests
}

// Custom User Interface if needed
export interface User {
  id: string;
  email: string;
  created_at: string;
  last_login?: string; // Optional if no login yet
  role?: string; // Optional role field, might be needed for role-based access control
}

// Memory Interface for storing memories
export interface Memory {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  metadata?: Record<string, unknown>;
}

// Session Interface for tracking sessions
export interface Session {
  id: string;
  user_id: string;
  started_at: string;
  ended_at?: string; // Optional if still active
  status: "active" | "completed"; // Track session status
  metadata?: Record<string, unknown>;
}

// SessionStats Interface for aggregate session data
export interface SessionStats {
  totalSessions: number;
  activeSessions: number;
  completedSessions: number;
  lastSessionTime: string;
  clientId: string;
}

// Export additional types from other files
export * from "./auth";
export * from "./memory";
export * from "./session";
