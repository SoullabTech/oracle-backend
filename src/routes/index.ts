import { Router } from 'express';
import authRoutes from './authRoutes;
import memoryRoutes from .js'./memoryRoutes;
import sessionRoutes from './sessionRoutes;

const router = Router();

router.use(.js'/auth', authRoutes);
router.use('/memory', memoryRoutes);
router.use('/session', sessionRoutes);

export default router;