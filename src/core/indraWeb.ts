// File: /src/core/indraWeb.ts
// Layer: 🕸️ Backend — Federated Symbolic Pattern Sharing (Cross-User Archetypal Resonance)

import { getCrystalMemory } from '@/services/crystalMemoryService';
import { AppError } from '@/utils/errors';

export async function getIndraWebMatrix() {
  try {
    const all = await getCrystalMemory();

    const matrix: Record<string, Set<string>> = {}; // { symbol: Set<userId> }

    all.forEach((entry) => {
      if (!entry.symbol || !entry.userId) return;
      if (!matrix[entry.symbol]) matrix[entry.symbol] = new Set();
      matrix[entry.symbol].add(entry.userId);
    });

    const sharedSymbols = Object.entries(matrix)
      .filter(([_, users]) => users.size > 1)
      .map(([symbol, users]) => ({ symbol, participants: Array.from(users), resonance: users.size }));

    return {
      timestamp: new Date().toISOString(),
      sharedSymbols,
      uniqueUserCount: new Set(all.map((e) => e.userId)).size,
      totalSymbols: all.length,
    };
  } catch (err) {
    console.error('[IndraWeb] Matrix generation failed:', err);
    throw new AppError('Failed to construct Indra Web matrix');
  }
}
