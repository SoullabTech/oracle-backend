import express from 'express';
import dotenv from 'dotenv';
// You can use express.json() directly instead of body-parser
// import bodyParser from 'body-parser';
import { runLangChain, triggerPrefectFlow } from './core/orchestrator.js';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;
// Use built‑in JSON middleware
app.use(express.json());
app.get('/api/ping', (req, res) => {
    res.json({ message: 'Backend is live' });
});
// Endpoint for generating prompts using LangChain
app.post('/api/generate-prompt', async (req, res) => {
    const { query, userId } = req.body;
    if (!query || !userId) {
        return res.status(400).json({ error: 'Missing query or userId' });
    }
    try {
        const result = await runLangChain(query, { userId });
        res.json({ prompt: result });
    }
    catch (error) {
        console.error('Error processing query:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// Endpoint for triggering a Prefect flow
app.post('/api/trigger-flow', async (req, res) => {
    const payload = req.body;
    try {
        const result = await triggerPrefectFlow(payload);
        res.json(result);
    }
    catch (error) {
        console.error('Error triggering flow:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
