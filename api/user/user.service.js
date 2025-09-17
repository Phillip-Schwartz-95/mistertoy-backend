import { ObjectId } from 'mongodb'
import { dbService } from '../../services/dbService.js'

export const userService = {
  query,
  getById,
  getByUsername,
  add,
}

async function query() {
  const col = await dbService.getCollection('user')
  return col.find({}, { projection: { password: 0 } }).toArray() // hide passwords
}

async function getById(userId) {
  const col = await dbService.getCollection('user')
  const user = await col.findOne({ _id: new ObjectId(userId) })
  if (user) delete user.password
  return user
}

async function getByUsername(username) {
  const col = await dbService.getCollection('user')
  return col.findOne({ username })
}

async function add(user) {
  const col = await dbService.getCollection('user')
  await col.insertOne(user)
  return user
}
