import { analyzeFeedbackTrends, updatePersonalityWeights, getPersonalityWeights, } from "../monitoringService";
import { supabase } from "../../lib/supabase";
import { describe, it, expect, beforeEach, vi } from "vitest";
vi.mock("../../lib/supabase", () => ({
    supabase: {
        from: vi.fn(() => ({
            select: vi.fn().mockReturnThis(),
            insert: vi.fn().mockReturnThis(),
            upsert: vi.fn().mockReturnThis(),
            gte: vi.fn().mockReturnThis(),
            lte: vi.fn().mockReturnThis(),
            order: vi.fn().mockReturnThis(),
        })),
    },
}));
describe("Monitoring Service", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    describe("analyzeFeedbackTrends", () => {
        it("should analyze feedback data correctly", async () => {
            const mockFeedback = [
                {
                    rating: 5,
                    metadata: {
                        elementalAdjustments: {
                            emphasis: ["fire", "water"],
                        },
                    },
                },
                {
                    rating: 4,
                    metadata: {
                        elementalAdjustments: {
                            emphasis: ["earth", "air"],
                        },
                    },
                },
            ];
            supabase.from().select().gte().lte.mockResolvedValue({
                data: mockFeedback,
                error: null,
            });
            const timeframe = {
                start: new Date("2025-01-01"),
                end: new Date("2025-01-02"),
            };
            const metrics = await analyzeFeedbackTrends(timeframe);
            expect(metrics.totalFeedback).toBe(2);
            expect(metrics.averageRating).toBe(4.5);
            expect(metrics.elementalDistribution).toBeDefined();
            expect(metrics.confidenceScores).toBeDefined();
        });
        it("should handle analysis errors", async () => {
            supabase.from().select().gte().lte.mockResolvedValue({
                data: null,
                error: new Error("Analysis failed"),
            });
            const timeframe = {
                start: new Date("2025-01-01"),
                end: new Date("2025-01-02"),
            };
            await expect(analyzeFeedbackTrends(timeframe)).rejects.toThrow("Failed to analyze feedback trends");
        });
    });
    describe("updatePersonalityWeights", () => {
        it("should update weights successfully", async () => {
            supabase.from().upsert.mockResolvedValue({
                error: null,
            });
            const mockAdjustments = [
                { element: "fire", weight: 0.8, confidence: 0.9 },
                { element: "water", weight: 0.6, confidence: 0.8 },
            ];
            await expect(updatePersonalityWeights(mockAdjustments)).resolves.not.toThrow();
        });
        it("should handle update errors", async () => {
            supabase.from().upsert.mockResolvedValue({
                error: new Error("Update failed"),
            });
            const mockAdjustments = [
                { element: "fire", weight: 0.8, confidence: 0.9 },
            ];
            await expect(updatePersonalityWeights(mockAdjustments)).rejects.toThrow("Failed to update personality weights");
        });
    });
    describe("getPersonalityWeights", () => {
        it("should fetch weights successfully", async () => {
            const mockWeights = [
                { element: "fire", weight: 0.8, confidence: 0.9 },
                { element: "water", weight: 0.6, confidence: 0.8 },
            ];
            supabase.from().select().order.mockResolvedValue({
                data: mockWeights,
                error: null,
            });
            const weights = await getPersonalityWeights();
            expect(weights).toEqual(mockWeights);
        });
        it("should handle fetch errors", async () => {
            supabase.from().select().order.mockResolvedValue({
                data: null,
                error: new Error("Fetch failed"),
            });
            await expect(getPersonalityWeights()).rejects.toThrow("Failed to fetch personality weights");
        });
    });
});
