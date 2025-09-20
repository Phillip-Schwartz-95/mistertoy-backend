import { reviewService } from './review.service.js'

export async function getReviews(req, res) {
  try {
    const reviews = await reviewService.query(req.query)
    res.json(reviews)
  } catch (err) {
    console.error('Failed to get reviews', err)
    res.status(500).send({ err: 'Failed to get reviews' })
  }
}

export async function addReview(req, res) {
  try {
    const { loggedinUser } = req
    const review = await reviewService.add({
      ...req.body,
      userId: loggedinUser._id
    })
    res.json(review)
  } catch (err) {
    console.error('Failed to add review', err)
    res.status(500).send({ err: 'Failed to add review' })
  }
}

export async function deleteReview(req, res) {
  try {
    const { loggedinUser } = req
    const { id } = req.params
    const deletedCount = await reviewService.remove(id, loggedinUser)
    if (deletedCount === 1) res.send({ msg: 'Deleted successfully' })
    else res.status(403).send({ err: 'Not authorized to delete review' })
  } catch (err) {
    console.error('Failed to delete review', err)
    res.status(500).send({ err: 'Failed to delete review' })
  }
}
