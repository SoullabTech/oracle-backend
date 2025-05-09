// ✅ File: src/lib/symbolLinkService.ts
// Layer: 🧠 Utility – Symbol extraction from raw text

const SYMBOL_DICTIONARY = [
  'phoenix', 'mirror', 'labyrinth', 'key', 'gate', 'tree', 'shadow',
  'light', 'serpent', 'sun', 'moon', 'flower', 'fire', 'water',
];

export function extractSymbols(text: string): string[] {
  const lower = text.toLowerCase();
  return SYMBOL_DICTIONARY.filter((symbol) => lower.includes(symbol));
}
