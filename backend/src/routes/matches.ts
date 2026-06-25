import { Router } from 'express'
import { db } from '../db.js'

const router = Router()

// GET /api/matches
router.get('/', async (_req, res) => {
  const result = await db.execute('SELECT * FROM matches ORDER BY date DESC')
  const matches = result.rows.map(r => ({
    id:     r.id,
    date:   r.date,
    teamA:  JSON.parse(r.team_a as string),
    teamB:  JSON.parse(r.team_b as string),
    result: r.result ? JSON.parse(r.result as string) : undefined,
    winner: r.winner ?? undefined,
    mvpId:  r.mvp_id ?? undefined,
  }))
  res.json(matches)
})

// POST /api/matches
router.post('/', async (req, res) => {
  const m = req.body
  await db.execute({
    sql: 'INSERT INTO matches (id,date,team_a,team_b,result,winner,mvp_id) VALUES (?,?,?,?,?,?,?)',
    args: [
      m.id, m.date,
      JSON.stringify(m.teamA), JSON.stringify(m.teamB),
      m.result ? JSON.stringify(m.result) : null,
      m.winner ?? null, m.mvpId ?? null,
    ],
  })
  res.status(201).json({ ok: true })
})

export default router
