// src/core/db.ts
import { MongoClient, Db } from 'mongodb'

const uri = process.env.MONGO_URL
if (!uri) {
  throw new Error('Missing env var MONGO_URL')
}

let client: MongoClient
let db: Db

declare global {
  // allow global caching across HMR in development
  var _mongoClientPromise: Promise<MongoClient>
}

if (!global._mongoClientPromise) {
  client = new MongoClient(uri)
  global._mongoClientPromise = client.connect()
}

export async function getDb(): Promise<Db> {
  const client = await global._mongoClientPromise
  if (!db) {
    // change 'myDatabase' to your DB name or parse it from URI
    db = client.db(process.env.MONGO_DB_NAME || 'myDatabase')
  }
  return db
}
