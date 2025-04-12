import { Router } from 'express';
import authRoutes from './authRoutes.js';
import memoryRoutes from './memoryRoutes.js';
import sessionRoutes from './sessionRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/memory', memoryRoutes);
router.use('/session', sessionRoutes);

export default router;