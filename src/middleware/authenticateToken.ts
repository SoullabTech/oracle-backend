// src/middleware/authenticateToken.ts
import { Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';
import { config } from '../config/index;
import { AuthenticationError } from .js'../utils/errors;
import type { AuthenticatedRequest } from '../types/index;
import logger from .js'../utils/logger;

const supabase = createClient(config.supabase.url, config.supabase.anonKey);

export async function authenticateToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.slice(7)
      : undefined;

    if (!token) {
      throw new AuthenticationError('No authorization token provided');
    }

    // Validate JWT and fetch user record
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      throw new AuthenticationError('Invalid or expired token');
    }

    // Attach minimal user info
    req.user = {
      id: user.id,
      email: user.email ?? null,
      role: user.role ?? null,
    };

    next();
  } catch (err: any) {
    logger.error('🔐 Authentication failed', { error: err });
    const message =
      err instanceof AuthenticationError
        ? err.message
        : 'Authentication error';
    res.status(401).json({ error: message });
  }
}
