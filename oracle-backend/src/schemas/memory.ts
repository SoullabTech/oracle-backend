import { z } from 'zod';

export const createMemorySchema = z.object({
  body: z.object({
    content: z.string().min(1, 'Content is required'),
    metadata: z.record(z.unknown()).optional()
  })
});

export const updateMemorySchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid memory ID')
  }),
  body: z.object({
    content: z.string().min(1, 'Content is required')
  })
});

export const deleteMemorySchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid memory ID')
  })
});