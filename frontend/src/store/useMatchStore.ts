import { create } from 'zustand'
import type { GeneratedTeams, Match } from '@/types'
import { apiFetch } from '@/lib/api'

const CACHE_KEY = 'dg:matches'

function loadCache(): Match[] {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    return raw ? (JSON.parse(raw) as Match[]) : []
  } catch {
    return []
  }
}

function saveCache(matches: Match[]): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(matches))
  } catch {}
}

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

export const useMatchStore = create<MatchState>()((set, get) => ({
  selectedPlayerIds: new Set(),
  generatedTeams: null,
  matches: loadCache(),
  loading: true,

  fetchMatches: async () => {
    try {
      const matches = await apiFetch<Match[]>('/matches')
      set({ matches, loading: false })
      saveCache(matches)
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
    const updated = [match, ...get().matches]
    set({ matches: updated })
    saveCache(updated)
    await apiFetch('/matches', { method: 'POST', body: JSON.stringify(match) })
  },
}))
