// src/config/env.ts
import dotenv from "dotenv";
import { z } from "zod";
dotenv.config();
const EnvSchema = z.object({
  // Backend-safe
  SUPABASE_URL: z.string().url(),
  SUPABASE_ANON_KEY: z.string(),
  SUPABASE_SERVICE_ROLE_KEY: z.string(),
  SUPABASE_JWT_SECRET: z.string(),
  OPENAI_API_KEY: z.string(),
  CLAUDE_API_KEY: z.string(),
  CHATGPT_ORACLE_API_KEY: z.string(),
  CHATGPT_ORACLE_URL: z.string().url(),
  NOTION_TOKEN: z.string(),
  NOTION_DATABASE_ID: z.string(),
  JWT_SECRET: z.string(),
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
  LOG_CONSOLE_LEVEL: z
    .enum(["debug", "info", "warn", "error"])
    .default("debug"),
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});
const parsed = EnvSchema.safeParse(process.env);
if (!parsed.success) {
  console.error("❌ Invalid environment variables:", parsed.error.format());
  throw new Error("Invalid environment configuration.");
}
export const ENV = parsed.data;
// For Vite frontend env values
export const VITE = {
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
  CLAUDE_API_KEY: import.meta.env.VITE_CLAUDE_API_KEY,
  OPENAI_API_KEY: import.meta.env.VITE_OPENAI_API_KEY,
  CHATGPT_ORACLE_URL: import.meta.env.VITE_CHATGPT_ORACLE_URL,
  CHATGPT_ORACLE_API_KEY: import.meta.env.VITE_CHATGPT_ORACLE_API_KEY,
  API_URL: import.meta.env.VITE_API_URL,
};
