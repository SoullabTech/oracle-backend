// File: /src/lib/supabaseServerClient.ts

import { createClient } from '@supabase/supabase-js';

// ✅ Secure backend-only Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!  // 🚨 DO NOT expose this to the frontend
);

export default supabase;
