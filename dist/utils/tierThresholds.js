// File: src/utils/tierThresholds.ts
export const TIER_THRESHOLDS = {
    explorer: {
        seeker: {
            oracle_invoked: 3,
            journal_entry: 3,
        },
    },
    seeker: {
        adept: {
            ritual_viewed: 5,
            days_active: 7,
        },
    },
    adept: {
        master: {
            oracle_invoked: 20,
            sanctum_logged: 10,
            bbs_posted: 5,
        },
    },
};
