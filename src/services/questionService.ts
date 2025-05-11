// src/services/questionService.ts

import { supabase } from "../lib/supabase";
import type { SurveyQuestion } from "../types/survey";

export async function getSurveyQuestions(): Promise<SurveyQuestion[] | null> {
  const { data, error } = await supabase.from("survey_questions").select("*");
  if (error) {
    console.error("❌ getSurveyQuestions error:", error.message);
    return null;
  }
  return data;
}
