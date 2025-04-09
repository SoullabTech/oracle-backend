// src/supabaseClient.ts

// This is a stub/mock for Supabase client functionality.
// Replace with actual Supabase client setup when connecting to your Supabase project.

interface AuthResponse {
    user: { id: string; email: string; user_metadata?: Record<string, any> } | null;
    error: { message: string } | null;
}

export const supabase = {
  auth: {
    signIn: async ({ email, password }: { email: string; password: string }): Promise<AuthResponse> => {
      console.log(`[Mock Supabase] signIn called with: ${email}, ${password}`);
      return {
        user: {
          id: 'mock-user-id',
          email,
          user_metadata: { role: 'client' }
        },
        error: null
      };
    },
    signOut: async () => ({ error: null }),
  },
  from: (table: string) => ({
    select: async () => ({ data: [], error: null }),
    insert: async (payload: any) => ({ data: [payload], error: null }),
    update: async (changes: any) => ({ data: [changes], error: null }),
    delete: async () => ({ data: [], error: null }),
  }),
};
