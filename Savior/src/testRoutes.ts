import express, { Response } from 'express';

const router = express.Router();

router.get('/hello', (_req, res: Response) => {
  res.send('Hello, world!');
});

export default router;