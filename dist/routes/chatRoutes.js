// src/routes/chatRoutes.ts
import express from 'express';
import { MainOracleAgent } from '../core/mainOracleAgent.js';
const router = express.Router();
const oracle = new MainOracleAgent({ debug: true });
router.post('/process', async (req, res) => {
    try {
        const { query } = req.body;
        if (!query) {
            return res.status(400).json({ error: 'Missing query in request body.' });
        }
        const result = await oracle.processQuery(query);
        res.json(result);
    }
    catch (err) {
        console.error('Error in /process route:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
export default router;
