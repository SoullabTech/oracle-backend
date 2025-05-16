import type { AIResponse } from '../types/ai.js';
import type { QueryInput } from '../types/oracle.js';
import { extractSymbolsFromJournal } from '../utils/symbolParser;
import { detectFacetFromInput, getFacetDescription } from .js'../utils/facetUtil;
import { logOracleInsight } from ../utils/oracleLogger';

export class ShadowAgent {
  id: string;
  name: string;

  constructor(id = 'shadow-001') {
    this.id = id;
    this.name = 'ShadowAgent';
  }

  async processQuery(query: QueryInput): Promise<AIResponse> {
    const symbols = extractSymbolsFromJournal(query.input);
    const shadowSymbols = symbols.filter(s => s.category === 'shadow' || s.weight >= 5);

    const shadowPrompt = `
🜄 Shadow Reflection 🜄

Your words: "${query.input}"

These symbols emerged from the depths:  
${shadowSymbols.map(s => `- ${s.name || s.category}`).join('\n')}

✨ Reflect:
- What aspect of yourself are you resisting or disowning?
- How might this emotion be a messenger, not a menace?
- Where does this story repeat in your life?

The spiral calls you inward. Not to fix, but to witness.

You are not broken. You are becoming.
    `.trim();

    const detectedFacet = detectFacetFromInput(query.input);
    const facetDescription = getFacetDescription(detectedFacet);

    const response: AIResponse = {
      content: shadowPrompt,
      provider: this.name,
      model: 'ShadowOracle-v1',
      confidence: 0.85,
      metadata: {
        archetype: 'Shadow Walker',
        element: 'aether',
        symbols,
        facet: detectedFacet,
        facetDescription,
        phase: 'Water 2',
      }
    };

    await logOracleInsight({
      anon_id: query.userId,
      element: 'aether',
      archetype: 'Shadow Walker',
      insight: response.content,
      emotion: 0.4,
      phase: 'Water 2',
      facet: detectedFacet
    });

    return response;
  }
}
