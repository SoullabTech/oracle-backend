// src/server.ts

import 'tsconfig-paths/register';
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import util from 'node:util';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { supabase } from './lib/supabaseClient';
import { authenticate } from './middleware/authenticate';

import userProfileRouter from './routes/userProfile.routes';
import oracleRouter from './routes/oracle.routes';
import facetRouter from './routes/facet.routes';
import facetMapRouter from './routes/facetMap.routes';
import insightHistoryRouter from './routes/insightHistory.routes';
import storyGeneratorRouter from './routes/storyGenerator.routes';
import surveyRouter from './routes/survey.routes';
import memoryRouter from './routes/memory.routes';
import feedbackRouter from './routes/feedback.routes';
import notionIngestRoutes from './routes/notionIngest.routes';

import logger from './utils/logger';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (_req, res) => res.send('🧠 Spiralogic Oracle backend is alive.'));

app.get('/test-supabase', async (_req, res) => {
  const { data, error } = await supabase.from('insight_history').select('*').limit(1);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ sampleRow: data });
});

// Public Routes
app.use('/api/oracle', oracleRouter);
app.use('/api/oracle/facet-lookup', facetRouter);
app.use('/api/oracle/facet-map', facetMapRouter);
app.use('/api/oracle/story-generator', storyGeneratorRouter);
app.use('/api/feedback', feedbackRouter);
app.use('/api/user', userProfileRouter);

// Ingestion
app.use('/api/notion/ingest', notionIngestRoutes);

// Protected Routes
app.use('/api/oracle/insight-history', authenticate, insightHistoryRouter);
app.use('/api/survey', authenticate, surveyRouter);
app.use('/api/oracle/memory', authenticate, memoryRouter);

// Swagger
try {
  const swaggerDocument = YAML.load(path.join(__dirname, 'docs', 'oracle.openapi.yaml'));
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  logger.info(`📘 Swagger UI available at http://localhost:${PORT}/docs`);
} catch (e) {
  logger.warn('⚠️ Swagger YAML could not be loaded. Skipping /docs.');
}

// Catch-all 404
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error Handling
process.on('unhandledRejection', (reason, promise) => {
  console.error('🔥 Unhandled Rejection at:', promise);
  console.error('Reason:', reason instanceof Error ? reason.stack : util.inspect(reason));
});

process.on('uncaughtException', (err) => {
  console.error('💥 Uncaught Exception:', err instanceof Error ? err.stack : util.inspect(err));
});

process.on('SIGINT', () => {
  console.log('🛑 Gracefully shutting down...');
  process.exit();
});

// Bootstrap
app.listen(PORT, () => {
  logger.info(`🚀 Oracle backend running at http://localhost:${PORT}`);
});
