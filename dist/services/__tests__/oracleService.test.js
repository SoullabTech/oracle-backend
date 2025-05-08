import { describe, it, expect, beforeEach, vi } from "vitest";
import { getOracleResponse } from "../oracleService";
import { getUserProfile } from "../profileService";
import { getPersonalityWeights } from "../monitoringService";
import { getAggregatedWisdom } from "../memoryService";
import { oracle } from "../OracleAgent";
// Mock dependencies
vi.mock("../profileService");
vi.mock("../monitoringService");
vi.mock("../memoryService");
vi.mock("../OracleAgent");
describe("Oracle Service", () => {
    const mockUserId = "test-user-123";
    const mockProfile = {
        fire: 80,
        water: 60,
        earth: 70,
        air: 50,
        aether: 40,
        crystal_focus: {
            type: "spiritual",
            challenges: "Finding inner peace",
            aspirations: "Deeper connection with self",
        },
        user_id: mockUserId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    };
    const mockWeights = [
        { element: "fire", weight: 0.8, confidence: 0.9 },
        { element: "water", weight: 0.6, confidence: 0.8 },
        { element: "earth", weight: 0.7, confidence: 0.85 },
        { element: "air", weight: 0.5, confidence: 0.75 },
        { element: "aether", weight: 0.4, confidence: 0.7 },
    ];
    const mockWisdom = [
        {
            id: "wisdom-1",
            content: "Test wisdom",
            elements: ["fire"],
            facets: ["all"],
            confidence: 0.9,
            sourcePatterns: [],
        },
    ];
    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(getUserProfile).mockResolvedValue(mockProfile);
        vi.mocked(getPersonalityWeights).mockResolvedValue(mockWeights);
        vi.mocked(getAggregatedWisdom).mockResolvedValue(mockWisdom);
        vi.mocked(oracle.processQuery).mockResolvedValue({
            content: "Test response",
            provider: "openai",
            model: "gpt-4",
            confidence: 0.9,
            metadata: {
                elementalAdjustments: { tone: "passionate" },
                dominantElement: "fire",
                wisdomCount: 1,
            },
        });
    });
    it("should process query with personality adjustments", async () => {
        const response = await getOracleResponse("Test query", {
            userId: mockUserId,
        });
        expect(response.content).toContain("Test response");
        expect(response.metadata.elementalAdjustments).toBeDefined();
        expect(response.metadata.dominantElement).toBe("fire");
        expect(response.metadata.wisdomCount).toBe(1);
    });
    it("should handle missing profile error", async () => {
        vi.mocked(getUserProfile).mockResolvedValue(null);
        await expect(getOracleResponse("Test query", { userId: mockUserId })).rejects.toThrow("User profile not found");
    });
    it("should include collective wisdom context", async () => {
        await getOracleResponse("Test query", { userId: mockUserId });
        expect(vi.mocked(oracle.processQuery)).toHaveBeenCalledWith(expect.objectContaining({
            input: expect.stringContaining("Previous insight: Test wisdom"),
        }));
    });
    it("should adjust query based on dominant element", async () => {
        await getOracleResponse("Test query", { userId: mockUserId });
        expect(vi.mocked(oracle.processQuery)).toHaveBeenCalledWith(expect.objectContaining({
            input: expect.stringContaining("With passionate creativity"),
        }));
    });
    it("should include personality emphasis in context", async () => {
        await getOracleResponse("Test query", { userId: mockUserId });
        expect(vi.mocked(oracle.processQuery)).toHaveBeenCalledWith(expect.objectContaining({
            input: expect.stringContaining("Personality Emphasis"),
        }));
    });
});
