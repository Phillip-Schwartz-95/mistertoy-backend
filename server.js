import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { createServer } from 'http'
import { Server } from 'socket.io'

import { toyRoutes } from './api/toy/toy.routes.js'
import { authRoutes } from './api/auth/auth.routes.js'
import { reviewRoutes } from './api/review/review.routes.js'
import { userRoutes } from './api/user/user.routes.js'

console.log('Render env check → NODE_ENV:', process.env.NODE_ENV)
console.log('Render env check → MONGODB_URI:', process.env.MONGODB_URI)
console.log('Render env check → DB_NAME:', process.env.DB_NAME)

const app = express()
const server = createServer(app) // HTTP server
const io = new Server(server, {
  cors: {
    origin: [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
      'https://phillip-schwartz-95.github.io',
      'https://mistertoy-frontend-fjbo.onrender.com'
    ],
    credentials: true
  }
})

app.use(cookieParser())
app.use(express.json())
app.use(cors({
  origin: (origin, cb) =>
    (!origin || [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
      'https://phillip-schwartz-95.github.io',
      'https://mistertoy-frontend-fjbo.onrender.com'
    ].includes(origin))
      ? cb(null, true)
      : cb(new Error('Not allowed by CORS')),
  credentials: true
}))

// Routes
app.use('/api/toy', toyRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/review', reviewRoutes)
app.use('/api/user', userRoutes)

// SOCKET.IO LOGIC
io.on('connection', socket => {
  console.log('New socket connected', socket.id)

  // Join a toy-specific chat room
  socket.on('join-topic', topic => {
    if (socket.topic) socket.leave(socket.topic)
    socket.join(topic)
    socket.topic = topic
    console.log(`Socket ${socket.id} joined topic ${topic}`)
  })

  // Broadcast chat messages
  socket.on('chat-msg', msg => {
    console.log('Message in', socket.topic, ':', msg)
    io.to(socket.topic).emit('chat-msg', msg)
  })

  // Typing indicator
  socket.on('typing', username => {
    socket.to(socket.topic).emit('user-typing', username)
  })

  socket.on('disconnect', () => {
    console.log('Socket disconnected', socket.id)
  })
})

const PORT = process.env.PORT || 3030
server.listen(PORT, () => console.log(`Toy backend running on port ${PORT}`))
