// File: /src/routes/session.routes.ts
// Layer: 🔁 Backend — Oracle Session Tracker (Symbol, Agent, Sigil)
import { Router } from 'express';
import { authenticate } from '../middleware/authenticate';
import { ValidationError } from '@/utils/errors';
import { v4 as uuidv4 } from 'uuid';
const router = Router();
let sessions = []; // Temporary in-memory store (replace w/ DB or Supabase)
router.use(authenticate);
// 🧙 Save a new oracle session
router.post('/', (req, res) => {
    try {
        const { symbol, insight, ritual, element, phase, agent, sigilSvg, archetype } = req.body;
        const clientId = req.user.id;
        if (!symbol || !insight) {
            throw new ValidationError('Symbol and insight are required');
        }
        const session = {
            id: uuidv4(),
            userId: clientId,
            symbol,
            insight,
            ritual,
            element,
            phase,
            agent,
            archetype,
            sigilSvg,
            createdAt: new Date().toISOString(),
        };
        sessions.push(session);
        res.status(201).json({ success: true, session });
    }
    catch (err) {
        console.error('❌ Oracle Session Save Error:', err);
        res.status(500).json({ success: false, error: 'Could not save session.' });
    }
});
// 📜 Get all sessions for a user
router.get('/', (req, res) => {
    try {
        const clientId = req.user.id;
        const userSessions = sessions.filter((s) => s.userId === clientId);
        res.json({ success: true, sessions: userSessions });
    }
    catch (err) {
        console.error('❌ Fetch Session Error:', err);
        res.status(500).json({ success: false, error: 'Failed to fetch sessions.' });
    }
});
export default router;
