import { Router } from 'express'
import { db } from '../db.js'

const router = Router()

function rowToPlayer(row: Record<string, unknown>) {
  return {
    id:       row.id,
    name:     row.name,
    nickname: row.nickname ?? undefined,
    age:      row.age ?? undefined,
    position: row.position,
    foot:     row.foot,
    rating:   row.rating,
    ritmo:    row.ritmo,
    pase:     row.pase,
    tiro:     row.tiro,
    fisico:   row.fisico,
    entrada:  row.entrada,
    vision:   row.vision,
    photo:    row.photo ?? undefined,
    createdAt: row.created_at,
    stats: {
      matches: row.stat_matches,
      wins:    row.stat_wins,
      losses:  row.stat_losses,
      draws:   row.stat_draws,
      goals:   row.stat_goals,
      assists: row.stat_assists,
      mvp:     row.stat_mvp,
    },
  }
}

// GET /api/players
router.get('/', async (_req, res) => {
  const result = await db.execute('SELECT * FROM players ORDER BY rating DESC')
  res.json(result.rows.map(r => rowToPlayer(r as Record<string, unknown>)))
})

// POST /api/players
router.post('/', async (req, res) => {
  const p = req.body
  await db.execute({
    sql: `INSERT INTO players
      (id,name,nickname,age,position,foot,rating,ritmo,pase,tiro,fisico,entrada,vision,photo,
       stat_matches,stat_wins,stat_losses,stat_draws,stat_goals,stat_assists,stat_mvp,created_at)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    args: [
      p.id, p.name, p.nickname ?? null, p.age ?? null,
      p.position, p.foot, p.rating,
      p.ritmo, p.pase, p.tiro, p.fisico, p.entrada, p.vision ?? 70, p.photo ?? null,
      p.stats?.matches ?? 0, p.stats?.wins ?? 0, p.stats?.losses ?? 0, p.stats?.draws ?? 0,
      p.stats?.goals ?? 0, p.stats?.assists ?? 0, p.stats?.mvp ?? 0,
      p.createdAt ?? new Date().toISOString().split('T')[0],
    ],
  })
  res.status(201).json({ ok: true })
})

// PUT /api/players/:id
router.put('/:id', async (req, res) => {
  const p = req.body
  await db.execute({
    sql: `UPDATE players SET
      name=?,nickname=?,age=?,position=?,foot=?,rating=?,
      ritmo=?,pase=?,tiro=?,fisico=?,entrada=?,vision=?,photo=?,
      stat_matches=?,stat_wins=?,stat_losses=?,stat_draws=?,stat_goals=?,stat_assists=?,stat_mvp=?
      WHERE id=?`,
    args: [
      p.name, p.nickname ?? null, p.age ?? null, p.position, p.foot, p.rating,
      p.ritmo, p.pase, p.tiro, p.fisico, p.entrada, p.vision ?? 70, p.photo ?? null,
      p.stats?.matches ?? 0, p.stats?.wins ?? 0, p.stats?.losses ?? 0, p.stats?.draws ?? 0,
      p.stats?.goals ?? 0, p.stats?.assists ?? 0, p.stats?.mvp ?? 0,
      req.params.id,
    ],
  })
  res.json({ ok: true })
})

// DELETE /api/players/:id
router.delete('/:id', async (req, res) => {
  await db.execute({ sql: 'DELETE FROM players WHERE id=?', args: [req.params.id] })
  res.json({ ok: true })
})

// POST /api/players/import — reemplaza todos los jugadores
router.post('/import', async (req, res) => {
  const players = req.body as Record<string, unknown>[]

  await db.execute('DELETE FROM players')
  for (const p of players) {
    const stats = (p.stats ?? {}) as Record<string, number>
    await db.execute({
      sql: `INSERT OR REPLACE INTO players
        (id,name,nickname,age,position,foot,rating,ritmo,pase,tiro,fisico,entrada,vision,photo,
         stat_matches,stat_wins,stat_losses,stat_draws,stat_goals,stat_assists,stat_mvp,created_at)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      args: [
        p.id, p.name, p.nickname ?? null, p.age ?? null,
        p.position, p.foot, p.rating,
        p.ritmo, p.pase, p.tiro, p.fisico, p.entrada, p.vision ?? 70, p.photo ?? null,
        stats.matches ?? 0, stats.wins ?? 0, stats.losses ?? 0, stats.draws ?? 0,
        stats.goals ?? 0, stats.assists ?? 0, stats.mvp ?? 0,
        p.createdAt ?? new Date().toISOString().split('T')[0],
      ],
    })
  }
  res.json({ ok: true, imported: players.length })
})

export default router
