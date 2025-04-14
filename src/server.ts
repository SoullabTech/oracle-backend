import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { config } from './config/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import router from './routes/index.js';
import logger from './utils/logger.js';

const app = express();

// Trust proxy for rate limiting
app.enable('trust proxy');

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  standardHeaders: true,
  legacyHeaders: false
});

// Security middleware
app.use(helmet());
app.use(cors({
  origin: config.cors.origin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(limiter);

// Utility middleware
app.use(compression());
app.use(morgan(config.logging.format));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', router);

// Health check
app.get('/health', (_req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: config.server.env
  });
});

// Error handling
app.use(errorHandler);

// Start server
const server = app.listen(config.server.port, () => {
  logger.info(`🚀 Server running on port ${config.server.port} in ${config.server.env} mode`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Performing graceful shutdown...');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

export default app;