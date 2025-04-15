import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';
import type { SurveyResponse, CrystalFocus } from '../types/survey';

type SurveyQuestion = Database['public']['Tables']['survey_questions']['Row'];
type ElementalProfile = Database['public']['Tables']['elemental_profiles']['Row'];

export async function getSurveyQuestions(): Promise<SurveyQuestion[]> {
  const { data, error } = await supabase
    .from('survey_questions')
    .select('*')
    .order('created_at');

  if (error) throw error;
  return data;
}

export async function submitSurveyResponses(
  userId: string,
  responses: SurveyResponse[],
  crystalFocus: CrystalFocus
): Promise<void> {
  // Start a transaction
  const { error: responsesError } = await supabase
    .from('survey_responses')
    .insert(
      responses.map(r => ({
        user_id: userId,
        question_id: r.questionId,
        answer: r.answer,
      }))
    );

  if (responsesError) throw responsesError;

  // Calculate elemental scores
  const { data: questions } = await supabase
    .from('survey_questions')
    .select('id, element, weight');

  if (!questions) throw new Error('Failed to fetch questions');

  const scores = {
    fire: 0,
    water: 0,
    earth: 0,
    air: 0,
    aether: 0,
  };

  // Process each response
  responses.forEach(response => {
    const question = questions.find(q => q.id === response.questionId);
    if (question) {
      scores[question.element as keyof typeof scores] +=
        response.answer * question.weight;
    }
  });

  // Apply crystal focus weights
  const crystalWeights = {
    career: { earth: 1.2, air: 1.2 },
    spiritual: { fire: 1.2, aether: 1.2 },
    relational: { water: 1.2, air: 1.2 },
    health: { earth: 1.2, water: 1.2 },
    creative: { fire: 1.2, water: 1.2 },
    other: {},
  };

  const weights = crystalWeights[crystalFocus.type as keyof typeof crystalWeights];
  Object.entries(weights).forEach(([element, weight]) => {
    scores[element as keyof typeof scores] *= weight;
  });

  // Normalize scores to 0-100
  Object.keys(scores).forEach(element => {
    const key = element as keyof typeof scores;
    const questionsForElement = questions.filter(q => q.element === key);
    const maxScore = questionsForElement.reduce(
      (sum, q) => sum + 5 * q.weight * (weights[key] || 1),
      0
    );
    scores[key] = Math.round((scores[key] / maxScore) * 100);
  });

  // Store crystal focus and update elemental profile
  const { error: profileError } = await supabase
    .from('elemental_profiles')
    .upsert({
      user_id: userId,
      ...scores,
      crystal_focus: crystalFocus,
    });

  if (profileError) throw profileError;
}

export async function getElementalProfile(
  userId: string
): Promise<ElementalProfile | null> {
  const { data, error } = await supabase
    .from('elemental_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) throw error;
  return data;
}