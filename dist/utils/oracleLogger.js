// src/utils/oracleLogger.ts
import { supabase } from "../lib/supabaseClient";
import logger from "./logger";
/**
 * Logs an insight both to the database and to the console.
 * Inserts into the `insight_history` table and writes a log entry.
 */
export async function logInsight(entry) {
    const { userId, insightType, content, metadata } = entry;
    try {
        const { error } = await supabase.from("insight_history").insert({
            user_id: userId,
            insight_type: insightType,
            content,
            metadata: metadata || {},
        });
        if (error)
            throw error;
        logger.info("[OracleLog] Insight logged", {
            userId,
            insightType,
            content,
            metadata,
        });
    }
    catch (err) {
        logger.error("Failed to log insight:", { error: err.message || err });
    }
}
// You can define additional utilities if needed, or leave this out
function anotherUtilityIfExists() {
    // Placeholder function
}
const oracleLogger = {
    logInsight,
    anotherUtilityIfExists,
};
export default oracleLogger;
