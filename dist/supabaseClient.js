// src/supabaseClient.ts
<<<<<<< HEAD
export const supabase = {
    auth: {
        signIn: async ({ email, password }) => {
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
    from: (table) => ({
        select: async () => ({ data: [], error: null }),
        insert: async (payload) => ({ data: [payload], error: null }),
        update: async (changes) => ({ data: [changes], error: null }),
=======
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
>>>>>>> 268cb604fe12a917c8e4d04e4a80dde66f880973
        delete: async () => ({ data: [], error: null }),
    }),
};
