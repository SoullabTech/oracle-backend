// File: /src/core/crystalState.ts
// Layer: 🧠 Backend — Symbolic Field State Tracker (Phases, Clusters, Resonance)
import { getCrystalMemory } from '@/services/crystalMemoryService';
import { AppError } from '@/utils/errors';
export async function generateCrystalState() {
    try {
        const all = await getCrystalMemory();
        const clusterMap = {};
        const phaseMap = {};
        all.forEach((entry) => {
            const key = `${entry.symbol}-${entry.phase}`;
            clusterMap[key] = (clusterMap[key] || 0) + 1;
            const phaseKey = `${entry.element}-P${entry.phase}`;
            phaseMap[phaseKey] = (phaseMap[phaseKey] || 0) + 1;
        });
        const dominantPhase = Object.entries(phaseMap).sort((a, b) => b[1] - a[1])[0];
        const topSymbols = Object.entries(clusterMap)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([key, count]) => ({ key, count }));
        return {
            timestamp: new Date().toISOString(),
            dominantPhase: dominantPhase?.[0] || 'Fire-P1',
            topSymbols,
            totalEntries: all.length,
        };
    }
    catch (err) {
        console.error('CrystalState error:', err);
        throw new AppError('Failed to generate crystal state');
    }
}
