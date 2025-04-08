// src/server.ts
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import chatRoutes from './routes/chatRoutes.js';
import facilitatorRoutes from './routes/facilitatorRoutes.js';

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/chat', chatRoutes);
app.use('/api/facilitator', facilitatorRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the Oracle Backend');
});

app.listen(PORT, () => {
  console.log(`🚀 Oracle backend running on port ${PORT}`);
});
