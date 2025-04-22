// src/services/symbolicRouterService.ts
import { getSymbolicRoute } from "../utils/symbolicRouter";
import { detectFacetFromInput, getFacetDescription } from "../utils/facetUtil";
const archetypeMap = {
  "dream-agent": "Dream Weaver",
  "guide-agent": "Guide",
  "mentor-agent": "Mentor",
  "shadow-agent": "Shadow Walker",
  "relationship-agent": "Mirror",
  "inner-guide-agent": "Inner Seer",
  "fire-agent": "Igniter",
  "water-agent": "Healer",
  "earth-agent": "Groundkeeper",
  "air-agent": "Messenger",
  "aether-agent": "Mystic",
};
/**
 * Match symbolic input to an agent and archetype.
 */
export function matchSymbolicAgent(input) {
  const agentKey = getSymbolicRoute(input);
  if (!agentKey) return null;
  const facet = detectFacetFromInput(input);
  const facetDescription = getFacetDescription(facet);
  return {
    agent: agentKey,
    archetype: archetypeMap[agentKey],
    cueMatched: agentKey,
    facet,
    facetDescription,
    confidence: 0.9,
  };
}
