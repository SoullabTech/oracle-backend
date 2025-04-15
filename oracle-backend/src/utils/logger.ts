import winston from 'winston';
import { supabase } from '../lib/supabase';

// Custom transport for Supabase
class SupabaseTransport extends winston.Transport {
  async log(info: any, callback: () => void) {
    setImmediate(() => {
      this.emit('logged', info);
    });

    try {
      await supabase
        .from('system_logs')
        .insert({
          level: info.level,
          message: info.message,
          metadata: info.metadata || {},
          timestamp: new Date().toISOString(),
        });
    } catch (error) {
      console.error('Error logging to Supabase:', error);
    }

    callback();
  }
}

// Create logger instance
export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    // Console transport for development
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    // Supabase transport for production logging
    new SupabaseTransport(),
  ],
});

// Add request context
export const addRequestContext = (req: any, info: any) => ({
  ...info,
  metadata: {
    ...info.metadata,
    requestId: req.id,
    userId: req.user?.id,
    path: req.path,
    method: req.method,
  },
});