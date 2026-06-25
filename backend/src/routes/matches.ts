import { Router } from 'express'
import { db } from '../db.js'

const router = Router()

// GET /api/matches
router.get('/', (_req, res) => {
  const rows = db.prepare('SELECT * FROM matches ORDER BY date DESC').all() as Record<string, unknown>[]
  const matches = rows.map(r => ({
    id:      r.id,
    date:    r.date,
    teamA:   JSON.parse(r.team_a as string),
    teamB:   JSON.parse(r.team_b as string),
    result:  r.result ? JSON.parse(r.result as string) : undefined,
    winner:  r.winner ?? undefined,
    mvpId:   r.mvp_id ?? undefined,
  }))
  res.json(matches)
})

// POST /api/matches
router.post('/', (req, res) => {
  const m = req.body
  db.prepare(`
    INSERT INTO matches (id, date, team_a, team_b, result, winner, mvp_id)
    VALUES (@id, @date, @team_a, @team_b, @result, @winner, @mvp_id)
  `).run({
    id:     m.id,
    date:   m.date,
    team_a: JSON.stringify(m.teamA),
    team_b: JSON.stringify(m.teamB),
    result: m.result ? JSON.stringify(m.result) : null,
    winner: m.winner ?? null,
    mvp_id: m.mvpId ?? null,
  })
  res.status(201).json({ ok: true })
})

export default router
