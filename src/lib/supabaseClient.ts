import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("❌ Missing required Supabase public environment variables.");
}

if (!supabaseServiceRoleKey) {
  console.warn("⚠️ Missing SUPABASE_SERVICE_ROLE_KEY — admin client disabled.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export const supabaseAdmin = supabaseServiceRoleKey
  ? createClient(supabaseUrl, supabaseServiceRoleKey)
  : null;

export const useSupabaseAdmin = () => supabaseAdmin ?? supabase;
