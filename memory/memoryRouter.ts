// /oracle-backend/memory/memoryRouter.ts
import { storeJournalEntry, retrieveJournalEntries } from './journalMemory';
import { syncWithLlamaIndex, searchSemanticMemory } from './semanticIndex';

export async function oracleMemoryRouter(input: string, userId: string) {
  if (input.includes('dream') || input.includes('vision')) {
    const entries = await retrieveJournalEntries(userId);
    await syncWithLlamaIndex(entries);
    return await searchSemanticMemory(input);
  }

  return [{ type: 'default', content: 'Memory query not recognized symbolically yet.' }];
}