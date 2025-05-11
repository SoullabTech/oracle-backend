// src/services/feedbackAnalysisService.ts
import { supabase } from "../lib/supabase";
import logger from "../utils/logger";
export async function analyzeFeedback(timeframe) {
  try {
    const { data: feedback, error } = await supabase
      .from("feedback_metrics")
      .select("*")
      .gte("created_at", timeframe.start.toISOString())
      .lte("created_at", timeframe.end.toISOString());
    if (error || !feedback) throw error;
    const totalFeedback = feedback.length;
    const averageRating =
      feedback.reduce((acc, f) => acc + f.rating, 0) / totalFeedback;
    const elementalScores = feedback.reduce((acc, f) => {
      const element = f.element;
      if (element) {
        if (!acc[element]) acc[element] = { total: 0, count: 0 };
        acc[element].total += f.rating;
        acc[element].count += 1;
      }
      return acc;
    }, {});
    const elementalEffectiveness = Object.entries(elementalScores).reduce(
      (acc, [element, { total, count }]) => {
        acc[element] = total / count / 5;
        return acc;
      },
      {},
    );
    const patternScores = feedback.reduce((acc, f) => {
      const pattern = f.response_pattern;
      if (pattern) {
        if (!acc[pattern]) acc[pattern] = { total: 0, count: 0 };
        acc[pattern].total += f.rating;
        acc[pattern].count += 1;
      }
      return acc;
    }, {});
    const patternEffectiveness = Object.entries(patternScores).reduce(
      (acc, [pattern, { total, count }]) => {
        acc[pattern] = total / count / 5;
        return acc;
      },
      {},
    );
    const { error: storeError } = await supabase
      .from("feedback_analysis")
      .insert({
        timeframe_start: timeframe.start.toISOString(),
        timeframe_end: timeframe.end.toISOString(),
        total_feedback: totalFeedback,
        average_rating: averageRating,
        elemental_effectiveness: elementalEffectiveness,
        pattern_effectiveness: patternEffectiveness,
        created_at: new Date().toISOString(),
      });
    if (storeError)
      logger.error("Error storing feedback analysis:", storeError);
    return {
      totalFeedback,
      averageRating,
      elementalEffectiveness,
      patternEffectiveness,
      timeframe,
    };
  } catch (error) {
    logger.error("Error analyzing feedback:", error);
    throw new Error("Failed to analyze feedback");
  }
}
