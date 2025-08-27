import express from 'express'
import cors from 'cors'

const app = express()
app.use(cors())
app.use(express.json())

// Example route
app.get('/api/toy', (req, res) => {
  res.send([{ _id: 't101', name: 'Talking Doll' }])
})

const PORT = 3030
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
