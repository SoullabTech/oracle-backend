#!/bin/bash
# update_files.sh

# Update the Metadata interface in types.ts
cat > src/core/types.ts << 'EOF'
// src/core/types.ts
// ─────────────────────────────────────────────
// Interface: Response from the Oracle Agent
// ─────────────────────────────────────────────
export interface AgentResponse {
  response: string;                          // Core response text
  metadata?: Metadata;                       // Optional metadata object
  routingPath?: string[];                    // Optional list of system modules traversed
  confidence?: number;                       // Optional confidence score (0 to 1 scale)
}
// ─────────────────────────────────────────────
// Interface: Memory Item
// ─────────────────────────────────────────────
export interface MemoryItem {
  id: string;                                // Unique identifier for the memory entry
  content: string;                           // Actual content or summary
  timestamp: number;                         // Unix timestamp (ms) of creation/update
  clientId?: string;                         // Optional reference to client/user
}
// ─────────────────────────────────────────────
// Interface: User or Session Settings
// ─────────────────────────────────────────────
export interface UserSettings {
  theme: 'dark' | 'light';                   // Theme preference
  language: string;                          // Language code (e.g., 'en', 'fr')
  notificationsEnabled: boolean;             // Whether to allow in-app notifications
}
// ─────────────────────────────────────────────
// Interface: Common Metadata Format
// ─────────────────────────────────────────────
export interface Metadata {
  timestamp: string;                         // ISO string when the data was generated
  element?: string;                          // Optional: Elemental classification (e.g., Fire, Water)
  processedAt?: string;                      // Optional: Processing timestamp
  prefect?: any;                             // Optional: Prefect-specific orchestration data
  guide?: boolean;                           // Added for GuideAgent
  mentor?: boolean;                          // Added for MentorAgent
  clientId?: string;                         // Added for ClientAgent
  category?: string;                         // Added for OracleAgent
  adviceType?: string;                       // Additional field
}
// ─────────────────────────────────────────────
// Interface: System Data & Environment
// ─────────────────────────────────────────────
export interface SystemData {
  version: string;                           // App or API version string
  uptime: number;                            // Uptime in milliseconds
  environment: 'development' | 'production' | 'staging'; // Runtime environment
}
EOF

# Update guideAgent.ts to fix array spreading
sed -i '' 's/routingPath: \[\.\.\.\baseResponse\.routingPath/routingPath: baseResponse.routingPath ? [...baseResponse.routingPath/g' src/core/guideAgent.ts
sed -i '' 's/, '\''guideAgent'\''\]/, '\''guideAgent'\''\] : ['\''guideAgent'\'\']/g' src/core/guideAgent.ts

# Update orchestrator.ts to fix imports and prompt
sed -i '' 's/from '\''langchain\/llms\/openai\.js'\''/from '\''langchain\/llms\/openai'\''/g' src/core/orchestrator.ts
sed -i '' '/import { LLMChain } from '\''langchain\/chains'\'';/a\\nimport { PromptTemplate } from '\''langchain\/prompts'\'';' src/core/orchestrator.ts

# Update mainOracleAgent.ts to fix metadata initialization
sed -i '' 's/metadata: baseResponse\.metadata ?? {}/metadata: baseResponse.metadata ?? { timestamp: new Date().toISOString() }/g' src/core/mainOracleAgent.ts