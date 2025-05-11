import * as feedbackAnalysisService from "../_mocks_/feedbackAnalysisService"; // Import the mocked service
describe("Feedback Analysis Service", () => {
  test("should record feedback successfully", async () => {
    const feedback = { userId: "test-user", rating: 4, comment: "Great!" };
    // Call the mocked function
    const response = await feedbackAnalysisService.recordFeedback(feedback);
    // Assert the mock response
    expect(response.data.comment).toBe("Great!");
  });
  test("should analyze feedback trends correctly", async () => {
    // Call the mocked function
    const response =
      await feedbackAnalysisService.analyzeFeedbackTrends("last-week");
    // Assert the mock response
    expect(response.totalFeedback).toBe(2);
    expect(response.averageRating).toBe(4.5);
    expect(response.elementalDistribution.fire).toBe(50);
    expect(response.elementalDistribution.water).toBe(50);
  });
});
