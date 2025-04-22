// src/services/innerGuideAgent.ts
"use strict";
import { extractSymbolsFromJournal } from "../utils/symbolParser";
import { detectFacetFromInput, getFacetDescription } from "../utils/facetUtil";
import { logInsight } from "../utils/oracleLogger";
/**
 * InnerGuideAgent: Offers symbolic interpretation and reflection prompts.
 */
export class InnerGuideAgent {
  id;
  name;
  constructor(id = "inner-guide-agent") {
    this.id = id;
    this.name = "inner-guide-agent";
  }
  async processQuery(query) {
    const symbols = extractSymbolsFromJournal(query.input);
    const facet = detectFacetFromInput(query.input);
    const facetDescription = getFacetDescription(facet);
    const insights =
      symbols.length > 0
        ? symbols
            .map(
              (sym) =>
                `- ${sym.category}: a reflection of your inner landscape`,
            )
            .join("\n")
        : "- No major symbols detected";
    const content = `
🌌 Inner Guide Reflection

You are moving through the **${facet}** gate of awareness.

> "${facetDescription}"

These are the symbols present in your field right now:

${insights}

🌀 Journal Prompts:
- What part of you is seeking attention or transformation?
- If you could give this feeling a voice, what would it say?
- What recurring patterns are asking for resolution?

Let the silence between the symbols speak. Integration is underway.
    `.trim();
    const response = {
      content,
      provider: this.name,
      model: "Symbolic-AI",
      confidence: 0.89,
      metadata: {
        archetype: "Inner Seer",
        element: "aether",
        facet,
        facetDescription,
        symbols: symbols.map((s) => s.name ?? s.category),
        phase: "soul-reflection",
        reflections: [
          "Your inner guide asks not for answers, but for attention.",
          "Symbolic truth is quieter than thought, but deeper than logic.",
        ],
      },
    };
    await logInsight({
      userId: query.userId || "anonymous",
      insightType: "symbolic_reflection",
      content: response.content,
      metadata: {
        element: "aether",
        archetype: "Inner Seer",
        phase: "soul-reflection",
        facet,
        symbols: response.metadata.symbols,
      },
    });
    return response;
  }
}
