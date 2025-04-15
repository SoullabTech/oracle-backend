import { submitFeedback, getFeedbackStats, getUserFeedback } from '../feedbackService';
import { supabase } from '../../lib/supabase';

jest.mock('../../lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      insert: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
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
    jest.clearAllMocks();
  });

  describe('submitFeedback', () => {
    it('should submit feedback successfully', async () => {
      const mockSupabaseResponse = { error: null };
      (supabase.from().insert as jest.Mock).mockResolvedValue(mockSupabaseResponse);

      await expect(submitFeedback(mockUserId, mockFeedback)).resolves.not.toThrow();
      expect(supabase.from).toHaveBeenCalledWith('feedback_metrics');
    });

    it('should handle submission errors', async () => {
      const mockError = new Error('Submission failed');
      const mockSupabaseResponse = { error: mockError };
      (supabase.from().insert as jest.Mock).mockResolvedValue(mockSupabaseResponse);

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

      (supabase.from().select().eq as jest.Mock).mockResolvedValue(mockStats);

      const stats = await getFeedbackStats(mockUserId);
      expect(stats).toBeDefined();
      expect(stats?.totalFeedback).toBe(2);
      expect(stats?.averageRating).toBe(4.5);
    });

    it('should handle empty feedback data', async () => {
      const mockResponse = { data: [], error: null };
      (supabase.from().select().eq as jest.Mock).mockResolvedValue(mockResponse);

      const stats = await getFeedbackStats(mockUserId);
      expect(stats).toBeNull();
    });
  });

  describe('getUserFeedback', () => {
    it('should fetch user feedback successfully', async () => {
      const mockFeedbackList = [
        { id: '1', rating: 5 },
        { id: '2', rating: 4 },
      ];

      (supabase.from().select().eq().order().limit as jest.Mock).mockResolvedValue({
        data: mockFeedbackList,
        error: null,
      });

      const feedback = await getUserFeedback(mockUserId);
      expect(feedback).toEqual(mockFeedbackList);
    });

    it('should handle fetch errors', async () => {
      const mockError = new Error('Fetch failed');
      (supabase.from().select().eq().order().limit as jest.Mock).mockResolvedValue({
        data: null,
        error: mockError,
      });

      const feedback = await getUserFeedback(mockUserId);
      expect(feedback).toEqual([]);
    });
  });
});