import { create } from 'zustand'
import type { Player } from '@/types'
import { apiFetch } from '@/lib/api'

interface PlayersState {
  players: Player[]
  loading: boolean
  fetchPlayers: () => Promise<void>
  addPlayer: (data: Omit<Player, 'id' | 'createdAt' | 'stats'>) => Promise<void>
  updatePlayer: (id: string, updates: Partial<Player>) => Promise<void>
  deletePlayer: (id: string) => Promise<void>
  importPlayers: (incoming: Player[]) => Promise<void>
}

export const usePlayersStore = create<PlayersState>()((set, get) => ({
  players: [],
  loading: true,

  fetchPlayers: async () => {
    try {
      const players = await apiFetch<Player[]>('/players')
      set({ players, loading: false })
    } catch {
      set({ loading: false })
    }
  },

  addPlayer: async (data) => {
    const player: Player = {
      ...data,
      id: `player-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      stats: { matches: 0, wins: 0, losses: 0, draws: 0, goals: 0, assists: 0, mvp: 0 },
      ritmo:   data.ritmo   ?? 70,
      pase:    data.pase    ?? 70,
      tiro:    data.tiro    ?? 70,
      fisico:  data.fisico  ?? 70,
      entrada: data.entrada ?? 70,
      vision:  data.vision  ?? 70,
    }
    set(state => ({ players: [...state.players, player] }))
    await apiFetch('/players', { method: 'POST', body: JSON.stringify(player) })
  },

  updatePlayer: async (id, updates) => {
    set(state => ({
      players: state.players.map(p => p.id === id ? { ...p, ...updates } : p),
    }))
    const current = get().players.find(p => p.id === id)
    if (current) {
      await apiFetch(`/players/${id}`, { method: 'PUT', body: JSON.stringify(current) })
    }
  },

  deletePlayer: async (id) => {
    set(state => ({ players: state.players.filter(p => p.id !== id) }))
    await apiFetch(`/players/${id}`, { method: 'DELETE' })
  },

  importPlayers: async (incoming) => {
    set({ players: incoming })
    await apiFetch('/players/import', { method: 'POST', body: JSON.stringify(incoming) })
  },
}))
