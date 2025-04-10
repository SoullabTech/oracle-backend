import { Router, Response } from 'express';
const router = Router();

router.get('/', (_req, res: Response) => {
  res.json({ message: 'Oracle Routes Works' });
});

export default router;