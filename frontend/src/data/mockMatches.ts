import type { Match } from '@/types'
import { mockPlayers } from './mockPlayers'

export const mockMatches: Match[] = [
  {
    id: 'm1',
    date: '2025-06-22',
    teamA: {
      players: mockPlayers.slice(0, 5),
      totalRating: mockPlayers.slice(0, 5).reduce((s, p) => s + p.rating, 0),
      avgRating: 85.6,
      score: 4,
    },
    teamB: {
      players: mockPlayers.slice(5, 10),
      totalRating: mockPlayers.slice(5, 10).reduce((s, p) => s + p.rating, 0),
      avgRating: 83.2,
      score: 3,
    },
    result: { scoreA: 4, scoreB: 3 },
    winner: 'A',
    mvpId: '1',
  },
  {
    id: 'm2',
    date: '2025-06-15',
    teamA: {
      players: mockPlayers.slice(2, 7),
      totalRating: mockPlayers.slice(2, 7).reduce((s, p) => s + p.rating, 0),
      avgRating: 81.0,
      score: 2,
    },
    teamB: {
      players: mockPlayers.slice(7, 12),
      totalRating: mockPlayers.slice(7, 12).reduce((s, p) => s + p.rating, 0),
      avgRating: 74.2,
      score: 2,
    },
    result: { scoreA: 2, scoreB: 2 },
    winner: 'draw',
    mvpId: '5',
  },
  {
    id: 'm3',
    date: '2025-06-08',
    teamA: {
      players: mockPlayers.slice(0, 5),
      totalRating: mockPlayers.slice(0, 5).reduce((s, p) => s + p.rating, 0),
      avgRating: 85.6,
      score: 1,
    },
    teamB: {
      players: mockPlayers.slice(5, 10),
      totalRating: mockPlayers.slice(5, 10).reduce((s, p) => s + p.rating, 0),
      avgRating: 83.2,
      score: 3,
    },
    result: { scoreA: 1, scoreB: 3 },
    winner: 'B',
    mvpId: '9',
  },
]
