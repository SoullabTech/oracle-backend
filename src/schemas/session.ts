import { z } from 'zod';

export const createSessionSchema = z.object({
  body: z.object({
    metadata: z.record(z.unknown()).optional()
  })
});

export const updateSessionSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid session ID')
  }),
  body: z.object({
    status: z.enum(['active', 'completed']),
    metadata: z.record(z.unknown()).optional()
  })
});

export const getSessionStatsSchema = z.object({
  query: z.object({
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional()
  })
});