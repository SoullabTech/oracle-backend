import type { AIResponse } from '../types/ai';
import { extractSymbolsFromJournal } from '../utils/symbolParser';
import { detectFacetFromInput, getFacetDescription } from '../utils/facetUtil';

export class InnerGuideAgent {
  id: string;

  constructor(id = 'inner-guide-agent') {
    this.id = id;
  }

  async processQuery(query: { input: string; userId: string }): Promise<AIResponse> {
    const symbols = extractSymbolsFromJournal(query.input);
    const facet = detectFacetFromInput(query.input);
    const facetDescription = getFacetDescription(facet);

    const insights = symbols.map(sym => `- ${sym.category}: a reflection of your inner landscape`).join('\n');

    const response: AIResponse = {
      content: `
🌌 Inner Guide Reflection

You are moving through the **${facet}** gate of awareness.

> "${facetDescription}"

These are the symbols present in your field right now:

${insights || '- No major symbols detected'}

🌀 Journal Prompts:
- What part of you is seeking attention or transformation?
- If you could give this feeling a voice, what would it say?
- What recurring patterns are asking for resolution?

Let the silence between the symbols speak. Integration is underway.
      `.trim(),
      provider: 'InnerGuideAgent',
      model: 'Symbolic-AI',
      confidence: 0.89,
      metadata: {
        archetype: 'Inner Seer',
        element: 'aether',
        facet,
        facetDescription,
        symbols,
        phase: 'soul-reflection',
      },
    };

    return response;
  }
}
