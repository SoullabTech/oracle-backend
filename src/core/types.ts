// src/core/types.ts

// ─────────────────────────────────────────────
// Interface: Response from the Oracle Agent
// ─────────────────────────────────────────────
export interface AgentResponse {
  response: string;            // Core response text
  metadata?: Metadata;         // Optional metadata object
  routingPath?: string[];      // Optional list of system modules traversed
  confidence?: number;         // Optional confidence score (0 to 1 scale)
}

// ─────────────────────────────────────────────
// Interface: Memory Item
// ─────────────────────────────────────────────
export interface MemoryItem {
  id: string;                  // Unique identifier for the memory entry
  content: string;             // Actual content or summary
  timestamp: number;           // Unix timestamp (ms) of creation/update
  clientId?: string;           // Optional reference to client/user
}

// ─────────────────────────────────────────────
// Interface: User or Session Settings
// ─────────────────────────────────────────────
export interface UserSettings {
  theme: 'dark' | 'light';     // Theme preference
  language: string;            // Language code (e.g., 'en', 'fr')
  notificationsEnabled: boolean; // Whether notifications are enabled
}

// ─────────────────────────────────────────────
// Interface: Common Metadata Format
// ─────────────────────────────────────────────
export interface Metadata {
  timestamp: string;           // ISO string when the data was generated
  element?: string;            // Optional: Elemental classification (e.g., Fire, Water)
  processedAt?: string;        // Optional: Processing timestamp
  prefect?: any;               // Optional: Prefect-specific orchestration data
  guide?: boolean;             // Optional: Indicates guide-specific enhancements
  mentor?: boolean;            // Optional: Indicates mentor-specific enhancements
  adviceType?: string;         // Optional: Added advice type for mentor agent responses
}

// ─────────────────────────────────────────────
// Interface: System Data & Environment
// ─────────────────────────────────────────────
export interface SystemData {
  version: string;             // App or API version string
  uptime: number;              // Uptime in milliseconds
  environment: 'development' | 'production' | 'staging'; // Runtime environment
}
