import express, { Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import chatRoutes from './routes/chatRoutes.js';
import facilitatorRoutes from './routes/facilitatorRoutes.js';

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/chat', chatRoutes);
app.use('/api/facilitator', facilitatorRoutes);

app.get('/', (_req, res: Response) => {
  res.send('Welcome to the Oracle Backend');
});

app.listen(PORT, () => {
  console.log(`🚀 Oracle backend running on port ${PORT}`);
});