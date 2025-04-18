import { describe, it, expect, beforeEach, vi } from 'vitest';
import { storeKnowledge, queryKnowledge, validateKnowledge } from '../knowledgeBaseService';
import { supabase } from '../../lib/supabase';

vi.mock('../../lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      insert: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      gte: vi.fn().mockReturnThis(),
      textSearch: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      single: vi.fn(),
    })),
    sql: vi.fn((strings, ...values) => ({ strings, values })),
  },
}));

describe('Knowledge Base Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('storeKnowledge', () => {
    it('should store knowledge entry successfully', async () => {
      const mockEntry = {
        title: 'Test Entry',
        content: 'Test content',
        category: 'test',
        element: 'fire',
        source: 'test',
      };

      const mockResponse = {
        data: { id: 'test-id', ...mockEntry },
        error: null,
      };

      (supabase.from().insert().select().single as any).mockResolvedValue(mockResponse);

      const id = await storeKnowledge(mockEntry);
      expect(id).toBe('test-id');
    });

    it('should handle storage errors', async () => {
      const mockError = new Error('Storage failed');
      (supabase.from().insert().select().single as any).mockResolvedValue({
        data: null,
        error: mockError,
      });

      await expect(storeKnowledge({
        title: 'Test',
        content: 'Test',
        category: 'test',
        source: 'test',
      })).rejects.toThrow('Failed to store knowledge');
    });
  });

  describe('queryKnowledge', () => {
    it('should query knowledge base with filters', async () => {
      const mockEntries = [
        { id: '1', title: 'Entry 1' },
        { id: '2', title: 'Entry 2' },
      ];

      (supabase.from().select().eq as any).mockResolvedValue({
        data: mockEntries,
        error: null,
      });

      const results = await queryKnowledge({
        category: 'test',
        element: 'fire',
        minConfidence: 0.7,
      });

      expect(results).toEqual(mockEntries);
    });
  });

  describe('validateKnowledge', () => {
    it('should validate knowledge entry', async () => {
      const mockResponse = { error: null };
      (supabase.from().update().eq as any).mockResolvedValue(mockResponse);

      await expect(validateKnowledge('test-id', true, 'Approved')).resolves.not.toThrow();
    });
  });
});
