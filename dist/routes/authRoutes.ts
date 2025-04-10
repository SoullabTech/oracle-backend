import express from 'express';
import { createClient } from '@supabase/supabase-js';

const router = express.Router();

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  try {
    // Use the appropriate Supabase auth method based on your version
    // For older Supabase versions:
    const { data, error } = await supabase.auth.signIn({ email, password });
    
    // For newer Supabase versions:
    // const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) throw error;
    
    return res.status(200).json({ user: data.user, session: data.session });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});

// Logout route
router.post('/logout', async (req, res) => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) throw error;
    
    return res.status(200).json({ message: 'Logged out successfully' });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});

export default router;