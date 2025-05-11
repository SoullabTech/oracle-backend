// src/utils/symbolicRouter.ts
/**
 * Define symbolic routing cues and the agent that should handle them.
 */
const symbolicRoutingTable = [
  { pattern: /\bdream(s)?\b|\bvision\b|\bnightmare\b/i, agent: "dream-agent" },
  {
    pattern: /\b(need guidance|what should i do|i feel stuck|guide me)\b/i,
    agent: "guide-agent",
  },
  {
    pattern: /\bmentor\b|\bgrowth\b|\bencouragement\b|\binspiration\b/i,
    agent: "mentor-agent",
  },
  {
    pattern:
      /\bshadow\b|\bfear\b|\bsubconscious\b|\bpattern(s)?\b|\binner demon(s)?\b/i,
    agent: "shadow-agent",
  },
  {
    pattern:
      /\b(relationship|partner|friend|parent|conflict|love|connection)\b/i,
    agent: "relationship-agent",
  },
  {
    pattern:
      /\b(inner voice|journal|reflection|symbol|dream journal|meditation)\b/i,
    agent: "inner-guide-agent",
  },
];
/**
 * Scans the input string for symbolic cues and returns the matching agent key.
 * @param input - The user input
 * @returns The agent key or null
 */
export function getSymbolicRoute(input) {
  for (const entry of symbolicRoutingTable) {
    if (entry.pattern.test(input)) {
      return entry.agent;
    }
  }
  return null;
}
