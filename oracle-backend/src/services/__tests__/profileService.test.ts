import { getUserProfile, updateUserProfile, getProfileStats } from '../profileService';
import { supabase } from '../../lib/supabase';
import type { ElementalProfile } from '../../types/survey';

// Mock Supabase client
jest.mock('../../lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      upsert: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockReturnThis(),
    })),
  },
}));

describe('Profile Service', () => {
  const mockUserId = 'test-user-123';
  const mockProfile: ElementalProfile = {
    fire: 80,
    water: 60,
    earth: 70,
    air: 50,
    aether: 40,
    crystal_focus: {
      type: 'spiritual',
      challenges: 'Finding inner peace',
      aspirations: 'Deeper connection with self',
    },
    user_id: mockUserId,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserProfile', () => {
    it('should fetch user profile successfully', async () => {
      const mockSupabaseResponse = {
        data: mockProfile,
        error: null,
      };

      (supabase.from().select().eq().single as jest.Mock).mockResolvedValue(mockSupabaseResponse);

      const result = await getUserProfile(mockUserId);
      expect(result).toEqual(mockProfile);
      expect(supabase.from).toHaveBeenCalledWith('elemental_profiles');
    });

    it('should handle errors gracefully', async () => {
      const mockError = new Error('Database error');
      const mockSupabaseResponse = {
        data: null,
        error: mockError,
      };

      (supabase.from().select().eq().single as jest.Mock).mockResolvedValue(mockSupabaseResponse);

      const result = await getUserProfile(mockUserId);
      expect(result).toBeNull();
    });
  });

  describe('updateUserProfile', () => {
    it('should update profile successfully', async () => {
      const mockSupabaseResponse = {
        data: mockProfile,
        error: null,
      };

      (supabase.from().upsert().select().single as jest.Mock).mockResolvedValue(mockSupabaseResponse);

      const result = await updateUserProfile(mockUserId, mockProfile);
      expect(result).toEqual(mockProfile);
      expect(supabase.from).toHaveBeenCalledWith('elemental_profiles');
    });

    it('should handle update errors gracefully', async () => {
      const mockError = new Error('Update failed');
      const mockSupabaseResponse = {
        data: null,
        error: mockError,
      };

      (supabase.from().upsert().select().single as jest.Mock).mockResolvedValue(mockSupabaseResponse);

      const result = await updateUserProfile(mockUserId, mockProfile);
      expect(result).toBeNull();
    });
  });

  describe('getProfileStats', () => {
    it('should fetch profile stats successfully', async () => {
      const mockStats = {
        fire: mockProfile.fire,
        water: mockProfile.water,
        earth: mockProfile.earth,
        air: mockProfile.air,
        aether: mockProfile.aether,
      };

      const mockSupabaseResponse = {
        data: mockStats,
        error: null,
      };

      (supabase.from().select().eq().single as jest.Mock).mockResolvedValue(mockSupabaseResponse);

      const result = await getProfileStats(mockUserId);
      expect(result).toEqual(mockStats);
      expect(supabase.from).toHaveBeenCalledWith('elemental_profiles');
    });

    it('should handle stats fetch errors gracefully', async () => {
      const mockError = new Error('Stats fetch failed');
      const mockSupabaseResponse = {
        data: null,
        error: mockError,
      };

      (supabase.from().select().eq().single as jest.Mock).mockResolvedValue(mockSupabaseResponse);

      const result = await getProfileStats(mockUserId);
      expect(result).toBeNull();
    });
  });
});