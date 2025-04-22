export const supabase = {
  auth: {
    signInWithPassword: async ({ email, password }) => {
      console.log(`[Mock Supabase] signIn called with: ${email}, ${password}`);
      // Simulate a failed login for a specific email
      if (email === "error@example.com") {
        return {
          user: null,
          session: null,
          error: { message: "Invalid credentials" },
        };
      }
      // Simulate a successful login
      return {
        user: {
          id: "mock-user-id",
          email,
          user_metadata: { role: "client" },
        },
        session: {
          user: {
            id: "mock-user-id",
            email,
            user_metadata: { role: "client" },
          },
        },
        error: null,
      };
    },
    signOut: async () => ({ error: null }),
  },
  from: () => ({
    select: async (tableName) => {
      if (tableName === "users") {
        return {
          data: [{ id: "mock-user-id", email: "user@example.com" }],
          error: null,
        };
      }
      return { data: [], error: null };
    },
    insert: async (payload) => {
      // Simulate insert with error if certain conditions are met
      if (payload.email === "error@example.com") {
        return { data: null, error: { message: "Email already exists" } };
      }
      return { data: [payload], error: null };
    },
    update: async (changes) => {
      if (!changes.id) {
        return { data: null, error: { message: "No user ID provided" } };
      }
      return { data: [changes], error: null };
    },
    delete: async (id) => {
      if (id === "invalid-id") {
        return { data: null, error: { message: "Record not found" } };
      }
      return { data: [{ id }], error: null };
    },
  }),
};
