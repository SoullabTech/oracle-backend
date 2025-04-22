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
