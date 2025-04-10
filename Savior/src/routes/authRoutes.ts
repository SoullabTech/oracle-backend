import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { supabase } from '../supabaseClient.js';

const router = express.Router();
const secretKey = process.env.JWT_SECRET || 'your_default_secret_key';

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

router.post('/login', async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required.' });
    return;
  }
  
  try {
    const { user, error, session } = await supabase.auth.signInWithPassword({ 
      email, 
      password 
    }) as AuthResponse;
    
    if (error || !session || !user) {
      res.status(401).json({ error: error?.message || 'Authentication failed.' });
      return;
    }
    
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.user_metadata?.role ?? 'client'
      },
      secretKey,
      { expiresIn: '1h' }
    );
    
    res.json({ token });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'An unexpected error occurred' });
  }
});

export default router;