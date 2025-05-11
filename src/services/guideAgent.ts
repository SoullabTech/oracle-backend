import type { AIResponse } from '../types/ai';
import { detectFacetFromInput, getFacetDescription } from '../utils/facetUtil;

export class GuideAgent {
  id: string;

  constructor(id = 'guide-agent') {
    this.id = id;
  }

  async processQuery(query: { input: string; userId: string }): Promise<AIResponse> {
    const facet = detectFacetFromInput(query.input);
    const facetDescription = getFacetDescription(facet);

    const response: AIResponse = {
      content: `
🧭 Guide’s Reflection

You stand at the doorway of **${facet}**.

> "${facetDescription}"

This stage calls for remembering your original vow — the inner guidance that shaped your path. Breathe. Listen. What truth have you been avoiding that now wants to speak?

You’re not alone. There are unseen hands helping you evolve.

📌 Practice:
Sit quietly and ask: *What wants to be known through me?*
Write down the first words that arise without filtering.
      `.trim(),
      provider: 'GuideAgent',
      model: 'Guide-AI',
      confidence: 0.87,
      metadata: {
        archetype: 'Guide',
        element: 'aether',
        facet,
        facetDescription,
        phase: 'reflection',
      },
    };

    return response;
  }
}
