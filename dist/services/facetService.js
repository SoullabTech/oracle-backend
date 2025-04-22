// src/services/facetService.ts
import { supabase } from "../lib/supabaseClient";
import logger from "../utils/logger";
/**
 * Simple utility to detect which elemental facet is most prominent
 * in a user’s input, based on predefined keywords-to-facet mappings.
 */
const facetKeywords = {
  warmth: "fire.warmth",
  passion: "fire.warmth",
  flow: "water.emotion",
  calm: "water.emotion",
  stability: "earth.structure",
  safety: "earth.structure",
  clarity: "air.thought",
  idea: "air.thought",
  insight: "aether.integration",
  transcend: "aether.integration",
};
/**
 * Inspect the input text and return the first matching facet.
 * If none match, returns null.
 */
export function detectFacetFromInput(text) {
  const lower = text.toLowerCase();
  for (const [keyword, facet] of Object.entries(facetKeywords)) {
    if (lower.includes(keyword)) {
      logger.debug("Facet detected from input", { keyword, facet });
      return facet;
    }
  }
  logger.debug("No facet detected from input");
  return null;
}
/**
 * Retrieve all facet mappings from the database.
 */
export async function getAllFacetMappings() {
  try {
    const { data, error } = await supabase.from("facet_mappings").select("*");
    if (error) throw error;
    return data ?? [];
  } catch (err) {
    logger.error("Failed to fetch facet mappings", { error: err });
    throw new Error("Could not load facet mappings");
  }
}
