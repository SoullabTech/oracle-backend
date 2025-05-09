// File: src/utils/bbsPoster.ts
import { db } from '../lib/db.ts';
// ✅ Only this one should exist
export async function postToBBS({ topic, summary, tag, phase, ritual }) {
    try {
        const post = {
            topic,
            summary,
            tag,
            phase,
            ritual,
            postedAt: new Date().toISOString(),
            author: 'OracleAgent',
            channel: 'symbolic-insights'
        };
        await db.collection('bbs_posts').insertOne(post);
        console.log('[📡 BBS] New broadcast posted:', topic);
    }
    catch (err) {
        console.error('[BBS Broadcast Error]', err);
    }
}
