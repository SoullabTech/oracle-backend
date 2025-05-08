// ✅ File: src/lib/db.ts
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGO_URI!);
await client.connect();

export const db = client.db('oracle'); // You can name your database here
