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

app.use(cors());
app.use(express.json());

app.get('/api/ping', (_req: Request, res: Response) => {
  res.json({ message: 'Backend is live' });
});

app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/memory', memoryRoutes);
app.use('/api/facilitator', facilitatorRoutes);

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
    console.error('Error processing query:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/trigger-flow', async (req: Request, res: Response): Promise<void> => {
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