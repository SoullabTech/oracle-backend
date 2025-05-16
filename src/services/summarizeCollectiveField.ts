import { getRecentMemoryItems } from "../lib/memoryStore";
import { extractElementIndex, extractEmotionalTone, extractSymbols } from "../lib/fieldParsers";

export async function summarizeCollectiveField(): Promise<FieldPulseSummary> {
  const memories = await getRecentMemoryItems(72); // hours

  const allTexts = memories.map(m => m.content).join(" ");
  const elementIndex = extractElementIndex(allTexts);
  const emotionalPulse = extractEmotionalTone(allTexts);
  const topSymbols = extractSymbols(allTexts);

  const oracleEcho = generateOracleEcho(topSymbols, emotionalPulse);

  return {
    date: new Date().toISOString().split("T")[0],
    topSymbols,
    elementIndex,
    emotionalPulse,
    oracleEcho
  };
}

type FieldPulseSummary = {
  date: string;
  topSymbols: string[];
  elementIndex: Record<string, number>;
  emotionalPulse: Record<string, number>;
  oracleEcho: string;
};

// Simple example — can be replaced with LLM synthesis
function generateOracleEcho(symbols: string[], emotionMap: Record<string, number>): string {
  const primaryEmotion = Object.entries(emotionMap).sort((a, b) => b[1] - a[1])[0]?.[0] || "mystery";
  return `Many are feeling ${primaryEmotion}. Oracle speaks: The symbol of "${symbols[0]}" is appearing. Reflect on what it asks of you.`;
}
