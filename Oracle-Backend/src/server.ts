import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { runLangChain, triggerPrefectFlow } from './core/orchestrator.js';
import authRoutes from './routes/authRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import memoryRoutes from './routes/memoryRoutes.js';
import facilitatorRoutes from './routes/facilitatorRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

if (!process.env.PORT) {
  console.error('Error: PORT environment variable is not set.');
  process.exit(1);  // Exit the process if the port is not set.
}

app.use(cors());
app.use(express.json());

// Endpoint to test if the backend is live
app.get('/api/ping', (_req: Request, res: Response) => {
  res.json({ message: 'Backend is live' });
});

// Auth routes
app.use('/api/auth', authRoutes);

// Chat routes
app.use('/api/chat', chatRoutes);

// Memory routes
app.use('/api/memory', memoryRoutes);

// Facilitator routes
app.use('/api/facilitator', facilitatorRoutes);

// Generate prompt for LangChain
app.post('/api/generate-prompt', async (req: Request, res: Response): Promise<void> => {
  const { query, userId } = req.body;
  if (!query || !userId) {
    res.status(400).json({ error: 'Missing query or userId' });
    return;
  }
  
  try {
    const result = await runLangChain(query);
    res.json({ prompt: result });
  } catch (error) {
    console.error('Error processing LangChain query:', error);
    res.status(500).json({ error: 'Error processing LangChain query. Please try again later.' });
  }
});

// Trigger Prefect Flow
app.post('/api/trigger-flow', async (req: Request, res: Response): Promise<void> => {
  const payload = req.body;
  try {
    const result = await triggerPrefectFlow(payload);
    res.json(result);
  } catch (error) {
    console.error('Error triggering Prefect flow:', error);
    res.status(500).json({ error: 'Error triggering Prefect flow. Please try again later.' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
