import { Router } from 'express';
import authRoutes from './authRoutes';
import chatRoutes from './chatRoutes';
import facilitatorRoutes from './facilitatorRoutes';
import memoryRoutes from './memoryRoutes';
import sessionRoutes from './sessionRoutes';
import flowRoutes from './flowRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/chat', chatRoutes);
router.use('/facilitator', facilitatorRoutes);
router.use('/memory', memoryRoutes);
router.use('/session', sessionRoutes);
router.use('/flow', flowRoutes);

export default router;