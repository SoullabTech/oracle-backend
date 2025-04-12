import express, { Request, Response } from 'express';

const router = express.Router();

// Basic route with type safety
router.get('/hello', (_req: Request, res: Response) => {
  res.json({ message: 'Hello, world!' });
});

// Route with parameters
router.get('/greet/:name', (req: Request, res: Response) => {
  const { name } = req.params;
  res.json({ message: `Hello, ${name}!` });
});

// Route with query parameters
router.get('/sum', (req: Request, res: Response) => {
  const a = Number(req.query.a);
  const b = Number(req.query.b);

  if (isNaN(a) || isNaN(b)) {
    return res.status(400).json({ error: 'Invalid parameters. Both a and b must be numbers.' });
  }

  res.json({ result: a + b });
});

export default router;