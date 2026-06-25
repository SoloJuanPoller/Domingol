import { create } from 'zustand'
import type { GeneratedTeams, Match } from '@/types'
import { apiFetch } from '@/lib/api'

interface MatchState {
  selectedPlayerIds: Set<string>
  generatedTeams: GeneratedTeams | null
  matches: Match[]
  loading: boolean
  fetchMatches: () => Promise<void>
  togglePlayer: (id: string) => void
  selectAll: (ids: string[]) => void
  clearSelection: () => void
  setGeneratedTeams: (teams: GeneratedTeams | null) => void
  saveMatch: (match: Match) => Promise<void>
}

export const useMatchStore = create<MatchState>()((set) => ({
  selectedPlayerIds: new Set(),
  generatedTeams: null,
  matches: [],
  loading: true,

  fetchMatches: async () => {
    try {
      const matches = await apiFetch<Match[]>('/matches')
      set({ matches, loading: false })
    } catch {
      set({ loading: false })
    }
  },

  togglePlayer: (id) => set((state) => {
    const next = new Set(state.selectedPlayerIds)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    return { selectedPlayerIds: next }
  }),

  selectAll: (ids) => set({ selectedPlayerIds: new Set(ids) }),

  clearSelection: () => set({ selectedPlayerIds: new Set(), generatedTeams: null }),

  setGeneratedTeams: (teams) => set({ generatedTeams: teams }),

  saveMatch: async (match) => {
    set(state => ({ matches: [match, ...state.matches] }))
    await apiFetch('/matches', { method: 'POST', body: JSON.stringify(match) })
  },
}))
