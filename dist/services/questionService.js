// src/services/questionService.ts
import { supabase } from "../lib/supabase"; // Import supabase client
// Function to fetch survey questions from the database
export async function getSurveyQuestions() {
  // Query the 'survey_questions' table
  const { data, error } = await supabase.from("survey_questions").select("*");
  // If there is an error, log it and return null
  if (error) {
    console.error("❌ getSurveyQuestions error:", error.message);
    return null;
  }
  // If no error, return the data (array of SurveyQuestion)
  return data;
}
