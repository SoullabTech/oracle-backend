// File: /src/utils/accessTiers.ts
// Layer: 🔐 Utility — Access classification for Sanctum + BBS
export function getAccessTag(level) {
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
export const ACCESS_COLORS = {
    public: '#3b82f6',
    private: '#6b7280',
    sacred: '#a855f7',
};
