import { Request, Response, NextFunction } from 'express';
import { createClient, User } from '@supabase/supabase-js';
import { config } from '../config/index';
import { AuthenticationError } from '../utils/errors';
import logger from '../utils/logger';

// Supabase client setup
const supabase = createClient(config.supabase.url, config.supabase.anonKey);

// Augmented Request interface
export interface AuthenticatedRequest extends Request {
  user?: User;
}

// Middleware: Authenticate token and attach user to request
export async function authenticate(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if (!token) {
      throw new AuthenticationError('No token provided');
    }

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data?.user) {
      throw new AuthenticationError('Invalid or expired token');
    }

    req.user = data.user;
    next();
  } catch (err) {
    logger.error('❌ Authentication failed', { error: err });
    next(err instanceof AuthenticationError ? err : new AuthenticationError());
  }
}
