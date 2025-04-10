<<<<<<< HEAD
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
// Health-check endpoint
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
=======
// src/server.ts
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
console.log('✅ Express, CORS, and body-parser loaded');
let chatRoutes;
try {
    chatRoutes = await import('./routes/chatRoutes.js'); // ✅ must use .js for ESM if importing dynamically
    console.log('✅ Chat routes loaded');
}
catch (err) {
    console.error('❌ Error importing chatRoutes:', err);
    process.exit(1); // Exit early so we know
}
const app = express();
const PORT = process.env.PORT || 5001;
app.use(cors());
app.use(bodyParser.json());
app.use('/api/chat', chatRoutes.default);
app.get('/', (req, res) => {
    res.send('✅ Oracle backend is running!');
});
app.listen(PORT, () => {
    console.log(`🚀 Oracle backend running on port ${PORT}`);
>>>>>>> 268cb604fe12a917c8e4d04e4a80dde66f880973
});
