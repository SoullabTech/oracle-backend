// src/routes/index.ts

import { Router } from 'express';
import authRoutes from './auth.Routes.ts';
import memoryRoutes from './memoryRoutes.ts';
import sessionRoutes from './sessionRoutes.ts';

const router = Router();

router.use('/auth', authRoutes);
router.use('/memory', memoryRoutes);
router.use('/session', sessionRoutes);

export default router;
