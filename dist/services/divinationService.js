// src/services/divinationService.ts
import { openai } from "../lib/supabaseClient";
/**
 * Generates a divinatory-style insight for a journal entry.
 * This uses GPT to simulate a symbolic, archetypal interpretation.
 */
export async function generateDivinatoryInsight(entry) {
  try {
    const systemPrompt = `
You are a divinatory oracle drawing upon archetypes, symbols, and inner wisdom.
Offer mythic, poetic, or metaphoric insight into the journal entry below.
Your answer should sound timeless, gentle, and illuminating — not literal.
    `.trim();
    const userPrompt = `Journal Entry:\n${entry}\n\nWhat is the symbolic insight or message?`;
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });
    return (
      completion.choices[0]?.message?.content?.trim() || "No insight received."
    );
  } catch (err) {
    console.error("❌ Failed to generate divinatory insight:", err);
    return "The oracle is silent. Please try again later.";
  }
}
