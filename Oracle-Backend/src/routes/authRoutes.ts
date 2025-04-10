import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { supabase } from '../supabaseClient.js'; // Assuming supabase is set up

const router = express.Router();
const secretKey = process.env.JWT_SECRET || 'your_default_secret_key';
const refreshSecretKey = process.env.JWT_REFRESH_SECRET || 'your_refresh_secret_key';

// Interface for the response from Supabase
interface AuthResponse {
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
  } | null;
}

// Function to generate a refresh token
const generateRefreshToken = (userId: string) => {
  return jwt.sign({ userId }, refreshSecretKey, { expiresIn: '7d' });
};

// Login route
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required.' });
    return;
  }

  try {
    const { user, error, session } = await supabase.auth.signInWithPassword({ email, password }) as AuthResponse;

    if (error || !session || !user) {
      res.status(401).json({ error: error?.message || 'Authentication failed.' });
      return;
    }

    // Access Token
    const accessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.user_metadata?.role ?? 'client' },
      secretKey,
      { expiresIn: '1h' } // expires in 1 hour
    );

    // Refresh Token
    const refreshToken = generateRefreshToken(user.id);

    // Send both access token and refresh token
    res.json({ accessToken, refreshToken });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'An unexpected error occurred' });
  }
});

export default router;
