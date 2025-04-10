cat > src/routes/authRoutes.ts << 'EOF'
// src/routes/authRoutes.ts
import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { supabase } from '../supabaseClient'; // You must ensure this is initialized properly
<<<<<<< HEAD
=======

>>>>>>> 268cb604fe12a917c8e4d04e4a80dde66f880973
const router = express.Router();
const secretKey = process.env.JWT_SECRET || 'your_default_secret_key';

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }
<<<<<<< HEAD
  
  try {
    // Try/catch to handle potential type issues
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error || !data.session) {
      return res.status(401).json({ error: error?.message || 'Authentication failed.' });
    }
    
    const { user } = data.session;
    // Create JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.user_metadata?.role || 'client'
      },
      secretKey,
      { expiresIn: '1h' }
    );
    
    res.json({ token });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'An unexpected error occurred' });
  }
=======

  // Correct method for Supabase Auth v2
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.session) {
    return res.status(401).json({ error: error?.message || 'Authentication failed.' });
  }

  const { user } = data.session;

  // Create JWT token
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.user_metadata?.role || 'client'
    },
    secretKey,
    { expiresIn: '1h' }
  );

  res.json({ token });
>>>>>>> 268cb604fe12a917c8e4d04e4a80dde66f880973
});

export default router;
EOF