// File: /src/utils/accessTiers.ts
// Layer: 🔐 Utility — Access classification for Sanctum + BBS

export type AccessLevel = 'public' | 'private' | 'sacred';

export function getAccessTag(level: AccessLevel) {
  switch (level) {
    case 'public':
      return '🌍 Public';
    case 'private':
      return '🔒 Private';
    case 'sacred':
      return '🕯️ Sacred';
    default:
      return '❓ Unknown';
  }
}

export const ACCESS_COLORS: Record<AccessLevel, string> = {
  public: '#3b82f6',
  private: '#6b7280',
  sacred: '#a855f7',
};
