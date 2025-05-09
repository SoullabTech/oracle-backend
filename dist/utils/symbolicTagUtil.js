// File: /src/utils/symbolicTagUtil.ts
// Layer: 🔁 Backend (utility module)
const symbolMap = {
    Phoenix: { symbol: "Phoenix", element: "Fire", archetype: "Initiator", phaseHint: "Fire2" },
    Mirror: { symbol: "Mirror", element: "Water", archetype: "Reflector", phaseHint: "Water1" },
    Labyrinth: { symbol: "Labyrinth", element: "Earth", archetype: "Seeker", phaseHint: "Earth2" },
    Flame: { symbol: "Flame", element: "Fire", archetype: "Visionary", phaseHint: "Fire1" },
    Ocean: { symbol: "Ocean", element: "Water", archetype: "Mystic", phaseHint: "Water2" },
    Wind: { symbol: "Wind", element: "Air", archetype: "Messenger", phaseHint: "Air1" },
    Star: { symbol: "Star", element: "Aether", archetype: "Oracle", phaseHint: "Aether1" },
};
export function extractSymbol(text) {
    const symbols = Object.keys(symbolMap);
    for (const symbol of symbols) {
        if (text.includes(symbol)) {
            return symbolMap[symbol];
        }
    }
    const fallback = text.match(/\b[A-Z][a-z]{3,}\b/);
    if (fallback) {
        const generic = fallback[0];
        return {
            symbol: generic,
            element: "Aether",
            archetype: "Explorer",
            phaseHint: "Aether3"
        };
    }
    return {
        symbol: "Dream",
        element: "Water",
        archetype: "Alchemist",
        phaseHint: "Water3"
    };
}
