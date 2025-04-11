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
const NODE_ENV = process.env.NODE_ENV || 'development';
const LOG_LEVEL = process.env.LOG_LEVEL || 'info';

// Validate required environment variables
if (!process.env.PORT) {
  console.error('Error: PORT environment variable is not set.');
  process.exit(1);  // Exit the process if the port is not set.
}

// CORS configuration
const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'];

const corsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn(`Request from origin ${origin} blocked by CORS policy`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow cookies and authentication headers
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Apply CORS with specific options
app.use(cors(corsOptions));
app.use(express.json());

// Basic application logging
app.use((req, res, next) => {
  if (LOG_LEVEL !== 'error') { // Only log requests if log level permits
    console.log(`${new Date().toISOString()} [${req.method}] ${req.url}`);
  }
  next();
});

// Endpoint to test if the backend is live
app.get('/api/ping', (_req: Request, res: Response) => {
  res.json({ 
    message: 'Backend is live',
    environment: NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/memory', memoryRoutes);
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

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: Function) => {
  console.error(`Error: ${err.message}`);
  res.status(500).json({ error: 'An unexpected error occurred' });
});

console.log(`Starting server in ${NODE_ENV} mode with log level: ${LOG_LEVEL}`);
console.log(`Waiting 5 seconds before starting server...`);

setTimeout(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server is running on port ${PORT} and bound to all interfaces`);
    console.log(`Environment: ${NODE_ENV}`);
    console.log(`Using PORT from environment: ${process.env.PORT || 'not set, using default 5001'}`);
    console.log(`CORS allowed origins: ${allowedOrigins.join(', ')}`);
  });
}, 5000); // 5-second delay
