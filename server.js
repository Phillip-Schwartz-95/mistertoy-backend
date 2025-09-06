import express from 'express'
import cors from 'cors'
import { toyService } from './services/toyService.js'

const app = express()

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'https://phillip-schwartz-95.github.io'
]

app.use(express.json())

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (like Postman)
    if (!origin) return callback(null, true)
    if (allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
}))

// --- Toys API ---
app.get('/api/toy', (req, res) => {
  const filterBy = {
    name: req.query.name || '',
    inStock: req.query.inStock === 'true' ? true : req.query.inStock === 'false' ? false : undefined
  }
  toyService.query(filterBy)
    .then(toys => res.send(toys))
    .catch(() => res.status(400).send('Cannot get toys'))
})

app.get('/api/toy/:toyId', (req, res) => {
  toyService.getById(req.params.toyId)
    .then(toy => res.send(toy))
    .catch(() => res.status(400).send('Cannot get toy'))
})

app.post('/api/toy', (req, res) => {
  toyService.save(req.body)
    .then(toy => res.send(toy))
    .catch(() => res.status(400).send('Cannot save toy'))
})

app.put('/api/toy/:toyId', (req, res) => {
  const toy = { ...req.body, _id: req.params.toyId }
  toyService.save(toy)
    .then(updated => res.send(updated))
    .catch(() => res.status(400).send('Cannot update toy'))
})

app.delete('/api/toy/:toyId', (req, res) => {
  toyService.remove(req.params.toyId)
    .then(() => res.send('Removed'))
    .catch(() => res.status(400).send('Cannot remove toy'))
})

// use Render’s assigned port
const PORT = process.env.PORT || 3030
app.listen(PORT, () => console.log(`Toy backend running on port ${PORT}`))
