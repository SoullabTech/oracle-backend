// src/types/ai.ts

/**
 * Enumerates all supported AI response providers.
 */
export type AIProvider =
  | "openai"
  | "claude"
  | "chatgpt-oracle"
  | "elemental-oracle"
  | "dream-agent"
  | "guide-agent"
  | "mentor-agent"
  | "relationship-agent"
  | "shadow-agent";

/**
 * Standard AI response envelope with extended metadata for routing, analysis, and form generation.
 */
export interface AIResponse {
  /** Main textual content returned by the agent */
  content: string;
  /** Identifier for which provider or agent created this response */
  provider: AIProvider;
  /** Underlying model or engine name (e.g., 'gpt-4', 'claude-v1') */
  model: string;
  /** Confidence score (0-1) representing response certainty */
  confidence: number;

  metadata: {
    // ⏱️ Performance Metrics
    /** Number of tokens consumed */
    tokens?: number;
    /** Total processing time in ms */
    processingTime?: number;

    // 🔮 Elemental Mapping
    element?: string;
    facet?: string;
    phase?: string;

    // 🧙 Archetypal / Symbolic
    archetype?: string;
    symbols?: string[];
    reflections?: string[];

    // 🎯 Response Adjustments & Focus
    elementalAdjustments?: {
      tone?: string;
      style?: string;
      emphasis?: string[];
    };

    // 🪞 Routing Markers
    /** Where the request was routed from: 'dream', 'shadow', 'elemental', etc. */
    routedFrom?: string;
    /** Type of query, used for downstream logic */
    queryType?: "dream" | "mentor" | "relationship" | "story" | "default";

    // 📚 Embedded Payloads
    /** For story requests */
    storyRequest?: {
      focusArea: string;
      elementalTheme: string;
      archetype: string;
      depthLevel: number;
    };
    /** For form generation triggers */
    formRequest?: {
      type: "new-client" | "transcript" | "maintenance" | "reading";
      clientId?: string;
      context?: Record<string, any>;
    };

    [key: string]: any; // Allow for future extensions
  };
}

/**
 * Optional: Extend OracleOrchestrator return with AIResponse typing
 */
export interface OracleExtendedResponse extends AIResponse {
  agentLabel?: string;
  userId?: string;
  accessLevel?: string;
} 
