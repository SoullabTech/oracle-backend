// src/utils/oracleLogger.ts
import { supabase } from '../lib/supabaseClient.js';
import logger from './logger.js';

export interface InsightLogEntry {
  anon_id: string | null;
  archetype: string;
  element: string;
  insight: {
    message: string;
    raw_input: string;
  };
  emotion: number;
  phase: string;
  context?: unknown[];
}

export async function logOracleInsight(
  entry: InsightLogEntry
): Promise<{ id: string }> {
  try {
    const { data, error } = await supabase
      .from('insight_history')
      .insert({
        anon_id: entry.anon_id,
        archetype: entry.archetype,
        element: entry.element,
        content: entry.insight.message,
        metadata: {
          raw_input: entry.insight.raw_input,
          emotion: entry.emotion,
          phase: entry.phase,
          context: entry.context || []
        }
      })
      .select('id')
      .single();

    if (error || !data) throw error || new Error('No data returned');

    logger.info('[OracleLog] Insight logged', { id: data.id, ...entry });
    return { id: data.id };
  } catch (err: any) {
    logger.error('Failed to log Oracle insight:', { error: err.message || err });
    throw err;
  }
}
