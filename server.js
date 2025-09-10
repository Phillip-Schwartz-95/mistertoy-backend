import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import toyRoutes from './api/toy.routes.js'

const app = express()

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'https://phillip-schwartz-95.github.io'
]

app.use(cookieParser())
app.use(express.json())
app.use(cors({
  origin: (origin, cb) => (!origin || allowedOrigins.includes(origin)) ? cb(null, true) : cb(new Error('Not allowed by CORS')),
  credentials: true
}))

// Mount Toy API
app.use('/api/toy', toyRoutes)

const PORT = process.env.PORT || 3030
app.listen(PORT, () => console.log(`Toy backend running on port ${PORT}`))
