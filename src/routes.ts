// src/routes.ts
import { Router } from 'express';

// Route modules
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import oracleRoutes from './routes/oracle.routes';
import journalRoutes from './routes/journal.routes'; // Optional
// Add more route modules as needed

const router = Router();

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/oracle', oracleRoutes);
router.use('/journal', journalRoutes); // Optional

export default router;
