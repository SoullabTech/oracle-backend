// File: src/utils/sanctumLogger.ts
// Layer: 🔐 Utility – Store Oracle responses to user's sanctum timeline

import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGO_URI!);

await client.connect();

export const db = client.db('oracle'); // or your preferred DB name

export async function logToSanctum({
  input,
  insight,
  ritual,
  nextPhase,
  symbol,
  element,
  persona,
  source,
  agent,
}: {
  input: string;
  insight: string;
  ritual: string;
  nextPhase: string;
  symbol: string;
  element: string;
  persona: string;
  source: string;
  agent: string;
}) {
  try {
    const entry = {
      input,
      insight,
      ritual,
      phase: nextPhase,
      symbol,
      element,
      persona,
      source,
      agent,
      createdAt: new Date().toISOString(),
    };

    await db.collection('sanctum_logs').insertOne(entry);
    console.log('[🕯️ SanctumLog] Logged entry:', symbol, '→', nextPhase);
  } catch (err) {
    console.error('[SanctumLog Error]', err);
  }
}
