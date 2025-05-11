import { supabase } from "../lib/supabase";

export interface OraclePattern {
  id?: string;
  patternType: string;
  patternData: Record<string, unknown>;
  confidence: number;
  frequency?: number;
  metadata?: Record<string, unknown>;
}

export async function storePattern(pattern: OraclePattern): Promise<string> {
  const { data, error } = await supabase
    .from("oracle_patterns")
    .insert({
      pattern_type: pattern.patternType,
      pattern_data: pattern.patternData,
      confidence: pattern.confidence,
      frequency: pattern.frequency || 1,
      metadata: pattern.metadata,
    })
    .select()
    .single();

  if (error) {
    console.error("Error storing pattern:", error);
    throw new Error("Failed to store pattern");
  }

  return data.id;
}

export async function updatePatternFrequency(patternId: string): Promise<void> {
  const { error } = await supabase
    .from("oracle_patterns")
    .update({
      frequency: supabase.raw("frequency + 1"),
      last_matched: new Date().toISOString(),
    })
    .eq("id", patternId);

  if (error) {
    console.error("Error updating pattern frequency:", error);
    throw new Error("Failed to update pattern frequency");
  }
}

export async function getPatternsByType(
  patternType: string,
  minConfidence = 0.7,
): Promise<OraclePattern[]> {
  const { data, error } = await supabase
    .from("oracle_patterns")
    .select("*")
    .eq("pattern_type", patternType)
    .gte("confidence", minConfidence)
    .order("frequency", { ascending: false });

  if (error) {
    console.error("Error fetching patterns:", error);
    throw new Error("Failed to fetch patterns");
  }

  return data;
}

export async function getTopPatterns(
  limit = 10,
  minConfidence = 0.7,
): Promise<OraclePattern[]> {
  const { data, error } = await supabase
    .from("oracle_patterns")
    .select("*")
    .gte("confidence", minConfidence)
    .order("frequency", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching top patterns:", error);
    throw new Error("Failed to fetch top patterns");
  }

  return data;
}
