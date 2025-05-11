import { vi } from "vitest";
// Mocking functions
export const recordFeedback = vi.fn().mockResolvedValue({
  data: { id: "1", comment: "Great!" },
  error: null,
});
export const analyzeFeedbackTrends = vi.fn().mockResolvedValue({
  totalFeedback: 2,
  positiveFeedback: 1,
  negativeFeedback: 1,
  averageRating: 4.5,
  elementalDistribution: { fire: 50, water: 50 },
});
