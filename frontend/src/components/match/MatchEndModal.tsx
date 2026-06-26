import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Plus, Minus, X } from 'lucide-react'
import { PlayerCard } from '@/components/player/PlayerCard'
import type { Team, Player, Match } from '@/types'

interface Props {
  open: boolean
  teamA: Team
  teamB: Team
  onSave: (match: Match) => Promise<void>
  onClose: () => void
}

export function MatchEndModal({ open, teamA, teamB, onSave, onClose }: Props) {
  const [goalCounts, setGoalCounts] = useState<Record<string, number>>({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (open) setGoalCounts({})
  }, [open])

  const scoreA = teamA.players.reduce((s, p) => s + (goalCounts[p.id] ?? 0), 0)
  const scoreB = teamB.players.reduce((s, p) => s + (goalCounts[p.id] ?? 0), 0)
  const winner: 'A' | 'B' | 'draw' = scoreA > scoreB ? 'A' : scoreB > scoreA ? 'B' : 'draw'

  function adjustGoal(playerId: string, delta: number) {
    setGoalCounts(prev => ({
      ...prev,
      [playerId]: Math.max(0, (prev[playerId] ?? 0) + delta),
    }))
  }

  async function handleSave() {
    setSaving(true)
    try {
      const match: Match = {
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        teamA,
        teamB,
        result: { scoreA, scoreB },
        winner,
      }
      await onSave(match)
    } finally {
      setSaving(false)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />

          {/* Floating centered card */}
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.88 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              className="pointer-events-auto bg-surface rounded-3xl w-full flex flex-col overflow-hidden"
              style={{
                maxWidth: 420,
                maxHeight: 'calc(100dvh - 64px)',
                boxShadow: '0 24px 60px rgba(0,0,0,0.45), 0 8px 20px rgba(0,0,0,0.2)',
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 pt-5 pb-3 flex-shrink-0">
                <h2 className="text-base font-black text-primary">Resultado Final</h2>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-surface-elevated flex items-center justify-center text-secondary"
                >
                  <X size={15} />
                </button>
              </div>

              {/* Score */}
              <div className="px-5 pb-4 flex-shrink-0">
                <div className="bg-surface-elevated rounded-2xl py-3 flex items-center justify-center gap-6">
                  <div className="text-center">
                    <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-0.5">Azul</p>
                    <motion.span
                      key={scoreA}
                      initial={{ scale: 1.35 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 22 }}
                      className="text-4xl font-black text-primary block leading-none"
                    >
                      {scoreA}
                    </motion.span>
                  </div>
                  <span className="text-xl font-black text-tertiary">–</span>
                  <div className="text-center">
                    <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-0.5">Rojo</p>
                    <motion.span
                      key={scoreB}
                      initial={{ scale: 1.35 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 22 }}
                      className="text-4xl font-black text-primary block leading-none"
                    >
                      {scoreB}
                    </motion.span>
                  </div>
                </div>
              </div>

              {/* Player cards — scrollable */}
              <div className="flex-1 overflow-y-auto px-5 pb-2 min-h-0">
                <GoalCards
                  label="Equipo Azul"
                  color="blue"
                  players={teamA.players}
                  goalCounts={goalCounts}
                  onAdjust={adjustGoal}
                />
                <div className="h-5" />
                <GoalCards
                  label="Equipo Rojo"
                  color="red"
                  players={teamB.players}
                  goalCounts={goalCounts}
                  onAdjust={adjustGoal}
                />
              </div>

              {/* Save */}
              <div className="px-5 py-4 flex-shrink-0">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full py-3.5 rounded-2xl font-bold text-white text-sm bg-brand flex items-center justify-center gap-2 active:scale-95 transition-transform disabled:opacity-60"
                >
                  <Trophy size={16} />
                  {saving ? 'Guardando...' : 'Finalizar resultado'}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

function GoalCards({
  label,
  color,
  players,
  goalCounts,
  onAdjust,
}: {
  label: string
  color: 'blue' | 'red'
  players: Player[]
  goalCounts: Record<string, number>
  onAdjust: (id: string, delta: number) => void
}) {
  const headerText = color === 'blue' ? 'text-blue-400' : 'text-red-400'

  return (
    <div>
      <p className={`text-[10px] font-bold ${headerText} uppercase tracking-widest mb-3`}>{label}</p>
      <div className="flex flex-wrap gap-x-3 gap-y-6 justify-center">
        {players.map(player => {
          const count = goalCounts[player.id] ?? 0
          return (
            <div key={player.id} className="relative" style={{ paddingBottom: '18px' }}>
              {/* Goal badge */}
              <AnimatePresence>
                {count > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 22 }}
                    className="absolute -top-2 -right-2 z-40 w-6 h-6 rounded-full bg-yellow-400 shadow flex items-center justify-center pointer-events-none"
                  >
                    <span className="text-[10px] font-black text-black leading-none">{count}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <PlayerCard player={player} size="sm" />

              {/* +/− buttons */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-40">
                <AnimatePresence>
                  {count > 0 && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.6 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 22 }}
                      onClick={() => onAdjust(player.id, -1)}
                      className="w-6 h-6 rounded-full bg-surface-elevated border border-border flex items-center justify-center text-tertiary active:scale-90 transition-transform shadow-sm"
                    >
                      <Minus size={10} />
                    </motion.button>
                  )}
                </AnimatePresence>
                <button
                  onClick={() => onAdjust(player.id, 1)}
                  className="w-8 h-8 rounded-full bg-surface border-2 border-brand flex items-center justify-center shadow-md active:scale-90 transition-transform"
                >
                  <Plus size={15} className="text-brand" />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
