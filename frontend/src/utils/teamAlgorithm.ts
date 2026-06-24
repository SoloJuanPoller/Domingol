import type { Player, GeneratedTeams, Team } from '@/types'

const ELITE_THRESHOLD = 90

function buildTeam(players: Player[]): Team {
  const totalRating = players.reduce((sum, p) => sum + p.rating, 0)
  return {
    players,
    totalRating,
    avgRating: players.length > 0 ? Math.round((totalRating / players.length) * 10) / 10 : 0,
  }
}

function combinations(arr: Player[], k: number): Player[][] {
  if (k === 0) return [[]]
  if (k > arr.length) return []
  if (k === arr.length) return [arr]

  const [first, ...rest] = arr
  const withFirst = combinations(rest, k - 1).map(c => [first, ...c])
  const withoutFirst = combinations(rest, k)
  return [...withFirst, ...withoutFirst]
}

export function generateOptimalTeams(players: Player[]): GeneratedTeams {
  if (players.length < 2) {
    throw new Error('Se necesitan al menos 2 jugadores.')
  }

  const n = players.length
  const halfA = Math.floor(n / 2)
  const totalRating = players.reduce((sum, p) => sum + p.rating, 0)
  const totalElites = players.filter(p => p.rating >= ELITE_THRESHOLD).length

  // Only enforce the split when there are exactly 2 elites: each team must get one.
  // With 3+ elites it's unavoidable that one team gets 2, so no constraint is applied.
  const enforceEliteSplit = totalElites === 2

  let bestDiff = Infinity
  let bestTeamAPlayers: Player[] = []
  let bestTeamBPlayers: Player[] = []

  // Tracks the best valid combo (elites split 1/1) separately.
  let bestValidDiff = Infinity
  let bestValidA: Player[] | null = null
  let bestValidB: Player[] | null = null

  for (const teamAPlayers of combinations(players, halfA)) {
    const teamAIds = new Set(teamAPlayers.map(p => p.id))
    const teamBPlayers = players.filter(p => !teamAIds.has(p.id))

    const sumA = teamAPlayers.reduce((sum, p) => sum + p.rating, 0)
    const sumB = teamBPlayers.reduce((sum, p) => sum + p.rating, 0)
    const diff = Math.abs(sumA - sumB)

    if (diff < bestDiff) {
      bestDiff = diff
      bestTeamAPlayers = teamAPlayers
      bestTeamBPlayers = teamBPlayers
    }

    if (enforceEliteSplit) {
      const elitesInA = teamAPlayers.filter(p => p.rating >= ELITE_THRESHOLD).length
      // elitesInA === 1 implies elitesInB === 1 when totalElites === 2
      if (elitesInA === 1 && diff < bestValidDiff) {
        bestValidDiff = diff
        bestValidA = teamAPlayers
        bestValidB = teamBPlayers
      }
    }

    if (diff === 0 && (!enforceEliteSplit || bestValidA)) break
  }

  const finalA = enforceEliteSplit && bestValidA ? bestValidA : bestTeamAPlayers
  const finalB = enforceEliteSplit && bestValidB ? bestValidB : bestTeamBPlayers
  const finalDiff = enforceEliteSplit && bestValidA ? bestValidDiff : bestDiff

  const balance = totalRating > 0
    ? Math.round((1 - finalDiff / totalRating) * 10000) / 100
    : 100

  return {
    teamA: buildTeam(finalA),
    teamB: buildTeam(finalB),
    balance,
    diff: finalDiff,
  }
}

export function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}
