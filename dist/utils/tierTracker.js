// File: /src/utils/tierTracker.ts
// Layer: 🧠 Logic — Tracks engagement + upgrades user ritual tier
import { db } from '../lib/db';
import { TIER_THRESHOLDS } from './tierThresholds';
export async function trackEvent(userId, type) {
    await db.collection('event_logs').insertOne({ userId, type, createdAt: new Date() });
}
export async function evaluateUserTier(userId) {
    const logs = await db.collection('event_logs').find({ userId }).toArray();
    const counts = logs.reduce((acc, log) => {
        acc[log.type] = (acc[log.type] || 0) + 1;
        return acc;
    }, {});
    const current = (await db.collection('users').findOne({ _id: userId }))?.tier || 'explorer';
    const nextTier = getNextTier(current, counts);
    if (nextTier && nextTier !== current) {
        await db.collection('users').updateOne({ _id: userId }, { $set: { tier: nextTier } });
        return nextTier;
    }
    return current;
}
function getNextTier(current, counts) {
    const rules = TIER_THRESHOLDS[current];
    if (!rules)
        return null;
    for (const [next, conditions] of Object.entries(rules)) {
        if (Object.entries(conditions).every(([k, v]) => (counts[k] || 0) >= v)) {
            return next;
        }
    }
    return null;
}
