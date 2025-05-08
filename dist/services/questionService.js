// src/services/questionService.ts
import { supabase } from "../lib/supabase";
export async function getSurveyQuestions() {
    const { data, error } = await supabase.from("survey_questions").select("*");
    if (error) {
        console.error("❌ getSurveyQuestions error:", error.message);
        return null;
    }
    return data;
}
