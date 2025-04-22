import { describe, it, expect, vi, beforeEach } from "vitest";
import * as profileService from "./profileService"; // Correct import from your profileService
import { supabase } from "../lib/supabase"; // Correct import from supabaseClient
// Mocking Supabase client
vi.mock("../lib/supabase", () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn(),
      upsert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(),
        })),
      })),
    })),
  },
}));
// Mock Data
const mockUserId = "user123";
const mockProfile = {
  user_id: mockUserId,
  fire: 80,
  water: 70,
  earth: 60,
  air: 90,
  aether: 75,
  crystal_focus: {
    type: "career",
    challenges: "Balancing creative work and structure",
    aspirations: "Integrate success with soulful service",
  },
  updated_at: new Date().toISOString(),
};
describe("profileService", () => {
  // Reset all mocks before each test
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it("should get user profile successfully", async () => {
    supabase.from().single.mockResolvedValue({ data: mockProfile });
    const result = await profileService.getUserProfile(mockUserId);
    expect(result).toMatchObject(mockProfile);
  });
  it("should return null if getUserProfile fails", async () => {
    supabase
      .from()
      .single.mockResolvedValue({ error: { message: "Not found" } });
    const result = await profileService.getUserProfile(mockUserId);
    expect(result).toBeNull();
  });
  it("should update user profile successfully", async () => {
    const upsertMock = supabase.from().upsert().select().single;
    upsertMock.mockResolvedValue({ data: mockProfile });
    const result = await profileService.updateUserProfile(
      mockUserId,
      mockProfile,
    );
    expect(result).toMatchObject(mockProfile);
  });
  it("should return null if updateUserProfile fails", async () => {
    const upsertMock = supabase.from().upsert().select().single;
    upsertMock.mockResolvedValue({ error: { message: "Insert failed" } });
    const result = await profileService.updateUserProfile(
      mockUserId,
      mockProfile,
    );
    expect(result).toBeNull();
  });
  it("should return only elemental scores from getProfileStats", async () => {
    const mockStats = {
      fire: 80,
      water: 70,
      earth: 60,
      air: 90,
      aether: 75,
    };
    supabase.from().select().eq().single.mockResolvedValue({ data: mockStats });
    const result = await profileService.getProfileStats(mockUserId);
    expect(result).toMatchObject(mockStats);
  });
});
