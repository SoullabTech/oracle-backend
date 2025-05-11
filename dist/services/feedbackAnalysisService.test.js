// test/services/feedbackAnalysisService.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  recordFeedback,
  analyzeFeedbackTrends,
} from "@/services/feedbackAnalysisService";
vi.mock("@/lib/supabase", async () => {
  const insert = vi.fn().mockResolvedValue({ data: [{ id: 1 }], error: null });
  const select = vi.fn().mockResolvedValue({
    data: [
      {
        user_id: "test-user",
        response_id: "r-001",
        rating: 4,
        element: "fire",
        response_pattern: "mentor",
        created_at: new Date().toISOString(),
      },
    ],
    error: null,
  });
  return {
    supabase: {
      from: vi.fn(() => ({
        insert,
        select,
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: {}, error: null }),
      })),
    },
  };
});
describe("FeedbackAnalysisService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it("should record feedback successfully", async () => {
    const feedbackData = {
      rating: 4,
      metadata: {
        element: "fire",
        queryType: "mentor",
        responsePattern: "mentor",
      },
    };
    await expect(
      recordFeedback("test-user", "r-001", feedbackData),
    ).resolves.toBeUndefined();
    expect(supabase.from).toHaveBeenCalledWith("feedback");
    expect(supabase.from().insert).toHaveBeenCalledWith({
      ...feedbackData,
      user_id: "test-user",
      response_id: "r-001",
    });
  });
  it("should analyze feedback trends and apply adjustments", async () => {
    const timeframe = {
      start: new Date(Date.now() - 86400000),
      end: new Date(),
    };
    await expect(analyzeFeedbackTrends(timeframe)).resolves.toBeUndefined();
    expect(supabase.from).toHaveBeenCalledWith("feedback");
    expect(supabase.from().select).toHaveBeenCalledWith("*");
  });
});
