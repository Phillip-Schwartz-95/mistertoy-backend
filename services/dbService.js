import { MongoClient } from 'mongodb'
import { config } from '../config/index.js'

let dbConn = null

export const dbService = { getCollection }

async function getCollection(collectionName) {
  const db = await _connect()
  return db.collection(collectionName)
}

async function _connect() {
  if (dbConn) return dbConn
  const client = await MongoClient.connect(config.dbURL)
  dbConn = client.db(config.dbName)
  console.log('Connected to DB:', config.dbName)
  return dbConn
}
