import { create } from 'zustand'
import type { Player } from '@/types'
import { apiFetch } from '@/lib/api'

const CACHE_KEY = 'dg:players'

function loadCache(): Player[] {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    return raw ? (JSON.parse(raw) as Player[]) : []
  } catch {
    return []
  }
}

function saveCache(players: Player[]): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(players))
  } catch {}
}

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
  players: loadCache(),
  loading: true,

  fetchPlayers: async () => {
    try {
      const players = await apiFetch<Player[]>('/players')
      set({ players, loading: false })
      saveCache(players)
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
    const updated = [...get().players, player]
    set({ players: updated })
    saveCache(updated)
    await apiFetch('/players', { method: 'POST', body: JSON.stringify(player) })
  },

  updatePlayer: async (id, updates) => {
    const updated = get().players.map(p => p.id === id ? { ...p, ...updates } : p)
    set({ players: updated })
    saveCache(updated)
    const current = updated.find(p => p.id === id)
    if (current) {
      await apiFetch(`/players/${id}`, { method: 'PUT', body: JSON.stringify(current) })
    }
  },

  deletePlayer: async (id) => {
    const updated = get().players.filter(p => p.id !== id)
    set({ players: updated })
    saveCache(updated)
    await apiFetch(`/players/${id}`, { method: 'DELETE' })
  },

  importPlayers: async (incoming) => {
    set({ players: incoming })
    saveCache(incoming)
    await apiFetch('/players/import', { method: 'POST', body: JSON.stringify(incoming) })
  },
}))
