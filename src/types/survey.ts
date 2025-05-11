import type { Database } from "../lib/database.types";
import { z } from "zod";

// 🔢 Supabase row types
export type ElementalProfile =
  Database["public"]["Tables"]["elemental_profiles"]["Row"];
export type SurveyQuestion =
  Database["public"]["Tables"]["survey_questions"]["Row"];

// 🎯 Crystal Focus Options
export const CRYSTAL_FOCUS_OPTIONS = [
  {
    type: "career",
    title: "Career Crystal",
    description:
      "Focus on professional growth, leadership, and purpose in work.",
    elements: ["earth", "air"],
  },
  {
    type: "spiritual",
    title: "Spiritual Crystal",
    description:
      "Explore consciousness, meaning, and connection to higher purpose.",
    elements: ["fire", "aether"],
  },
  {
    type: "relational",
    title: "Relational Crystal",
    description:
      "Develop deeper connections and emotional intelligence in relationships.",
    elements: ["water", "air"],
  },
  {
    type: "health",
    title: "Health Crystal",
    description:
      "Balance physical wellbeing, vitality, and holistic health practices.",
    elements: ["earth", "water"],
  },
  {
    type: "creative",
    title: "Creative Crystal",
    description: "Unlock creative potential and artistic expression.",
    elements: ["fire", "water"],
  },
  {
    type: "other",
    title: "Custom Crystal",
    description: "Define your own unique focus area.",
    elements: [],
  },
] as const;

// 🧬 Crystal Focus Type
export type CrystalFocusType = (typeof CRYSTAL_FOCUS_OPTIONS)[number]["type"];

// 🧠 Core Types
export interface CrystalFocus {
  type: CrystalFocusType;
  customDescription?: string;
  challenges: string;
  aspirations: string;
}

export interface SurveyResponse {
  questionId: string;
  answer: number; // 1–5 scale
}

export interface SurveySubmission {
  userId: string;
  responses: SurveyResponse[];
  crystalFocus: CrystalFocus;
}

// ✅ Zod Schema for Validation
export const crystalFocusSchema = z.object({
  type: z.enum([
    "career",
    "spiritual",
    "relational",
    "health",
    "creative",
    "other",
  ]),
  customDescription: z.string().optional(),
  challenges: z.string(),
  aspirations: z.string(),
});
