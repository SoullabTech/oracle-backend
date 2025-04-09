// src/server.ts
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

console.log('✅ Express, CORS, and body-parser loaded');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(bodyParser.json());

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
