// src/server.ts
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

console.log('✅ Express, CORS, and body-parser loaded');

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
  } catch (error) {
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
  } catch (error) {
    console.error('Error triggering flow:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

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
