import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { GeneratedTeams, Match } from '@/types'
import { mockMatches } from '@/data/mockMatches'
import { idbStorage } from './idbStorage'

interface MatchState {
  selectedPlayerIds: Set<string>
  generatedTeams: GeneratedTeams | null
  matches: Match[]
  togglePlayer: (id: string) => void
  selectAll: (ids: string[]) => void
  clearSelection: () => void
  setGeneratedTeams: (teams: GeneratedTeams | null) => void
  saveMatch: (match: Match) => void
}

export const useMatchStore = create<MatchState>()(
  persist(
    (set) => ({
      selectedPlayerIds: new Set(),
      generatedTeams: null,
      matches: mockMatches,

      togglePlayer: (id) => set((state) => {
        const next = new Set(state.selectedPlayerIds)
        if (next.has(id)) next.delete(id)
        else next.add(id)
        return { selectedPlayerIds: next }
      }),

      selectAll: (ids) => set({ selectedPlayerIds: new Set(ids) }),

      clearSelection: () => set({ selectedPlayerIds: new Set(), generatedTeams: null }),

      setGeneratedTeams: (teams) => set({ generatedTeams: teams }),

      saveMatch: (match) => set((state) => ({
        matches: [match, ...state.matches],
      })),
    }),
    {
      name: 'matchmaker-matches',
      storage: idbStorage,
      partialize: (state) => ({ matches: state.matches }),
    }
  )
)
