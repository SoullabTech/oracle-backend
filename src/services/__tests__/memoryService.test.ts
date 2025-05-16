import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryService } from '../memoryService.js';
import { createClient } from '@supabase/supabase-js';

vi.mock('@supabase/supabase-js', () => {
  const insert = vi.fn().mockReturnThis();
  const select = vi.fn().mockReturnThis();
  const eq = vi.fn().mockReturnThis();
  const update = vi.fn().mockReturnThis();
  const deleteFn = vi.fn().mockReturnThis();
  const single = vi.fn();

  return {
    createClient: vi.fn(() => ({
      from: vi.fn(() => ({
        insert,
        select,
        eq,
        update,
        delete: deleteFn,
        single,
      })),
    })),
  };
});

const memoryService = new MemoryService();

describe('MemoryService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should store memory successfully', async () => {
    const mockData = {
      id: 'test-id',
      content: 'Test memory',
      metadata: {},
      user_id: 'client-1',
    };

    const client = createClient('', '');
    (client.from().insert().select().single as any).mockResolvedValue({
      data: mockData,
      error: null,
    });

    const result = await memoryService.storeMemory({
      clientId: 'client-1',
      content: 'Test memory',
      metadata: {},
    });

    expect(result).toEqual(mockData);
  });

  it('should throw on failed memory store', async () => {
    const client = createClient('', '');
    (client.from().insert().select().single as any).mockResolvedValue({
      data: null,
      error: new Error('Insert failed'),
    });

    await expect(
      memoryService.storeMemory({
        clientId: 'client-1',
        content: 'Fail',
        metadata: {},
      })
    ).rejects.toThrow();
  });

  it('should retrieve memories by clientId', async () => {
    const mockData = [
      { id: '1', content: 'Memory 1', user_id: 'client-1' },
      { id: '2', content: 'Memory 2', user_id: 'client-1' },
    ];

    const client = createClient('', '');
    (client.from().select().eq as any).mockResolvedValue({
      data: mockData,
      error: null,
    });

    const result = await memoryService.retrieveMemories('client-1');
    expect(result).toEqual(mockData);
  });

  it('should update memory content', async () => {
    const client = createClient('', '');
    (client.from().update().eq as any).mockResolvedValue({ error: null });

    const result = await memoryService.updateMemory('memory-123', 'Updated content', 'client-1');
    expect(result).toBe(true);
  });

  it('should delete memory', async () => {
    const client = createClient('', '');
    (client.from().delete().eq as any).mockResolvedValue({ error: null });

    const result = await memoryService.deleteMemory('memory-123', 'client-1');
    expect(result).toBe(true);
  });

  it('should return fallback insight if no memories found', async () => {
    const client = createClient('', '');
    (client.from().select().eq as any).mockResolvedValue({
      data: [],
      error: null,
    });

    const insights = await memoryService.getMemoryInsights('client-1');
    expect(insights[0]).toMatch(/no memories found/i);
  });

  it('should generate memory insights from entries', async () => {
    const mockData = [
      { id: '1', content: 'Memory A', user_id: 'client-1' },
      { id: '2', content: 'Memory B', user_id: 'client-1' },
    ];

    const client = createClient('', '');
    (client.from().select().eq as any).mockResolvedValue({
      data: mockData,
      error: null,
    });

    const insights = await memoryService.getMemoryInsights('client-1');
    expect(insights.length).toBeGreaterThan(1);
  });
});
