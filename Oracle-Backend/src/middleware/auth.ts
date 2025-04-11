import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Define the user interface based on your JWT payload
interface UserPayload {
  id: string;
  email: string;
  role?: string;
}

// Extend Express Request type to include the user property
interface AuthenticatedRequest extends Request {
  user?: UserPayload;
}

export function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  // Get the JWT secret from environment variables
  const jwtSecret = process.env.JWT_SECRET;
  
  // Check if JWT_SECRET is configured
  if (!jwtSecret) {
    console.error('JWT_SECRET environment variable not set');
    res.status(500).json({ error: 'Server configuration error' });
    return;
  }

  // Extract the token from the Authorization header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  // If no token is provided, return 401 Unauthorized
  if (!token) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  // Verify the token
  try {
    const decoded = jwt.verify(token, jwtSecret) as UserPayload;
    req.user = decoded;
    next();
  } catch (error) {
    // Handle different types of JWT errors
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ error: 'Token expired' });
    } else if (error instanceof jwt.JsonWebTokenError) {
      res.status(403).json({ error: 'Invalid token' });
    } else {
      console.error('Authentication error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
