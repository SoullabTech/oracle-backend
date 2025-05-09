import { getUserProfile, updateUserProfile, getProfileStats, } from "../profileService";
import { supabase } from "../../lib/supabase";
import { describe, it, expect, beforeEach, vi } from "vitest";
vi.mock("../../lib/supabase", () => ({
    supabase: {
        from: vi.fn(() => ({
            select: vi.fn().mockReturnThis(),
            insert: vi.fn().mockReturnThis(),
            upsert: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: vi.fn().mockReturnThis(),
        })),
    },
}));
describe("Profile Service", () => {
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
    beforeEach(() => {
        vi.clearAllMocks();
    });
    describe("getUserProfile", () => {
        it("should fetch user profile successfully", async () => {
            supabase.from().select().eq().single.mockResolvedValue({
                data: mockProfile,
                error: null,
            });
            const result = await getUserProfile(mockUserId);
            expect(result).toEqual(mockProfile);
            expect(supabase.from).toHaveBeenCalledWith("elemental_profiles");
        });
        it("should handle errors gracefully", async () => {
            supabase.from().select().eq().single.mockResolvedValue({
                data: null,
                error: new Error("Database error"),
            });
            const result = await getUserProfile(mockUserId);
            expect(result).toBeNull();
        });
    });
    describe("updateUserProfile", () => {
        it("should update profile successfully", async () => {
            supabase.from().upsert().select().single.mockResolvedValue({
                data: mockProfile,
                error: null,
            });
            const result = await updateUserProfile(mockUserId, mockProfile);
            expect(result).toEqual(mockProfile);
            expect(supabase.from).toHaveBeenCalledWith("elemental_profiles");
        });
        it("should handle update errors gracefully", async () => {
            supabase.from().upsert().select().single.mockResolvedValue({
                data: null,
                error: new Error("Update failed"),
            });
            const result = await updateUserProfile(mockUserId, mockProfile);
            expect(result).toBeNull();
        });
    });
    describe("getProfileStats", () => {
        it("should fetch profile stats successfully", async () => {
            const mockStats = {
                fire: mockProfile.fire,
                water: mockProfile.water,
                earth: mockProfile.earth,
                air: mockProfile.air,
                aether: mockProfile.aether,
            };
            supabase.from().select().eq().single.mockResolvedValue({
                data: mockStats,
                error: null,
            });
            const result = await getProfileStats(mockUserId);
            expect(result).toEqual(mockStats);
            expect(supabase.from).toHaveBeenCalledWith("elemental_profiles");
        });
        it("should handle stats fetch errors gracefully", async () => {
            supabase.from().select().eq().single.mockResolvedValue({
                data: null,
                error: new Error("Stats fetch failed"),
            });
            const result = await getProfileStats(mockUserId);
            expect(result).toBeNull();
        });
    });
});
