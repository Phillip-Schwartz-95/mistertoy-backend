import express from 'express'
import {
  getToys, getToyById, addToy, updateToy, removeToy,
  addToyMsg, removeToyMsg
} from './toy.controller.js'

// Optional (if you have them already):
// import { requireAuth, requireAdmin } from '../../middlewares/requireAuth.middleware.js'

export const toyRoutes = express.Router()

toyRoutes.get('/', getToys)
toyRoutes.get('/:id', getToyById)

// Admin-only (uncomment when you have auth):
// toyRoutes.post('/', requireAuth, requireAdmin, addToy)
// toyRoutes.put('/:id', requireAuth, requireAdmin, updateToy)
// toyRoutes.delete('/:id', requireAuth, requireAdmin, removeToy)
toyRoutes.post('/', addToy)
toyRoutes.put('/:id', updateToy)
toyRoutes.delete('/:id', removeToy)

// Logged-in users add/remove msgs (use requireAuth when ready)
toyRoutes.post('/:id/msg', /* requireAuth, */ addToyMsg)
toyRoutes.delete('/:id/msg/:msgId', /* requireAuth, */ removeToyMsg)

export default toyRoutes
