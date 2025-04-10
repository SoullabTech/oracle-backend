<<<<<<< HEAD
cat > src / routes / authRoutes.ts << 'EOF';
// src/routes/authRoutes.ts
import express from 'express';
import jwt from 'jsonwebtoken';
import { supabase } from '../supabaseClient'; // You must ensure this is initialized properly
const router = express.Router();
const secretKey = process.env.JWT_SECRET || 'your_default_secret_key';
// POST /api/auth/login
=======
// src/routes/authRoutes.ts
import express from 'express';
import jwt from 'jsonwebtoken';
import { supabase } from '../supabaseClient'; // Ensure this file is set up to initialize Supabase
const router = express.Router();
const secretKey = process.env.JWT_SECRET || 'your_default_secret_key';
// POST /api/auth/login
// This endpoint takes an email and password, verifies the credentials via Supabase,
// and returns a JWT token containing user info and role.
>>>>>>> 268cb604fe12a917c8e4d04e4a80dde66f880973
router.post('/login', async (req, res) => {
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
        const token = jwt.sign({
            id: user.id,
            email: user.email,
            role: user.user_metadata?.role || 'client'
        }, secretKey, { expiresIn: '1h' });
        res.json({ token });
    }
    catch (error) {
        res.status(500).json({ error: error.message || 'An unexpected error occurred' });
    }
});
export default router;
EOF;
=======
    // Use Supabase Auth to sign in the user
    const { error, session } = await supabase.auth.signIn({ email, password });
    if (error || !session) {
        return res.status(401).json({ error: error ? error.message : 'Authentication failed.' });
    }
    // Issue a JWT token containing the user's id, email, and role
    const token = jwt.sign({
        id: session.user.id,
        email: session.user.email,
        role: session.user.user_metadata?.role || 'client' // default role is "client"
    }, secretKey, { expiresIn: '1h' });
    res.json({ token });
});
export default router;
>>>>>>> 268cb604fe12a917c8e4d04e4a80dde66f880973
