import express from 'express'
import { getUsers, getUserById } from './user.controller.js'

export const userRoutes = express.Router()

// GET /api/user
userRoutes.get('/', getUsers)

// GET /api/user/:id
userRoutes.get('/:id', getUserById)