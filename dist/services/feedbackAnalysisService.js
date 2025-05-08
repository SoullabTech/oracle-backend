import { supabase } from "../lib/supabase";
import logger from "../utils/logger";
export async function analyzeFeedback(timeframe) {
    try {
        // Fetch feedback data within timeframe
        const { data: feedback, error } = await supabase
            .from("feedback_metrics")
            .select("*")
            .gte("created_at", timeframe.start.toISOString())
            .lte("created_at", timeframe.end.toISOString());
        if (error)
            throw error;
        // Calculate metrics
        const totalFeedback = feedback.length;
        const averageRating = feedback.reduce((acc, f) => acc + f.rating, 0) / totalFeedback;
        // Analyze elemental effectiveness
        const elementalScores = feedback.reduce((acc, f) => {
            const element = f.element;
            if (element) {
                if (!acc[element]) {
                    acc[element] = { total: 0, count: 0 };
                }
                acc[element].total += f.rating;
                acc[element].count += 1;
            }
            return acc;
        }, {});
        const elementalEffectiveness = Object.entries(elementalScores).reduce((acc, [element, { total, count }]) => ({
            ...acc,
            [element]: total / count / 5, // Normalize to 0-1
        }), {});
        // Analyze response patterns
        const patterns = feedback.reduce((acc, f) => {
            const pattern = f.response_pattern;
            if (pattern) {
                if (!acc[pattern]) {
                    acc[pattern] = { total: 0, count: 0 };
                }
                acc[pattern].total += f.rating;
                acc[pattern].count += 1;
            }
            return acc;
        }, {});
        const patternEffectiveness = Object.entries(patterns).reduce((acc, [pattern, { total, count }]) => ({
            ...acc,
            [pattern]: total / count / 5, // Normalize to 0-1
        }), {});
        // Store analysis results
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
        if (storeError) {
            logger.error("Error storing feedback analysis:", storeError);
        }
        return {
            totalFeedback,
            averageRating,
            elementalEffectiveness,
            patternEffectiveness,
            timeframe,
        };
    }
    catch (error) {
        logger.error("Error analyzing feedback:", error);
        throw new Error("Failed to analyze feedback");
    }
}
export async function updatePersonalityWeights(analysis) {
    try {
        // Get current weights
        const { data: currentWeights, error: weightsError } = await supabase
            .from("personality_weights")
            .select("*");
        if (weightsError)
            throw weightsError;
        // Calculate new weights based on effectiveness
        const newWeights = Object.entries(analysis.elementalEffectiveness).map(([element, effectiveness]) => {
            const currentWeight = currentWeights?.find((w) => w.element === element)?.weight || 0.5;
            // Adjust weight based on effectiveness with dampening
            const adjustment = (effectiveness - 0.5) * 0.1; // 10% max adjustment
            const newWeight = Math.max(0.1, Math.min(0.9, currentWeight + adjustment));
            return {
                element,
                weight: newWeight,
                confidence: effectiveness,
                last_updated: new Date().toISOString(),
            };
        });
        // Update weights
        const { error: updateError } = await supabase
            .from("personality_weights")
            .upsert(newWeights);
        if (updateError)
            throw updateError;
        logger.info("Successfully updated personality weights", {
            metadata: {
                weights: newWeights,
            },
        });
    }
    catch (error) {
        logger.error("Error updating personality weights:", error);
        throw new Error("Failed to update personality weights");
    }
}
