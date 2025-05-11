import dotenv from "dotenv";
import { z } from "zod";
dotenv.config();
const BackendEnvSchema = z.object({
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
const parsed = BackendEnvSchema.safeParse(process.env);
if (!parsed.success) {
  console.error("❌ Backend environment validation failed:");
  console.error(parsed.error.format());
  throw new Error("Invalid backend environment configuration.");
}
export const ENV_BACKEND = parsed.data;
