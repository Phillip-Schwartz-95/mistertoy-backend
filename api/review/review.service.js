import { ObjectId } from 'mongodb'
import { dbService } from '../../services/dbService.js'

export const reviewService = {
  query,
  add,
  remove,
}

async function query(filterBy = {}) {
  try {
    const criteria = _buildCriteria(filterBy)
    const collection = await dbService.getCollection('review')

    const reviews = await collection.aggregate([
      { $match: criteria },
      {
        $lookup: {
          from: 'user',
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $lookup: {
          from: 'toys',
          localField: 'toyId',
          foreignField: '_id',
          as: 'toy'
        }
      },
      { $unwind: '$toy' },
      {
        $project: {
          txt: 1,
          'user._id': 1, 'user.fullname': 1,
          'toy._id': 1, 'toy.name': 1, 'toy.price': 1
        }
      }
    ]).toArray()

    return reviews
  } catch (err) {
    console.error('cannot get reviews', err)
    throw err
  }
}

async function add(review) {
  try {
    const reviewToAdd = {
      userId: new ObjectId(review.userId),
      toyId: new ObjectId(review.toyId),
      txt: review.txt
    }
    const collection = await dbService.getCollection('review')
    const { insertedId } = await collection.insertOne(reviewToAdd)

    const [savedReview] = await collection.aggregate([
      { $match: { _id: insertedId } },
      {
        $lookup: {
          from: 'user',
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $lookup: {
          from: 'toys',
          localField: 'toyId',
          foreignField: '_id',
          as: 'toy'
        }
      },
      { $unwind: '$toy' },
      {
        $project: {
          txt: 1,
          'user._id': 1, 'user.fullname': 1,
          'toy._id': 1, 'toy.name': 1, 'toy.price': 1
        }
      }
    ]).toArray()

    return savedReview
  } catch (err) {
    console.error('cannot add review', err)
    throw err
  }
}

async function remove(reviewId, loggedinUser) {
  try {
    const collection = await dbService.getCollection('review')
    const criteria = { _id: new ObjectId(reviewId) }

    // Non-admins can only delete their own reviews
    if (!loggedinUser.isAdmin) {
      criteria.userId = new ObjectId(loggedinUser._id)
    }

    const { deletedCount } = await collection.deleteOne(criteria)
    return deletedCount
  } catch (err) {
    console.error(`cannot remove review ${reviewId}`, err)
    throw err
  }
}

function _buildCriteria(filterBy) {
  const criteria = {}
  if (filterBy.toyId) criteria.toyId = new ObjectId(filterBy.toyId)
  if (filterBy.userId) criteria.userId = new ObjectId(filterBy.userId)
  return criteria
}
