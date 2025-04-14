import { Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';
import { config } from '../config/index.js';
import { AuthenticationError } from '../utils/errors.js';
import type { AuthenticatedRequest } from '../types/index.js';
import logger from '../utils/logger.js';

const supabase = createClient(config.supabase.url, config.supabase.anonKey);

export async function authenticateToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];

    if (!token) {
      throw new AuthenticationError('No token provided');
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      throw new AuthenticationError('Invalid token');
    }

    req.user = {
      id: user.id,
      email: user.email || '',
      role: user.role
    };

    next();
  } catch (error) {
    logger.error('Authentication failed', { error });
    if (error instanceof AuthenticationError) {
      next(error);
    } else {
      next(new AuthenticationError('Authentication failed'));
    }
  }
}