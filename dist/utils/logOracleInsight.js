// src/utils/oracleLogger.ts
import { supabase } from "../lib/supabase";
import logger from "./logger";
export async function logOracleInsight({
  anon_id = null,
  archetype = "",
  element = "",
  phase = "",
  insight,
  emotion = 0.5,
  facet,
  context,
}) {
  try {
    const { error } = await supabase.from("oracle_insights").insert([
      {
        anon_id,
        archetype,
        element,
        phase,
        emotion_score: emotion,
        facet,
        insight,
        context,
        created_at: new Date().toISOString(),
      },
    ]);
    if (error) {
      logger.error("❌ Failed to log Oracle insight:", error.message);
    } else {
      logger.info("✅ Oracle insight logged");
    }
  } catch (err) {
    logger.error("Unexpected error logging Oracle insight:", err);
  }
}
