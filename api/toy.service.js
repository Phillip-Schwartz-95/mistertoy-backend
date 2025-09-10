// api/toy/toy.service.js
import { ObjectId } from 'mongodb'
import { dbService } from '../services/dbService.js'
import { utilService } from '../services/utilService.js'

export const toyService = {
  query,
  getById,
  add,
  update,
  remove,
  addToyMsg,
  removeToyMsg,
}

async function query(filterBy = {}) {
  const criteria = _buildCriteria(filterBy)
  const col = await dbService.getCollection('toy')
  return col.find(criteria).toArray()
}

async function getById(toyId) {
  const col = await dbService.getCollection('toy')
  return col.findOne({ _id: new ObjectId(toyId) })
}

async function add(toy) {
  const col = await dbService.getCollection('toy')
  const toyToAdd = {
    name: toy.name,
    price: +toy.price || 0,
    inStock: toy.inStock ?? true,
    labels: Array.isArray(toy.labels) ? toy.labels : [],
    msgs: [],
    createdAt: Date.now(),
  }
  const { insertedId } = await col.insertOne(toyToAdd)
  toyToAdd._id = insertedId
  return toyToAdd
}

async function update(toy) {
  const col = await dbService.getCollection('toy')
  const id = new ObjectId(toy._id)
  const toSet = {
    name: toy.name,
    price: +toy.price || 0,
    inStock: !!toy.inStock,
    labels: Array.isArray(toy.labels) ? toy.labels : [],
  }
  await col.updateOne({ _id: id }, { $set: toSet })
  return { ...toy, ...toSet, _id: id }
}

async function remove(toyId) {
  const col = await dbService.getCollection('toy')
  const { deletedCount } = await col.deleteOne({ _id: new ObjectId(toyId) })
  return deletedCount
}

// messages
async function addToyMsg(toyId, msg) {
  const col = await dbService.getCollection('toy')
  const fullMsg = { ...msg, id: utilService.makeId(), createdAt: Date.now() }
  await col.updateOne(
    { _id: new ObjectId(toyId) },
    { $push: { msgs: fullMsg } }
  )
  return fullMsg
}

async function removeToyMsg(toyId, msgId) {
  const col = await dbService.getCollection('toy')
  await col.updateOne(
    { _id: new ObjectId(toyId) },
    { $pull: { msgs: { id: msgId } } }
  )
  return msgId
}

function _buildCriteria(filterBy) {
  const c = {}
  if (filterBy.name) c.name = { $regex: filterBy.name, $options: 'i' }
  if (filterBy.inStock !== undefined) c.inStock = filterBy.inStock
  if (Array.isArray(filterBy.labels) && filterBy.labels.length) c.labels = { $all: filterBy.labels }
  if (filterBy.minPrice !== undefined) c.price = { ...(c.price || {}), $gte: +filterBy.minPrice }
  return c
}
