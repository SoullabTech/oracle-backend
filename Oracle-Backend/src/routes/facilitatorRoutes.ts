import express, { Response } from 'express';

const router = express.Router();

const sessions = [
  { clientId: 'client1', sessionStart: new Date().toISOString(), status: 'active' },
  { clientId: 'client2', sessionStart: new Date().toISOString(), status: 'completed' },
];

router.get('/sessions', (_req, res: Response) => {
  res.json({ sessions });
});

export default router;