import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { supabase } from '../utils/mockSupabase';
import type { AuthResponse } from '../types';

const router = Router();
const secretKey = process.env.JWT_SECRET || 'your_default_secret_key';
const refreshSecretKey = process.env.JWT_REFRESH_SECRET || 'your_refresh_secret_key';

const generateRefreshToken = (userId: string): string => {
  return jwt.sign({ userId }, refreshSecretKey, { expiresIn: '7d' });
};

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const { user, error, session } = await supabase.auth.signInWithPassword({ 
      email, 
      password 
    }) as AuthResponse;

    if (error || !session || !user) {
      return res.status(401).json({ 
        error: error?.message || 'Authentication failed.' 
      });
    }

    const accessToken = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.user_metadata?.role ?? 'client' 
      },
      secretKey,
      { expiresIn: '1h' }
    );

    const refreshToken = generateRefreshToken(user.id);

    res.json({ accessToken, refreshToken });
  } catch (error) {
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'An unexpected error occurred' 
    });
  }
});

router.post('/refresh', (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ error: 'Refresh token is required.' });
  }

  try {
    const decoded = jwt.verify(refreshToken, refreshSecretKey) as { userId: string };
    const accessToken = jwt.sign(
      { id: decoded.userId },
      secretKey,
      { expiresIn: '1h' }
    );

    res.json({ accessToken });
  } catch (error) {
    res.status(401).json({ error: 'Invalid refresh token.' });
  }
});

router.post('/logout', async (req, res) => {
  try {
    await supabase.auth.signOut();
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Logout failed' 
    });
  }
});

export default router;