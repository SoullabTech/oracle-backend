<<<<<<< HEAD
import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
// You can use express.json() directly instead of body-parser
// import bodyParser from 'body-parser';
import { runLangChain, triggerPrefectFlow } from './core/orchestrator.js';

dotenv.config();
=======
// src/server.ts
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

console.log('✅ Express, CORS, and body-parser loaded');
>>>>>>> 268cb604fe12a917c8e4d04e4a80dde66f880973

const app = express();
const PORT = process.env.PORT || 5001;

// Use built‑in JSON middleware
app.use(express.json());

<<<<<<< HEAD
// Health-check endpoint
app.get('/api/ping', (req: Request, res: Response) => {
  res.json({ message: 'Backend is live' });
});

// Endpoint for generating prompts using LangChain
app.post('/api/generate-prompt', async (req: Request, res: Response) => {
  const { query, userId } = req.body;
  if (!query || !userId) {
    return res.status(400).json({ error: 'Missing query or userId' });
  }
  
  try {
    const result = await runLangChain(query, { userId });
    res.json({ prompt: result });
  } catch (error) {
    console.error('Error processing query:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint for triggering a Prefect flow
app.post('/api/trigger-flow', async (req: Request, res: Response) => {
  const payload = req.body;
  try {
    const result = await triggerPrefectFlow(payload);
    res.json(result);
  } catch (error) {
    console.error('Error triggering flow:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
=======
// Dynamically import chatRoutes with proper handling
(async () => {
  try {
    const chatRoutes = await import('./routes/chatRoutes.js'); // Must use `.js` in ESM when dynamically importing
    app.use('/api/chat', chatRoutes.default);
    console.log('✅ Chat routes loaded');
  } catch (err) {
    console.error('❌ Error importing chatRoutes:', err);
    process.exit(1); // Exit early on critical import failure
  }

  app.get('/', (req, res) => {
    res.send('✅ Oracle backend is running!');
  });

  app.listen(PORT, () => {
    console.log(`🚀 Oracle backend running on port ${PORT}`);
  });
})();
>>>>>>> 268cb604fe12a917c8e4d04e4a80dde66f880973
