// src/supabaseClient.ts
// Placeholder for Supabase client setup
// Replace this with your actual Supabase initialization when ready
export const supabase = {
    auth: {
        signIn: async () => ({ user: null, error: null }),
        signOut: async () => ({ error: null }),
    },
    from: () => ({
        select: async () => ({ data: [], error: null }),
        insert: async () => ({ data: [], error: null }),
        update: async () => ({ data: [], error: null }),
        delete: async () => ({ data: [], error: null }),
    }),
};
