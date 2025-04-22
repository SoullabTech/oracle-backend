import { supabase } from "../lib/supabase";
import logger from "../utils/logger";
import type { FeedbackMetrics } from "../types/feedback";

export async function recordFeedback(
  userId: string,
  responseId: string,
  feedback: FeedbackMetrics,
): Promise<void> {
  try {
    const { error } = await supabase.from("feedback_metrics").insert({
      user_id: userId,
      response_id: responseId,
      rating: feedback.rating,
      element: feedback.metadata?.element,
      query_type: feedback.metadata?.queryType,
      response_pattern: feedback.metadata?.responsePattern,
      metadata: feedback.metadata,
    });

    if (error) throw error;

    logger.info("Feedback recorded successfully", {
      metadata: {
        userId,
        responseId,
        rating: feedback.rating,
      },
    });
  } catch (error) {
    logger.error("Error recording feedback:", error);
    throw new Error("Failed to record feedback");
  }
}

export async function analyzeFeedbackTrends(timeframe: {
  start: Date;
  end: Date;
}): Promise<void> {
  try {
    // Get feedback within timeframe
    const { data: feedback, error } = await supabase
      .from("feedback_metrics")
      .select("*")
      .gte("created_at", timeframe.start.toISOString())
      .lte("created_at", timeframe.end.toISOString());

    if (error) throw error;

    // Calculate metrics
    const totalFeedback = feedback.length;
    const averageRating =
      feedback.reduce((sum, f) => sum + f.rating, 0) / totalFeedback;

    // Calculate elemental effectiveness
    const elementalEffectiveness = feedback.reduce(
      (acc, f) => {
        if (f.element) {
          if (!acc[f.element]) {
            acc[f.element] = { total: 0, count: 0 };
          }
          acc[f.element].total += f.rating;
          acc[f.element].count += 1;
        }
        return acc;
      },
      {} as Record<string, { total: number; count: number }>,
    );

    // Calculate pattern effectiveness
    const patternEffectiveness = feedback.reduce(
      (acc, f) => {
        if (f.response_pattern) {
          if (!acc[f.response_pattern]) {
            acc[f.response_pattern] = { total: 0, count: 0 };
          }
          acc[f.response_pattern].total += f.rating;
          acc[f.response_pattern].count += 1;
        }
        return acc;
      },
      {} as Record<string, { total: number; count: number }>,
    );

    // Store analysis results
    const { data: analysis, error: analysisError } = await supabase
      .from("feedback_analysis")
      .insert({
        timeframe_start: timeframe.start.toISOString(),
        timeframe_end: timeframe.end.toISOString(),
        total_feedback: totalFeedback,
        average_rating: averageRating,
        elemental_effectiveness: Object.fromEntries(
          Object.entries(elementalEffectiveness).map(([k, v]) => [
            k,
            v.total / v.count,
          ]),
        ),
        pattern_effectiveness: Object.fromEntries(
          Object.entries(patternEffectiveness).map(([k, v]) => [
            k,
            v.total / v.count,
          ]),
        ),
      })
      .select()
      .single();

    if (analysisError) throw analysisError;

    // Apply learning adjustments based on analysis
    await applyLearningAdjustments(analysis.id);

    logger.info("Feedback analysis completed", {
      metadata: {
        analysisId: analysis.id,
        totalFeedback,
        averageRating,
      },
    });
  } catch (error) {
    logger.error("Error analyzing feedback trends:", error);
    throw new Error("Failed to analyze feedback trends");
  }
}

async function applyLearningAdjustments(analysisId: string): Promise<void> {
  try {
    // Get analysis results
    const { data: analysis, error } = await supabase
      .from("feedback_analysis")
      .select("*")
      .eq("id", analysisId)
      .single();

    if (error) throw error;

    // Apply elemental adjustments
    const elementalAdjustments = Object.entries(
      analysis.elemental_effectiveness,
    ).map(([element, effectiveness]) => ({
      analysis_id: analysisId,
      adjustment_type: "elemental_weight",
      previous_value: { weight: 0.5 }, // Get actual previous value in production
      new_value: { weight: effectiveness },
      confidence: effectiveness,
    }));

    // Store adjustments
    const { error: adjustmentError } = await supabase
      .from("learning_adjustments")
      .insert(elementalAdjustments);

    if (adjustmentError) throw adjustmentError;

    // Initialize effectiveness tracking
    const trackingEntries = elementalAdjustments.map((adjustment) => ({
      adjustment_id: adjustment.id,
      metric_type: "elemental_effectiveness",
      baseline_value: adjustment.previous_value.weight,
      current_value: adjustment.new_value.weight,
    }));

    const { error: trackingError } = await supabase
      .from("effectiveness_tracking")
      .insert(trackingEntries);

    if (trackingError) throw trackingError;

    logger.info("Learning adjustments applied", {
      metadata: {
        analysisId,
        adjustmentsCount: elementalAdjustments.length,
      },
    });
  } catch (error) {
    logger.error("Error applying learning adjustments:", error);
    throw new Error("Failed to apply learning adjustments");
  }
}
