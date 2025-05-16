import { describe, it, expect, beforeEach, vi } from 'vitest';
import { submitFeedback, getFeedbackStats, getUserFeedback } from '../feedbackService.js';
import { supabase } from '../../lib/supabase.js';

vi.mock('../../lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      insert: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
    })),
  },
}));

describe('Feedback Service', () => {
  const mockUserId = 'test-user-123';
  const mockFeedback = {
    responseId: 'response-123',
    response: 'Test response',
    rating: 5,
    comment: 'Great response!',
    metadata: { queryType: 'analytical' },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('submitFeedback', () => {
    it('should submit feedback successfully', async () => {
      const mockSupabaseResponse = { error: null };
      supabase.from().insert.mockResolvedValue(mockSupabaseResponse);

      await expect(submitFeedback(mockUserId, mockFeedback)).resolves.not.toThrow();
      expect(supabase.from).toHaveBeenCalledWith('feedback_metrics');
    });

    it('should handle submission errors', async () => {
      const mockSupabaseResponse = { error: new Error('Submission failed') };
      supabase.from().insert.mockResolvedValue(mockSupabaseResponse);

      await expect(submitFeedback(mockUserId, mockFeedback)).rejects.toThrow('Failed to submit feedback');
    });
  });

  describe('getFeedbackStats', () => {
    it('should fetch stats successfully', async () => {
      const mockStats = {
        data: [
          { rating: 5, metadata: { element: 'fire' } },
          { rating: 4, metadata: { element: 'water' } },
        ],
        error: null,
      };

      supabase.from().select().eq.mockResolvedValue(mockStats);

      const stats = await getFeedbackStats(mockUserId);
      expect(stats).toBeDefined();
      expect(stats?.totalFeedback).toBe(2);
      expect(stats?.averageRating).toBe(4.5);
    });

    it('should handle empty feedback data', async () => {
      const mockResponse = { data: [], error: null };
      supabase.from().select().eq.mockResolvedValue(mockResponse);

      const stats = await getFeedbackStats(mockUserId);
      expect(stats).toBeNull();
    });
  });
