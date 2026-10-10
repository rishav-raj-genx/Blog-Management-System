import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import { connectDatabase } from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import postRoutes from './routes/postRoutes.js'

const app = express()

app.use(cors())
app.use(express.json())
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }))
app.use('/api/auth', authRoutes)
app.use('/api/posts', postRoutes)

app.use((error, _req, res, _next) => {
  if (error.name === 'ValidationError') {
    return res.status(400).json({ message: error.message })
  }
  if (error.code === 11000) {
    return res.status(409).json({ message: 'A record with that value already exists' })
  }
  console.error(error)
  return res.status(500).json({ message: 'Internal server error' })
})

const port = Number(process.env.PORT) || 5000

if (process.env.NODE_ENV !== 'test') {
  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is not configured')
    process.exitCode = 1
  } else {
    connectDatabase()
      .then(() => {
        app.listen(port, () => console.log(`API listening on port ${port}`))
      })
      .catch((error) => {
        console.error(`Database connection failed: ${error.message}`)
        process.exitCode = 1
      })
  }
}

export default app
