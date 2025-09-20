import express from 'express'
import { getReviews, addReview, deleteReview } from './review.controller.js'
import { requireAuth } from '../../middlewares/requireAuth.middleware.js'

export const reviewRoutes = express.Router()

reviewRoutes.get('/', getReviews)         // public
reviewRoutes.post('/', requireAuth, addReview)  // logged in
reviewRoutes.delete('/:id', requireAuth, deleteReview) // owner or admin