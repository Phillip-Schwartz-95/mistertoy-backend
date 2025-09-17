import express from 'express'
import {
  getToys, getToyById, addToy, updateToy, removeToy,
  addToyMsg, removeToyMsg
} from './toy.controller.js'
import { requireAuth, requireAdmin } from '../../middlewares/requireAuth.middleware.js'

export const toyRoutes = express.Router()

toyRoutes.get('/', getToys)
toyRoutes.get('/:id', getToyById)

//only admin can add, update, delete toys
toyRoutes.post('/', requireAdmin, addToy)
toyRoutes.put('/:id', requireAdmin, updateToy)
toyRoutes.delete('/:id', requireAdmin, removeToy)

//only admin can add or remove messages
toyRoutes.post('/:id/msg', requireAuth, addToyMsg)
toyRoutes.delete('/:id/msg/:msgId', requireAuth, removeToyMsg)
