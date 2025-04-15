import {
  analyzeFeedbackTrends,
  updatePersonalityWeights,
  getPersonalityWeights,
} from '../monitoringService';
import { supabase } from '../../lib/supabase';

jest.mock('../../lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      upsert: jest.fn().mockReturnThis(),
      gte: jest.fn().mockReturnThis(),
      lte: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
    })),
  },
}));

describe('Monitoring Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('analyzeFeedbackTrends', () => {
    it('should analyze feedback data correctly', async () => {
      const mockFeedback = [
        {
          rating: 5,
          metadata: {
            elementalAdjustments: {
              emphasis: ['fire', 'water'],
            },
          },
        },
        {
          rating: 4,
          metadata: {
            elementalAdjustments: {
              emphasis: ['earth', 'air'],
            },
          },
        },
      ];

      (supabase.from().select().gte().lte as jest.Mock).mockResolvedValue({
        data: mockFeedback,
        error: null,
      });

      const timeframe = {
        start: new Date('2025-01-01'),
        end: new Date('2025-01-02'),
      };

      const metrics = await analyzeFeedbackTrends(timeframe);

      expect(metrics.totalFeedback).toBe(2);
      expect(metrics.averageRating).toBe(4.5);
      expect(metrics.elementalDistribution).toBeDefined();
      expect(metrics.confidenceScores).toBeDefined();
    });

    it('should handle analysis errors', async () => {
      const mockError = new Error('Analysis failed');
      (supabase.from().select().gte().lte as jest.Mock).mockResolvedValue({
        data: null,
        error: mockError,
      });

      const timeframe = {
        start: new Date('2025-01-01'),
        end: new Date('2025-01-02'),
      };

      await expect(analyzeFeedbackTrends(timeframe)).rejects.toThrow('Failed to analyze feedback trends');
    });
  });

  describe('updatePersonalityWeights', () => {
    it('should update weights successfully', async () => {
      const mockAdjustments = [
        { element: 'fire', weight: 0.8, confidence: 0.9 },
        { element: 'water', weight: 0.6, confidence: 0.8 },
      ];

      (supabase.from().upsert as jest.Mock).mockResolvedValue({
        error: null,
      });

      await expect(updatePersonalityWeights(mockAdjustments)).resolves.not.toThrow();
    });

    it('should handle update errors', async () => {
      const mockError = new Error('Update failed');
      (supabase.from().upsert as jest.Mock).mockResolvedValue({
        error: mockError,
      });

      const mockAdjustments = [
        { element: 'fire', weight: 0.8, confidence: 0.9 },
      ];

      await expect(updatePersonalityWeights(mockAdjustments)).rejects.toThrow('Failed to update personality weights');
    });
  });

  describe('getPersonalityWeights', () => {
    it('should fetch weights successfully', async () => {
      const mockWeights = [
        { element: 'fire', weight: 0.8, confidence: 0.9 },
        { element: 'water', weight: 0.6, confidence: 0.8 },
      ];

      (supabase.from().select().order as jest.Mock).mockResolvedValue({
        data: mockWeights,
        error: null,
      });

      const weights = await getPersonalityWeights();
      expect(weights).toEqual(mockWeights);
    });

    it('should handle fetch errors', async () => {
      const mockError = new Error('Fetch failed');
      (supabase.from().select().order as jest.Mock).mockResolvedValue({
        data: null,
        error: mockError,
      });

      await expect(getPersonalityWeights()).rejects.toThrow('Failed to fetch personality weights');
    });
  });
});