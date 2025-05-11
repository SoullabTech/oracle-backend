import { z } from "zod";
const FrontendEnvSchema = z.object({
  VITE_SUPABASE_URL: z.string().url(),
  VITE_SUPABASE_ANON_KEY: z.string(),
  VITE_CLAUDE_API_KEY: z.string(),
  VITE_OPENAI_API_KEY: z.string(),
  VITE_CHATGPT_ORACLE_URL: z.string().url(),
  VITE_CHATGPT_ORACLE_API_KEY: z.string(),
  VITE_API_URL: z.string().url(),
});
const parsed = FrontendEnvSchema.safeParse(import.meta.env);
if (!parsed.success) {
  console.error("❌ Frontend environment validation failed:");
  console.error(parsed.error.format());
  throw new Error("Invalid frontend environment configuration.");
}
export const ENV_FRONTEND = parsed.data;
