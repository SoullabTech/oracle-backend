import {
  storeWisdom,
  storePattern,
  connectWisdom,
  getWisdomByElements,
  getPatternsByFacets,
  getConnectedWisdom,
} from '../collectiveWisdomService.js';
import { supabase } from '../../lib/supabase.js';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      insert: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      contains: vi.fn().mockReturnThis(),
      gte: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      or: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      single: vi.fn(),
    })),
  },
}));

describe('Collective Wisdom Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('storeWisdom', () => {
    it('should store wisdom successfully', async () => {
      const mockWisdom = {
        content: 'Test wisdom',
        elements: ['fire', 'water'],
        facets: ['courage'],
        sourceType: 'oracle',
        confidence: 0.9,
      };

      const mockResponse = {
        data: { id: 'test-id', ...mockWisdom },
        error: null,
      };

      (supabase.from().insert().select().single as any).mockResolvedValue(mockResponse);

      const id = await storeWisdom(mockWisdom);
      expect(id).toBe('test-id');
    });

    it('should handle storage errors', async () => {
      const mockError = new Error('Storage failed');
      (supabase.from().insert().select().single as any).mockResolvedValue({
        data: null,
        error: mockError,
      });

      await expect(
        storeWisdom({
          content: 'Test',
          elements: [],
          facets: [],
          sourceType: 'test',
          confidence: 1,
        })
      ).rejects.toThrow('Failed to store wisdom');
    });
  });

  describe('getWisdomByElements', () => {
    it('should fetch wisdom by elements', async () => {
      const mockWisdom = [
        {
          id: '1',
          content: 'Test wisdom',
          elements: ['fire'],
          facets: ['courage'],
          confidence: 0.9,
        },
      ];

      (supabase.from().select().contains().gte().order().limit as any).mockResolvedValue({
        data: mockWisdom,
        error: null,
      });

      const wisdom = await getWisdomByElements(['fire']);
      expect(wisdom).toEqual(mockWisdom);
    });
  });

  describe('getPatternsByFacets', () => {
    it('should fetch patterns by facets', async () => {
      const mockPatterns = [
        {
          id: '1',
          name: 'Test Pattern',
          facets: ['courage'],
          elements: ['fire'],
          frequency: 5,
          confidence: 0.9,
        },
      ];

      (supabase.from().select().contains().gte().order as any).mockResolvedValue({
        data: mockPatterns,
        error: null,
      });

      const patterns = await getPatternsByFacets(['courage']);
      expect(patterns).toEqual(mockPatterns);
    });
  });

  describe('getConnectedWisdom', () => {
    it('should fetch connected wisdom', async () => {
      const mockConnections = [
        {
          id: '1',
          sourceWisdomId: 'source-id',
          targetWisdomId: 'target-id',
          connectionType: 'similar',
          strength: 0.8,
        },
      ];

      (supabase.from().select().or as any).mockResolvedValue({
        data: mockConnections,
        error: null,
      });

      const connections = await getConnectedWisdom('source-id');
      expect(connections).toEqual(mockConnections);
    });
  });
});
