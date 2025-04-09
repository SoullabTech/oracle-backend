// src/routes/facilitatorRoutes.ts
import express from 'express';
const router = express.Router();
// Dummy client session data for demonstration
const sessions = [
    { clientId: 'client1', sessionStart: new Date().toISOString(), status: 'active' },
    { clientId: 'client2', sessionStart: new Date().toISOString(), status: 'completed' },
];
// GET /api/facilitator/sessions
router.get('/sessions', (req, res) => {
    res.json({ sessions });
});
export default router;
