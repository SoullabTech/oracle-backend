import 'dotenv/config';
import { logToSanctum } from '@/utils/sanctumLogger';
import { MongoClient } from 'mongodb';
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);
async function test() {
    // 1. Write to the sanctum log
    await logToSanctum({
        input: 'What is the next step on my journey?',
        insight: 'You are in a transition between Water and Air.',
        ritual: 'Write a letter to your future self.',
        nextPhase: 'Air 1',
        symbol: 'feather',
        element: 'Water',
        persona: 'Oracle',
        source: 'manualTest',
        agent: 'OracleAgent',
    });
    console.log('✅ logToSanctum write complete');
    // 2. Read the latest document from sanctum_logs
    await client.connect();
    const db = client.db('oracle'); // or the DB name you used
    const logs = db.collection('sanctum_logs');
    const latest = await logs.find().sort({ createdAt: -1 }).limit(1).toArray();
    console.log('🧾 Latest log from sanctum_logs:', latest[0]);
    await client.close();
}
test().catch(console.error);
