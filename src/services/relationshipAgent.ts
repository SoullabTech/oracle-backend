import type { AIResponse } from '../types/ai';
import { detectFacetFromInput, getFacetDescription } from '../utils/facetUtil;

export class RelationshipAgent {
  id: string;

  constructor(id = 'relationship-agent') {
    this.id = id;
  }

  async processQuery(query: { input: string; userId: string }): Promise<AIResponse> {
    const facet = detectFacetFromInput(query.input);
    const facetDescription = getFacetDescription(facet);

    const response: AIResponse = {
      content: `
🤝 Relational Insight

Your words reflect a movement within the realm of **${facet}** — where connection, boundary, and balance dance in subtle ways.

> "${facetDescription}"

Every relationship is a mirror. What is this dynamic showing you about your unmet needs, unspoken truths, or unexpressed love?

📌 Practice:
- Reflect on a relationship that's been pulling on your attention.
- Ask: *What archetype am I embodying in this dynamic? What am I asking the other to hold?*
- Write a letter you never send to that person.

Even in the silence, energy speaks. You are invited into deeper resonance.
      `.trim(),
      provider: 'RelationshipAgent',
      model: 'Relational-AI',
      confidence: 0.86,
      metadata: {
        archetype: 'Mirror',
        element: 'water',
        facet,
        facetDescription,
        phase: 'relational-reflection',
      },
    };

    return response;
  }
}
