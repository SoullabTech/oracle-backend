// src/services/profileService.ts

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  bio?: string;
  avatarUrl?: string;
}

const mockDatabase: Record<string, UserProfile> = {
  'user-123': {
    id: 'user-123',
    name: 'Kelly Nezat',
    email: 'kelly@example.com',
    bio: 'Author of Elemental Alchemy',
    avatarUrl: 'https://example.com/avatar.png',
  },
};

export const profileService = {
  getProfile: (userId: string): UserProfile | null => {
    return mockDatabase[userId] || null;
  },

  updateProfile: (userId: string, updates: Partial<UserProfile>): UserProfile | null => {
    const existing = mockDatabase[userId];
    if (!existing) return null;

    const updated = { ...existing, ...updates };
    mockDatabase[userId] = updated;
    return updated;
  },
};
