// File: /src/services/crystalMemoryService.ts
// Layer: 🧠 Backend — Symbolic Memory Store (Modular for Oracle, Journal, Dream)
import { AppError } from '@/utils/errors';
let memoryStore = []; // In-memory fallback (replace with DB or Supabase later)
export async function saveToCrystalMemory(entry) {
    try {
        if (!entry || typeof entry !== 'object' || !entry.symbol) {
            throw new AppError('Invalid memory entry payload', 400);
        }
        // Simulated persistent storage (e.g. DB.write(entry) or Supabase call)
        memoryStore.push({ ...entry, id: memoryStore.length + 1 });
        console.log('[CrystalMemory] Saved:', entry.symbol, '→', entry.phase);
        return true;
    }
    catch (err) {
        console.error('CrystalMemory Error:', err);
        throw new AppError('Failed to save memory entry');
    }
}
export async function getCrystalMemory(filter = {}) {
    try {
        return memoryStore.filter((item) => {
            return Object.entries(filter).every(([k, v]) => item[k] === v);
        });
    }
    catch (err) {
        console.error('Memory Fetch Error:', err);
        throw new AppError('Could not fetch crystal memory');
    }
}
export async function clearCrystalMemory() {
    memoryStore = [];
    return true;
}
