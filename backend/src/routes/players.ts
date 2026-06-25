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
router.get('/', (_req, res) => {
  const rows = db.prepare('SELECT * FROM players ORDER BY rating DESC').all()
  res.json(rows.map(r => rowToPlayer(r as Record<string, unknown>)))
})

// POST /api/players
router.post('/', (req, res) => {
  const p = req.body
  db.prepare(`
    INSERT INTO players
      (id, name, nickname, age, position, foot, rating, ritmo, pase, tiro, fisico, entrada, vision, photo,
       stat_matches, stat_wins, stat_losses, stat_draws, stat_goals, stat_assists, stat_mvp, created_at)
    VALUES
      (@id, @name, @nickname, @age, @position, @foot, @rating, @ritmo, @pase, @tiro, @fisico, @entrada, @vision, @photo,
       @stat_matches, @stat_wins, @stat_losses, @stat_draws, @stat_goals, @stat_assists, @stat_mvp, @created_at)
  `).run({
    id: p.id, name: p.name, nickname: p.nickname ?? null, age: p.age ?? null,
    position: p.position, foot: p.foot, rating: p.rating,
    ritmo: p.ritmo, pase: p.pase, tiro: p.tiro, fisico: p.fisico, entrada: p.entrada, vision: p.vision ?? 70,
    photo: p.photo ?? null,
    stat_matches: p.stats?.matches ?? 0, stat_wins: p.stats?.wins ?? 0,
    stat_losses: p.stats?.losses ?? 0, stat_draws: p.stats?.draws ?? 0,
    stat_goals: p.stats?.goals ?? 0, stat_assists: p.stats?.assists ?? 0,
    stat_mvp: p.stats?.mvp ?? 0,
    created_at: p.createdAt ?? new Date().toISOString().split('T')[0],
  })
  res.status(201).json({ ok: true })
})

// PUT /api/players/:id
router.put('/:id', (req, res) => {
  const p = req.body
  const u = req.params.id
  db.prepare(`
    UPDATE players SET
      name=@name, nickname=@nickname, age=@age, position=@position, foot=@foot, rating=@rating,
      ritmo=@ritmo, pase=@pase, tiro=@tiro, fisico=@fisico, entrada=@entrada, vision=@vision, photo=@photo,
      stat_matches=@stat_matches, stat_wins=@stat_wins, stat_losses=@stat_losses, stat_draws=@stat_draws,
      stat_goals=@stat_goals, stat_assists=@stat_assists, stat_mvp=@stat_mvp
    WHERE id=@id
  `).run({
    id: u, name: p.name, nickname: p.nickname ?? null, age: p.age ?? null,
    position: p.position, foot: p.foot, rating: p.rating,
    ritmo: p.ritmo, pase: p.pase, tiro: p.tiro, fisico: p.fisico, entrada: p.entrada, vision: p.vision ?? 70,
    photo: p.photo ?? null,
    stat_matches: p.stats?.matches ?? 0, stat_wins: p.stats?.wins ?? 0,
    stat_losses: p.stats?.losses ?? 0, stat_draws: p.stats?.draws ?? 0,
    stat_goals: p.stats?.goals ?? 0, stat_assists: p.stats?.assists ?? 0,
    stat_mvp: p.stats?.mvp ?? 0,
  })
  res.json({ ok: true })
})

// DELETE /api/players/:id
router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM players WHERE id=?').run(req.params.id)
  res.json({ ok: true })
})

// POST /api/players/import  — reemplaza todos los jugadores
router.post('/import', (req, res) => {
  const players = req.body as unknown[]
  const insert = db.prepare(`
    INSERT OR REPLACE INTO players
      (id, name, nickname, age, position, foot, rating, ritmo, pase, tiro, fisico, entrada, vision, photo,
       stat_matches, stat_wins, stat_losses, stat_draws, stat_goals, stat_assists, stat_mvp, created_at)
    VALUES
      (@id, @name, @nickname, @age, @position, @foot, @rating, @ritmo, @pase, @tiro, @fisico, @entrada, @vision, @photo,
       @stat_matches, @stat_wins, @stat_losses, @stat_draws, @stat_goals, @stat_assists, @stat_mvp, @created_at)
  `)
  const bulk = db.transaction((list: unknown[]) => {
    db.prepare('DELETE FROM players').run()
    for (const p of list as Record<string, unknown>[]) {
      const stats = (p.stats ?? {}) as Record<string, number>
      insert.run({
        id: p.id, name: p.name, nickname: p.nickname ?? null, age: p.age ?? null,
        position: p.position, foot: p.foot, rating: p.rating,
        ritmo: p.ritmo, pase: p.pase, tiro: p.tiro, fisico: p.fisico, entrada: p.entrada, vision: p.vision ?? 70,
        photo: p.photo ?? null,
        stat_matches: stats.matches ?? 0, stat_wins: stats.wins ?? 0,
        stat_losses: stats.losses ?? 0, stat_draws: stats.draws ?? 0,
        stat_goals: stats.goals ?? 0, stat_assists: stats.assists ?? 0,
        stat_mvp: stats.mvp ?? 0,
        created_at: p.createdAt ?? new Date().toISOString().split('T')[0],
      })
    }
  })
  bulk(players)
  res.json({ ok: true, imported: players.length })
})

export default router
