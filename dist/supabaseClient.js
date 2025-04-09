// src/supabaseClient.ts
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
        delete: async () => ({ data: [], error: null }),
    }),
};
