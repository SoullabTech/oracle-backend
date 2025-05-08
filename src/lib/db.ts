import { MongoClient } from 'mongodb'

const url = process.env.MONGO_URL
if (!url) {
  throw new Error('❌ MONGO_URL environment variable is not defined')
}

const client = new MongoClient(url)
export const someDbClient = client.db('your-db-name')
