// src/services/symbolicRouterService.ts
import { getSymbolicRoute } from "../utils/symbolicRouter";
import { logOracleInsight } from "../utils/oracleLogger";
import { storeMemoryItem } from "./memoryService";
/**
 * Handles symbolic routing based on the user query.
 * Returns the appropriate agent key and logs routing metadata.
 */
export async function routeSymbolically(query) {
  const agentKey = getSymbolicRoute(query.input);
  if (agentKey) {
    // Log symbolic match to memory
    await storeMemoryItem({
      content: `Symbolic cue detected: routed to ${agentKey}`,
      element: "aether",
      sourceAgent: "symbolic-router",
      clientId: query.userId,
      confidence: 1,
      metadata: {
        role: "router",
        cue: agentKey,
        routed: true,
        input: query.input,
      },
    });
    // Log as an oracle insight
    await logOracleInsight({
      anon_id: query.userId,
      element: "aether",
      archetype: "Symbolic Router",
      insight: `Routed to ${agentKey} based on symbolic cue.`,
      emotion: 0.5,
      phase: "routing",
    });
  }
  return agentKey;
}
