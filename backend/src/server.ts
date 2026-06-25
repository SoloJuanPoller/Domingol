import express from 'express'
import cors from 'cors'
import { initDb } from './db.js'
import playersRouter from './routes/players.js'
import matchesRouter from './routes/matches.js'

const app = express()
const PORT = parseInt(process.env.PORT ?? '3000')

app.use(cors())
app.use(express.json({ limit: '20mb' }))

app.use('/api/players', playersRouter)
app.use('/api/matches', matchesRouter)
app.get('/api/health', (_req, res) => res.json({ ok: true }))

initDb().then(() => {
  app.listen(PORT, () => console.log(`Domingol API corriendo en puerto ${PORT}`))
})
