import { supabase } from "../lib/supabase";
import logger from "../utils/logger";
export async function submitFeedback(userId, feedback) {
  try {
    const { error } = await supabase.from("feedback_metrics").insert({
      user_id: userId,
      response_id: feedback.responseId,
      rating: feedback.rating,
      element: feedback.metadata?.element,
      query_type: feedback.metadata?.queryType,
      response_pattern: feedback.metadata?.responsePattern,
      metadata: feedback.metadata,
    });
    if (error) throw error;
    logger.info("Feedback submitted successfully", {
      metadata: {
        userId,
        responseId: feedback.responseId,
        rating: feedback.rating,
      },
    });
  } catch (error) {
    logger.error("Error submitting feedback:", error);
    throw new Error("Failed to submit feedback");
  }
}
export async function getFeedbackStats(userId) {
  try {
    const { data, error } = await supabase
      .from("feedback_metrics")
      .select("rating, metadata")
      .eq("user_id", userId);
    if (error) throw error;
    if (!data || data.length === 0) {
      return null;
    }
    const elementalDistribution = {
      fire: 0,
      water: 0,
      earth: 0,
      air: 0,
      aether: 0,
    };
    data.forEach((feedback) => {
      const element = feedback.metadata?.element;
      if (element && elementalDistribution[element] !== undefined) {
        elementalDistribution[element]++;
      }
    });
    const total = Object.values(elementalDistribution).reduce(
      (a, b) => a + b,
      0,
    );
    if (total > 0) {
      Object.keys(elementalDistribution).forEach((key) => {
        elementalDistribution[key] = (elementalDistribution[key] / total) * 100;
      });
    }
    return {
      totalFeedback: data.length,
      averageRating: data.reduce((acc, f) => acc + f.rating, 0) / data.length,
      positiveFeedback: data.filter((f) => f.rating >= 4).length,
      negativeFeedback: data.filter((f) => f.rating <= 2).length,
      elementalDistribution,
    };
  } catch (error) {
    logger.error("Error fetching feedback stats:", error);
    return null;
  }
}
export async function getUserFeedback(userId, limit = 10) {
  try {
    const { data, error } = await supabase
      .from("feedback_metrics")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data || [];
  } catch (error) {
    logger.error("Error fetching user feedback:", error);
    return [];
  }
}
