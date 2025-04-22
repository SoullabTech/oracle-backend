// src/core/agents/relationshipAgent.ts
"use strict";
import {
  detectFacetFromInput,
  getFacetDescription,
} from "../../utils/facetUtil";
import { logInsight } from "../../utils/oracleLogger";
import { feedbackPrompts } from "../../constants/feedbackPrompts";
import MemoryModule from "../utils/memoryModule";

/**
 * RelationshipAgent: Offers reflective insight on relational dynamics and connection.
 */
export class RelationshipAgent {
  id;
  constructor(id = "relationship-agent") {
    this.id = id;
  }
  async processQuery(query) {
    const facet = detectFacetFromInput(query.input);
    const facetDescription = getFacetDescription(facet);
    const contextMemory = MemoryModule.getRecentEntries(2);
    const reflection = `
🤝 Relational Insight

Your words reflect a movement within the realm of **${facet}** — where connection, boundary, and balance dance in subtle ways.

> "${facetDescription}"

Every relationship is a mirror. What is this dynamic showing you about your unmet needs, unspoken truths, or unexpressed love?

📌 Practice:
- Reflect on a relationship that's been pulling on your attention.
- Ask: *What archetype am I embodying in this dynamic? What am I asking the other to hold?*
- Write a letter you never send to that person.

Even in the silence, energy speaks. You are invited into deeper resonance.
    `.trim();
    const response = {
      content: reflection,
      provider: "relationship-agent",
      model: "Relational-AI",
      confidence: 0.86,
      metadata: {
        archetype: "Mirror",
        element: "water",
        facet,
        facetDescription,
        phase: "relational-reflection",
        routedFrom: "symbolic",
        queryType: "relationship",
        context: contextMemory,
      },
      feedbackPrompt: feedbackPrompts.symbolic,
    };
    // Log insight related to the relational reflection
    await logInsight({
      userId: query.userId || "anonymous",
      insightType: "relationship_reflection",
      content: reflection,
      metadata: {
        element: "water",
        archetype: "Mirror",
        phase: "relational-reflection",
        facet,
        context: contextMemory,
      },
    });
    return response;
  }
}
export default RelationshipAgent;
