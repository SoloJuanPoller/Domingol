import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Player } from '@/types'
import { mockPlayers } from '@/data/mockPlayers'
import { idbStorage } from './idbStorage'

interface PlayersState {
  players: Player[]
  addPlayer: (player: Omit<Player, 'id' | 'createdAt' | 'stats'>) => void
  updatePlayer: (id: string, updates: Partial<Player>) => void
  deletePlayer: (id: string) => void
}

export const usePlayersStore = create<PlayersState>()(
  persist(
    (set) => ({
      players: mockPlayers,

      addPlayer: (data) => set((state) => ({
        players: [
          ...state.players,
          {
            ...data,
            id: `player-${Date.now()}`,
            createdAt: new Date().toISOString().split('T')[0],
            stats: { matches: 0, wins: 0, losses: 0, draws: 0, goals: 0, assists: 0, mvp: 0 },
            ritmo:  data.ritmo  ?? 70,
            pase:   data.pase   ?? 70,
            tiro:   data.tiro   ?? 70,
            fisico: data.fisico ?? 70,
            entrada: data.entrada ?? 70,
          },
        ],
      })),

      updatePlayer: (id, updates) => set((state) => ({
        players: state.players.map(p => p.id === id ? { ...p, ...updates } : p),
      })),

      deletePlayer: (id) => set((state) => ({
        players: state.players.filter(p => p.id !== id),
      })),
    }),
    { name: 'matchmaker-players', storage: idbStorage }
  )
)
