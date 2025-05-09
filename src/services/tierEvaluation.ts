// File: /src/services/tierEvaluation.ts
// Layer: 🔁 Backend — Evaluates tier progression and announces promotion

import { db } from ..//supabaseClient';
import { handleTierPromotion } from '@/services/tierPromotionHandler';

export async function evaluateUserTier(userId: string) {
  const { data: journals, error: journalError } = await db
    .from('journal_entries')
    .select('id')
    .eq('user_id', userId);

  const { data: oracles, error: oracleError } = await db
    .from('oracle_sessions')
    .select('id')
    .eq('user_id', userId);

  if (journalError || oracleError) {
    console.error('Tier eval error:', journalError || oracleError);
    return;
  }

  const journalCount = journals?.length || 0;
  const oracleCount = oracles?.length || 0;

  let newTier = 'explorer';
  if (oracleCount >= 3 && journalCount >= 3) newTier = 'seeker';
  if (oracleCount >= 7 && journalCount >= 5) newTier = 'adept';
  if (oracleCount >= 15 && journalCount >= 10) newTier = 'master';

  const { data: user, error: fetchError } = await db.from('users').select('tier').eq('id', userId).single();
  const currentTier = user?.tier || 'explorer';

  if (currentTier !== newTier) {
    await db.from('users').update({ tier: newTier }).eq('id', userId);
    await handleTierPromotion(userId, newTier);
  }

  return newTier;
}
