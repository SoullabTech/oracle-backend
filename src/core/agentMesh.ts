// File: /src/core/agentMesh.ts
// Layer: 🔁 Backend — Multi-Agent Reflective Mesh (Symbolic Dialogues + Memory Threads)

import { oracleOrchestrator } from './oracleOrchestrator';
import { getCrystalMemory } from '@/services/crystalMemoryService';
import { AppError } from '@/utils/errors';

export async function meshReflect(input, initiator = 'Oracle Agent') {
  try {
    const memory = await getCrystalMemory({});
    const recentSymbols = memory.slice(-10).map((m) => m.symbol);
    const echoSymbol = recentSymbols[Math.floor(Math.random() * recentSymbols.length)];

    const prompt = `A fellow symbolic agent just spoke about "${echoSymbol}". In light of this, offer a new insight or angle on the user input: ${input}`;

    const response = await oracleOrchestrator({
      input: prompt,
      symbol: echoSymbol,
      element: 'Aether',
      phase: 3,
      persona: 'oracle',
      emotion: 'neutral',
      source: 'mesh'
    });

    return {
      source: initiator,
      echo: echoSymbol,
      insight: response.insight,
      ritual: response.ritual,
      nextPhase: response.nextPhase,
    };
  } catch (err) {
    console.error('[AgentMesh] Error during reflective cycle:', err);
    throw new AppError('Mesh reflection failed');
  }
}

