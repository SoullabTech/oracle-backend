// ✅ File: src/services/ritualService.ts
// Layer: 🔮 Service – Ritual logging + symbol-phase ritual fetch

import { supabase } from '../lib/supabaseClient';

/**
 * Logs a ritual interaction to Supabase
 */
export async function logRitualEvent({
  input,
  reply,
  element,
  phase,
  persona,
  source,
  userId,
}: {
  input: string;
  reply?: string;
  element: string;
  phase: number;
  persona: string;
  source: string;
  userId?: string;
}) {
  const { error } = await supabase.from('ritual_logs').insert([
    {
      input,
      reply,
      element,
      phase,
      persona,
      source,
      user_id: userId ?? null,
      created_at: new Date().toISOString(),
    },
  ]);

  if (error) {
    console.error('[❌ ritualService] Failed to log ritual:', error);
  } else {
    console.log('[🔮 ritualService] Ritual event logged.');
  }
}

/**
 * Provides a fallback ritual message based on symbol and phase
 */
export function getRitualBySymbolPhase(symbol: string, phase?: number): string {
  return `Spend time reflecting on the essence of "${symbol}" in your current phase (${phase ?? '?'}) through journaling or meditation.`;
}
