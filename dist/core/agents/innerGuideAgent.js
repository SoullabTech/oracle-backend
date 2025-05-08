// src/agents/innerGuideAgent.ts
import { z } from 'zod';
import { generateDivinatoryInsight } from '../services/divinationService';
import { interpretDreamSymbols } from '../services/dreamService';
import { extractSymbolsFromJournal } from '../utils/symbolParser';
export const journalEntrySchema = z.object({
    userId: z.string(),
    entry: z.string().min(10),
    timestamp: z.string().optional(),
});
export async function processJournalEntry(input) {
    const { userId, entry } = input;
    // Step 1: Extract symbols from journal
    const symbols = extractSymbolsFromJournal(entry);
    // Step 2: Check for dream themes
    const dreamThemes = await interpretDreamSymbols(entry);
    // Step 3: Generate divinatory insight
    const divination = await generateDivinatoryInsight({ userId, entry });
    // Step 4: Integration suggestion
    const integrationPrompt = `Reflect on the symbol(s): ${symbols.join(', ') || 'none'}${dreamThemes.length ? ` and dream theme(s): ${dreamThemes.join(', ')}` : ''}. What do they reveal about your inner process?`;
    return {
        symbols,
        dreamThemes,
        divination,
        integrationPrompt,
    };
}
