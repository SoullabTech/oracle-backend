// src/services/shadowAgent.ts
"use strict";
import { extractSymbolsFromJournal } from "../utils/symbolParser";
import { detectFacetFromInput, getFacetDescription } from "../utils/facetUtil";
import { logInsight } from "../utils/oracleLogger";
/**
 * ShadowAgent: Embodies reflection on the unconscious, symbolic confrontation, and inner truth.
 */
export class ShadowAgent {
  id;
  name;
  constructor(id = "shadow-001") {
    this.id = id;
    this.name = "shadow-agent";
  }
  async processQuery(query) {
    const symbols = extractSymbolsFromJournal(query.input);
    const shadowSymbols = symbols.filter(
      (s) =>
        s.category === "shadow" ||
        (typeof s.weight === "number" && s.weight >= 5),
    );
    const symbolsText =
      shadowSymbols.length > 0
        ? shadowSymbols.map((s) => `- ${s.name || s.category}`).join("\n")
        : "- No deep symbols identified.";
    const shadowPrompt = `
🌄 Shadow Reflection 🌄

Your words: "${query.input}"

These symbols emerged from the depths:
${symbolsText}

✨ Reflect:
- What aspect of yourself are you resisting or disowning?
- How might this emotion be a messenger, not a menace?
- Where does this story repeat in your life?

The spiral calls you inward. Not to fix, but to witness.

You are not broken. You are becoming.
    `.trim();
    const facet = detectFacetFromInput(query.input);
    const facetDescription = getFacetDescription(facet);
    const response = {
      content: shadowPrompt,
      provider: "shadow-agent",
      model: "ShadowOracle-v1",
      confidence: 0.85,
      metadata: {
        archetype: "Shadow Walker",
        element: "aether",
        symbols: symbols.map((s) => s.name ?? s.category),
        facet,
        phase: "Water 2",
        reflections: [
          "Face the symbol you most avoid.",
          "Witness how the shadow conceals your gold.",
        ],
      },
    };
    await logInsight({
      userId: query.userId || "anonymous",
      insightType: "shadow_reflection",
      content: response.content,
      metadata: {
        element: "aether",
        archetype: "Shadow Walker",
        phase: "Water 2",
        facet,
        symbols: response.metadata.symbols,
      },
    });
    return response;
  }
}
