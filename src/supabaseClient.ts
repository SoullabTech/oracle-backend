// src/utils/mockSupabase.ts

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    user_metadata?: Record<string, any>;
  } | null;
  error: { message: string } | null;
  session?: {
    user: {
      id: string;
      email: string;
      user_metadata?: Record<string, any>;
    };
  };
}

export const supabase = {
  auth: {
    /**
     * Mocks signing in a user with email and password.
     */
    signInWithPassword: async ({
      email,
      password
    }: {
      email: string;
      password: string;
    }): Promise<AuthResponse> => {
      console.log(`[Mock Supabase] signIn called with: ${email}, ${password}`);
      return {
        user: {
          id: 'mock-user-id',
          email,
          user_metadata: { role: 'client' }
        },
        session: {
          user: {
            id: 'mock-user-id',
            email,
            user_metadata: { role: 'client' }
          }
        },
        error: null
      };
    },
    /**
     * Mocks signing out a user.
     */
    signOut: async (): Promise<{ error: null }> => ({ error: null })
  },
  /**
   * Simulates a basic table query builder.
   * @param table - The name of the table.
   */
  from: (table: string) => ({
    /**
     * Mocks selecting data from a table.
     */
    select: async (): Promise<{ data: any[]; error: null }> => ({ data: [], error: null }),
    /**
     * Mocks inserting data into a table.
     */
    insert: async (payload: any): Promise<{ data: any[]; error: null }> => ({ data: [payload], error: null }),
    /**
     * Mocks updating data in a table.
     */
    update: async (changes: any): Promise<{ data: any[]; error: null }> => ({ data: [changes], error: null }),
    /**
     * Mocks deleting data from a table.
     */
    delete: async (): Promise<{ data: any[]; error: null }> => ({ data: [], error: null })
  })
};
