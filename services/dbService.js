import { MongoClient } from 'mongodb'

const url = process.env.MONGO_URL || 'mongodb+srv://PhilS95:dbUserPassword@cluster0.uy2fx7z.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
const dbName = process.env.DB_NAME || 'mister_toy_db'

let dbConn = null

export const dbService = { getCollection }

async function getCollection(collectionName) {
  const db = await _connect()
  return db.collection(collectionName)
}

async function _connect() {
  if (dbConn) return dbConn
  const client = await MongoClient.connect(url)
  dbConn = client.db(dbName)
  return dbConn
}
