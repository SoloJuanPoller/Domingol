import type { Player, GeneratedTeams, Team } from '@/types'

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

  let bestDiff = Infinity
  let bestTeamAPlayers: Player[] = []
  let bestTeamBPlayers: Player[] = []

  const allCombos = combinations(players, halfA)

  for (const teamAPlayers of allCombos) {
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

    if (diff === 0) break
  }

  const balance = totalRating > 0
    ? Math.round((1 - bestDiff / totalRating) * 10000) / 100
    : 100

  return {
    teamA: buildTeam(bestTeamAPlayers),
    teamB: buildTeam(bestTeamBPlayers),
    balance,
    diff: bestDiff,
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
