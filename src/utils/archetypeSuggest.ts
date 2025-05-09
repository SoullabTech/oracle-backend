// File: /src/utils/archetypeSuggest.ts
// Layer: 🧠 Utility — Suggests Archetype Names Based on Tone, Element, or Prompts

const archetypeMatrix: Record<string, string[]> = {
    Fire: ['Visionary', 'Initiator', 'Rebel'],
    Water: ['Mystic', 'Empath', 'Alchemist'],
    Earth: ['Steward', 'Builder', 'Anchor'],
    Air: ['Strategist', 'Messenger', 'Diplomat'],
    Aether: ['Oracle', 'Unifier', 'Seer'],
  };
  
  export function suggestArchetypes({ element, tone }: { element: string; tone: string }) {
    const suggestions = new Set<string>();
  
    if (archetypeMatrix[element]) {
      archetypeMatrix[element].forEach((a) => suggestions.add(a));
    }
  
    if (tone) {
      const toneLower = tone.toLowerCase();
      if (toneLower.includes('sage')) suggestions.add('Seer');
      if (toneLower.includes('shadow')) suggestions.add('Wounded Guide');
      if (toneLower.includes('playful')) suggestions.add('Trickster');
      if (toneLower.includes('healer')) suggestions.add('Shaman');
      if (toneLower.includes('mystic')) suggestions.add('Dreamer');
    }
  
    return Array.from(suggestions);
  }
  