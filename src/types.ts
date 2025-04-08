// src/types.ts

// Interface for the response from the Oracle Agent
export interface AgentResponse {
  response: string; // The response text
  metadata?: Record<string, any>; // Additional metadata (optional)
  routingPath?: string[]; // The routing path through the system (optional)
  confidence?: number; // Optional confidence value for the response (0 to 1 scale)
}

// Interface for a memory item
export interface MemoryItem {
  id: string; // Unique identifier for the memory item
  content: string; // Content of the memory item
  timestamp: number; // Timestamp when the memory item was created or updated
  clientId?: string; // Optional client ID for identifying the client (if needed)
}

// Interface for managing user settings (or session settings)
export interface UserSettings {
  theme: 'dark' | 'light'; // User's theme preference
  language: string; // User's language preference (e.g., 'en', 'fr')
  notificationsEnabled: boolean; // Whether notifications are enabled
}

// Define common response metadata format
export interface Metadata {
  timestamp: string; // Timestamp of when the data was generated or processed
  element?: string; // Optional element related to the query (e.g., Fire, Water, etc.)
  processedAt?: string; // When the response was processed
  prefect?: any; // Optional data related to the Prefect orchestration
}

// This can be used for any additional shared system data
export interface SystemData {
  version: string; // Version of the system or software
  uptime: number; // System uptime in milliseconds
  environment: 'development' | 'production' | 'staging'; // The environment in which the system is running
}
