// src/services/surveyService.ts

import { supabase } from '../lib/supabaseClient';
import { createSurvey, getSurveyResults } from './surveyDao';
import { updateUserProfile } from './profileService';
import oracleLogger from '../utils/oracleLogger';
import type { SurveySubmission } from '../types/survey';

/**
 * Process a survey submission:
 * 1) Fetch survey questions from Supabase
 * 2) Tally weighted responses into elemental scores
 * 3) Normalize each score to a 0–100 range
 * 4) Persist updated elemental profile
 * 5) Log the survey_completion insight
 * 6) Return only normalized elemental stats
 */
export async function processSurveySubmission(
  submission: SurveySubmission
): Promise<
  | { userId: string; fire: number; water: number; earth: number; air: number; aether: number }
  | null
> {
  const { userId, responses, crystalFocus } = submission;

  // 1) Fetch all survey questions
  const { data: questions, error: fetchError } = await supabase
    .from('survey_questions')
    .select('*');

  if (fetchError || !questions) {
    console.error('❌ Failed to fetch survey questions:', fetchError?.message);
    return null;
  }

  // 2) Tally weighted responses
  const scores: Record<'fire' | 'water' | 'earth' | 'air' | 'aether', number> = {
    fire: 0,
    water: 0,
    earth: 0,
    air: 0,
    aether: 0,
  };

  for (const { questionId, answer } of responses) {
    const q = questions.find(q => q.id === questionId);
    if (!q) continue;

    const weight = q.weight ?? 1;
    const element = q.element as keyof typeof scores;

    if (element in scores) {
      scores[element] += answer * weight;
    }
  }

  // 3) Normalize scores to [0, 100]
  const maxScore = 25; // 5 questions × max weight 5
  const normalized = Object.fromEntries(
    Object.entries(scores).map(([element, value]) => [
      element,
      Math.min(100, Math.round((value / maxScore) * 100)),
    ])
  ) as typeof scores;

  // 4) Update user profile
  const profileData = { ...normalized, crystal_focus: crystalFocus };
  const saved = await updateUserProfile(userId, profileData);
  if (!saved) {
    console.error('❌ Failed to save elemental profile for user:', userId);
    return null;
  }

  // 5) Log completion
  await oracleLogger.logInsight({
    userId,
    insightType: 'survey_completion',
    content: `Survey completed with ${responses.length} responses.`,
    metadata: {
      answersCount: responses.length,
      crystalFocus,
      normalized,
    },
  });

  // 6) Return processed values
  return { userId, ...normalized };
}
