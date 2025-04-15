import {
  storeMemoryItem,
  storeMemoryPattern,
  storeMemoryAggregation,
  getRelevantMemories,
  getPatternsByElements,
  getAggregatedWisdom,
} from '../memoryService';
import { supabase } from '../../lib/supabase';

jest.mock('../../lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      insert: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      contains: jest.fn().mockReturnThis(),
      gte: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      single: jest.fn().mockReturnThis(),
    })),
  },
}));

describe('Memory Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('storeMemoryItem', () => {
    it('should store a memory item successfully', async () => {
      const mockItem = {
        content: 'Test memory',
        element: 'fire',
        sourceAgent: 'test-agent',
        confidence: 0.9,
      };

      const mockResponse = {
        data: { id: 'test-id', ...mockItem },
        error: null,
      };

      (supabase.from().insert().select().single as jest.Mock).mockResolvedValue(mockResponse);

      const id = await storeMemoryItem(mockItem);
      expect(id).toBe('test-id');
    });

    it('should handle storage errors', async () => {
      const mockError = new Error('Storage failed');
      (supabase.from().insert().select().single as jest.Mock).mockResolvedValue({
        data: null,
        error: mockError,
      });

      await expect(storeMemoryItem({
        content: 'Test',
        element: 'fire',
        sourceAgent: 'test',
      })).rejects.toThrow('Failed to store memory item');
    });
  });

  describe('getRelevantMemories', () => {
    it('should fetch memories by element', async () => {
      const mockMemories = [
        { id: '1', content: 'Memory 1', element: 'fire' },
        { id: '2', content: 'Memory 2', element: 'fire' },
      ];

      (supabase.from().select().eq().order().limit as jest.Mock).mockResolvedValue({
        data: mockMemories,
        error: null,
      });

      const memories = await getRelevantMemories('fire');
      expect(memories).toEqual(mockMemories);
    });

    it('should handle fetch errors', async () => {
      const mockError = new Error('Fetch failed');
      (supabase.from().select().eq().order().limit as jest.Mock).mockResolvedValue({
        data: null,
        error: mockError,
      });

      await expect(getRelevantMemories('fire')).rejects.toThrow('Failed to fetch memories');
    });
  });

  describe('getPatternsByElements', () => {
    it('should fetch patterns by elements', async () => {
      const mockPatterns = [
        {
          id: '1',
          patternName: 'Test Pattern',
          elements: ['fire', 'water'],
          facets: ['courage'],
          confidence: 0.9,
        },
      ];

      (supabase.from().select().contains().gte().order as jest.Mock).mockResolvedValue({
        data: mockPatterns,
        error: null,
      });

      const patterns = await getPatternsByElements(['fire', 'water']);
      expect(patterns).toEqual(mockPatterns);
    });
  });

  describe('getAggregatedWisdom', () => {
    it('should fetch aggregated wisdom', async () => {
      const mockWisdom = [
        {
          id: '1',
          content: 'Aggregated wisdom',
          elements: ['fire', 'water'],
          facets: ['courage'],
          confidence: 0.9,
        },
      ];

      (supabase.from().select().contains().contains().gte().order as jest.Mock).mockResolvedValue({
        data: mockWisdom,
        error: null,
      });

      const wisdom = await getAggregatedWisdom(['fire'], ['courage']);
      expect(wisdom).toEqual(mockWisdom);
    });
  });
});