"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/authRoutes.ts
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const supabaseClient_1 = require("../supabaseClient"); // Ensure this file is set up to initialize Supabase
const router = express_1.default.Router();
const secretKey = process.env.JWT_SECRET || 'your_default_secret_key';
// POST /api/auth/login
// This endpoint takes an email and password, verifies the credentials via Supabase,
// and returns a JWT token containing user info and role.
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }
    // Use Supabase Auth to sign in the user
    const { error, session } = await supabaseClient_1.supabase.auth.signIn({ email, password });
    if (error || !session) {
        return res.status(401).json({ error: error ? error.message : 'Authentication failed.' });
    }
    // Issue a JWT token containing the user's id, email, and role
    const token = jsonwebtoken_1.default.sign({
        id: session.user.id,
        email: session.user.email,
        role: session.user.user_metadata?.role || 'client' // default role is "client"
    }, secretKey, { expiresIn: '1h' });
    res.json({ token });
});
exports.default = router;
