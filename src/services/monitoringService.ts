import { supabase } from '../lib/supabase';
import { getFeedbackStats, getUserFeedback } from './feedbackService';
import type { ElementalProfile } from '../types/survey';

interface AnalysisMetrics {
  totalFeedback: number;
  averageRating: number;
  elementalDistribution: Record<string, number>;
  confidenceScores: Record<string, number>;
}

interface WeightAdjustment {
  element: string;
  weight: number;
  confidence: number;
}

export async function analyzeFeedbackTrends(
  timeframe: { start: Date; end: Date }
): Promise<AnalysisMetrics> {
  const { data: feedback, error } = await supabase
    .from('oracle_feedback')
    .select('*')
    .gte('created_at', timeframe.start.toISOString())
    .lte('created_at', timeframe.end.toISOString());

  if (error) {
    console.error('Error analyzing feedback:', error);
    throw new Error('Failed to analyze feedback trends');
  }

  if (!feedback || feedback.length === 0) {
    console.log('🟡 No feedback data available for analysis.');
    return {
      totalFeedback: 0,
      averageRating: 0,
      elementalDistribution: { fire: 0, water: 0, earth: 0, air: 0, aether: 0 },
      confidenceScores: { fire: 0.5, water: 0.5, earth: 0.5, air: 0.5, aether: 0.5 },
    };
  }
  if (!Array.isArray(feedback)) {
    console.warn('⚠️ Feedback format is invalid or not an array.');
    return defaultMetrics;
  }
  

  const metrics: AnalysisMetrics = {
    totalFeedback: feedback.length,
    averageRating: feedback.reduce((acc, f) => acc + f.rating, 0) / feedback.length,
    elementalDistribution: calculateElementalDistribution(feedback),
    confidenceScores: calculateConfidenceScores(feedback),
  };

  const { error: storeError } = await supabase
    .from('feedback_analysis')
    .insert({
      metrics,
      analysis_date: new Date().toISOString(),
    });

  if (storeError) {
    console.error('Error storing analysis:', storeError);
  }

  return metrics;
}

export async function updatePersonalityWeights(
  adjustments: WeightAdjustment[]
): Promise<void> {
  if (!adjustments || adjustments.length === 0) {
    console.log('🟡 No adjustments provided to update personality weights.');
    return;
  }

  const { error } = await supabase
    .from('personality_weights')
    .upsert(
      adjustments.map(adj => ({
        element: adj.element,
        weight: adj.weight,
        confidence: adj.confidence,
        last_updated: new Date().toISOString(),
      }))
    );

  if (error) {
    console.error('Error updating personality weights:', error);
    throw new Error('Failed to update personality weights');
  }
}

export async function getPersonalityWeights(): Promise<WeightAdjustment[]> {
  const { data, error } = await supabase
    .from('personality_weights')
    .select('*')
    .order('element');

  if (error) {
    console.error('Error fetching personality weights:', error);
    throw new Error('Failed to fetch personality weights');
  }

  return data.map(row => ({
    element: row.element,
    weight: row.weight,
    confidence: row.confidence,
  }));
}

function calculateElementalDistribution(
  feedback: any[]
): Record<string, number> {
  const distribution: Record<string, number> = {
    fire: 0,
    water: 0,
    earth: 0,
    air: 0,
    aether: 0,
  };

  feedback.forEach(f => {
    if (f.metadata?.elementalAdjustments?.emphasis) {
      f.metadata.elementalAdjustments.emphasis.forEach((element: string) => {
        if (distribution[element] !== undefined) {
          distribution[element]++;
        }
      });
    }
  });

  const total = Object.values(distribution).reduce((a, b) => a + b, 0);
  if (total > 0) {
    Object.keys(distribution).forEach(key => {
      distribution[key] = (distribution[key] / total) * 100;
    });
  }

  return distribution;
}

function calculateConfidenceScores(
  feedback: any[]
): Record<string, number> {
  const scores: Record<string, number> = {
    fire: 0,
    water: 0,
    earth: 0,
    air: 0,
    aether: 0,
  };

  const counts: Record<string, number> = { ...scores };

  feedback.forEach(f => {
    if (f.metadata?.elementalAdjustments?.emphasis) {
      f.metadata.elementalAdjustments.emphasis.forEach((element: string) => {
        if (scores[element] !== undefined) {
          scores[element] += f.rating;
          counts[element]++;
        }
      });
    }
  });

  Object.keys(scores).forEach(key => {
    scores[key] = counts[key] > 0 ? scores[key] / counts[key] / 5 : 0.5;
  });

  return scores;
}
