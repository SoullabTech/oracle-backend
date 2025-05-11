// src/services/dreamService.ts
import { openai } from "../lib/supabaseClient";
/**
 * Interprets symbolic or recurring dream themes from a journal entry.
 * Useful for dream journals, altered state entries, or subconscious content.
 */
export async function interpretDreamSymbols(entry) {
  try {
    const systemPrompt = `
You are a dream interpreter. Extract symbolic dream themes from the entry below.
Return 3–5 symbolic themes (e.g., "loss of control", "rebirth", "animal guidance").
Avoid overanalyzing — just name the themes.
Respond in JSON array format like ["theme1", "theme2", "theme3"]
    `.trim();
    const userPrompt = `Dream Journal Entry:\n${entry}`;
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });
    const raw = completion.choices[0]?.message?.content?.trim();
    const themes = JSON.parse(raw || "[]");
    if (!Array.isArray(themes)) throw new Error("Invalid dream symbol format");
    return themes;
  } catch (err) {
    console.error("❌ Dream interpretation failed:", err);
    return ["unresolved conflict", "unknown forces", "search for meaning"];
  }
}
