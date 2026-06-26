import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Play, Pause, Trophy, X } from 'lucide-react'
import { useMatchStore } from '@/store/useMatchStore'
import type { Player, Match } from '@/types'

type Phase = 'pre' | 'first-half' | 'half-time' | 'second-half'

interface GoalEvent {
  id: string
  playerId: string | null
  playerName: string
  team: 'A' | 'B'
  minute: number
}

const HALF = 30 * 60  // 1800 segundos por tiempo

export default function LiveMatchPage() {
  const navigate = useNavigate()
  const { generatedTeams, saveMatch } = useMatchStore()

  const [phase, setPhase] = useState<Phase>('pre')
  const [seconds, setSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [goals, setGoals] = useState<GoalEvent[]>([])
  const [showGoalPicker, setShowGoalPicker] = useState<'A' | 'B' | null>(null)
  const [showEndModal, setShowEndModal] = useState(false)
  const [winner, setWinner] = useState<'A' | 'B' | 'draw'>('draw')
  const [saving, setSaving] = useState(false)

  const scoreA = goals.filter(g => g.team === 'A').length
  const scoreB = goals.filter(g => g.team === 'B').length

  // Auto-suggest winner based on score
  useEffect(() => {
    if (scoreA > scoreB) setWinner('A')
    else if (scoreB > scoreA) setWinner('B')
    else setWinner('draw')
  }, [scoreA, scoreB])

  // Timer
  useEffect(() => {
    if (!isRunning) return
    const id = setInterval(() => {
      setSeconds(prev => {
        const next = prev + 1
        if (next >= HALF) {
          setIsRunning(false)
          if (phase === 'first-half') setPhase('half-time')
          else setShowEndModal(true)
          return HALF
        }
        return next
      })
    }, 1000)
    return () => clearInterval(id)
  }, [isRunning, phase])

  if (!generatedTeams) {
    navigate('/generate')
    return null
  }

  const { teamA, teamB } = generatedTeams
  const totalDisplay = phase === 'second-half' ? seconds + HALF : seconds
  const mins = Math.floor(totalDisplay / 60).toString().padStart(2, '0')
  const secs = (totalDisplay % 60).toString().padStart(2, '0')
  const progress = Math.min(totalDisplay / (2 * HALF), 1)

  const phaseLabel: Record<Phase, string> = {
    pre: 'Listo para comenzar',
    'first-half': '1er Tiempo',
    'half-time': 'Medio Tiempo',
    'second-half': '2do Tiempo',
  }

  function handleStart() {
    setSeconds(0)
    setPhase('first-half')
    setIsRunning(true)
  }

  function handleStartSecondHalf() {
    setSeconds(0)
    setPhase('second-half')
    setIsRunning(true)
  }

  function handleHalfTime() {
    setIsRunning(false)
    setPhase('half-time')
  }

  function handleEndMatch() {
    setIsRunning(false)
    setShowEndModal(true)
  }

  function handleGoal(playerId: string | null, playerName: string, team: 'A' | 'B') {
    const minute = Math.floor(totalDisplay / 60) + 1
    setGoals(prev => [...prev, {
      id: crypto.randomUUID(),
      playerId,
      playerName,
      team,
      minute,
    }])
    setShowGoalPicker(null)
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
      await saveMatch(match)
      navigate('/history')
    } finally {
      setSaving(false)
    }
  }

  const pickerPlayers = showGoalPicker === 'A' ? teamA.players : teamB.players

  return (
    <div className="flex flex-col min-h-dvh bg-surface">

      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-safe pt-4 pb-4">
        <button
          onClick={() => navigate('/generate')}
          className="w-9 h-9 rounded-full bg-surface-elevated flex items-center justify-center text-secondary"
        >
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-lg font-black text-primary">Partido en vivo</h1>
      </div>

      {/* Score + Timer card */}
      <div className="px-5 mb-4">
        <div className="bg-surface-elevated rounded-3xl p-5">
          <p className="text-center text-xs font-semibold text-secondary uppercase tracking-widest mb-4">
            {phaseLabel[phase]}
          </p>

          <div className="flex items-center justify-between mb-4">
            {/* Equipo A */}
            <div className="flex-1 text-center">
              <p className="text-xs font-bold text-blue-400 mb-1">AZUL</p>
              <motion.span
                key={`a-${scoreA}`}
                initial={{ scale: 1.5, color: '#60a5fa' }}
                animate={{ scale: 1, color: 'var(--text-primary)' }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                className="text-6xl font-black text-primary block"
              >
                {scoreA}
              </motion.span>
            </div>

            {/* Timer central */}
            <div className="flex flex-col items-center px-3">
              <span className="text-2xl font-mono font-black text-primary tracking-tight">
                {mins}:{secs}
              </span>
              <span className="text-tertiary text-lg font-black mt-0.5">vs</span>
            </div>

            {/* Equipo B */}
            <div className="flex-1 text-center">
              <p className="text-xs font-bold text-red-400 mb-1">ROJO</p>
              <motion.span
                key={`b-${scoreB}`}
                initial={{ scale: 1.5, color: '#f87171' }}
                animate={{ scale: 1, color: 'var(--text-primary)' }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                className="text-6xl font-black text-primary block"
              >
                {scoreB}
              </motion.span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-1.5 bg-surface rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #4F7FFF 0%, #a78bfa 100%)' }}
              animate={{ width: `${progress * 100}%` }}
              transition={{ duration: 0.8 }}
            />
          </div>
        </div>
      </div>

      {/* Teams */}
      <div className="flex-1 px-5 overflow-y-auto pb-2">
        <div className="grid grid-cols-2 gap-3">
          <TeamList
            label="Equipo Azul"
            color="blue"
            players={teamA.players}
            goalEvents={goals.filter(g => g.team === 'A')}
          />
          <TeamList
            label="Equipo Rojo"
            color="red"
            players={teamB.players}
            goalEvents={goals.filter(g => g.team === 'B')}
          />
        </div>
      </div>

      {/* Bottom controls */}
      <div className="px-5 pt-3 pb-safe pb-6 space-y-3">

        {/* Pre-match */}
        {phase === 'pre' && (
          <button
            onClick={handleStart}
            className="w-full py-4 rounded-2xl font-bold text-white text-base bg-brand flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            <Play size={18} fill="white" />
            Comenzar Partido
          </button>
        )}

        {/* During a half */}
        {(phase === 'first-half' || phase === 'second-half') && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowGoalPicker('A')}
                className="py-3 rounded-2xl font-bold text-sm text-blue-400 bg-blue-500/10 border border-blue-500/20 active:scale-95 transition-transform"
              >
                + Gol Azul
              </button>
              <button
                onClick={() => setShowGoalPicker('B')}
                className="py-3 rounded-2xl font-bold text-sm text-red-400 bg-red-500/10 border border-red-500/20 active:scale-95 transition-transform"
              >
                + Gol Rojo
              </button>
            </div>
            <div className="flex gap-3">
              <button
                onClick={isRunning ? () => setIsRunning(false) : () => setIsRunning(true)}
                className="w-12 h-12 rounded-2xl bg-surface-elevated flex items-center justify-center text-secondary active:scale-95 transition-transform flex-shrink-0"
              >
                {isRunning ? <Pause size={18} /> : <Play size={18} />}
              </button>
              <button
                onClick={phase === 'first-half' ? handleHalfTime : handleEndMatch}
                className="flex-1 py-3 rounded-2xl font-bold text-sm text-red-400 bg-red-500/10 border border-red-500/20 active:scale-95 transition-transform"
              >
                {phase === 'first-half' ? 'Fin 1er Tiempo' : 'Terminar Partido'}
              </button>
            </div>
          </>
        )}

        {/* Half time */}
        {phase === 'half-time' && (
          <div className="space-y-3">
            <div className="bg-surface-elevated rounded-2xl p-3 text-center">
              <p className="text-xs text-secondary">Descanso</p>
              <p className="text-sm font-bold text-primary mt-0.5">{scoreA} – {scoreB}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowGoalPicker('A')}
                className="py-3 rounded-2xl font-bold text-xs text-blue-400 bg-blue-500/10 border border-blue-500/20"
              >
                + Gol Azul
              </button>
              <button
                onClick={() => setShowGoalPicker('B')}
                className="py-3 rounded-2xl font-bold text-xs text-red-400 bg-red-500/10 border border-red-500/20"
              >
                + Gol Rojo
              </button>
            </div>
            <button
              onClick={handleStartSecondHalf}
              className="w-full py-4 rounded-2xl font-bold text-white text-base bg-brand flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
              <Play size={18} fill="white" />
              Iniciar 2do Tiempo
            </button>
            <button
              onClick={handleEndMatch}
              className="w-full py-3 rounded-2xl font-bold text-sm text-secondary bg-surface-elevated active:scale-95 transition-transform"
            >
              Terminar sin 2do tiempo
            </button>
          </div>
        )}
      </div>

      {/* Goal Picker — bottom sheet */}
      <AnimatePresence>
        {showGoalPicker && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40"
              onClick={() => setShowGoalPicker(null)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 30 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-surface-elevated rounded-t-3xl pb-safe"
            >
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-bold text-primary">¿Quién anotó?</h3>
                    <p className={`text-xs font-semibold mt-0.5 ${showGoalPicker === 'A' ? 'text-blue-400' : 'text-red-400'}`}>
                      {showGoalPicker === 'A' ? 'Equipo Azul' : 'Equipo Rojo'}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowGoalPicker(null)}
                    className="w-8 h-8 rounded-full bg-surface flex items-center justify-center text-secondary"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="space-y-2 max-h-[50vh] overflow-y-auto">
                  {pickerPlayers.map(player => (
                    <button
                      key={player.id}
                      onClick={() => handleGoal(player.id, player.nickname ?? player.name.split(' ')[0], showGoalPicker!)}
                      className="w-full flex items-center gap-3 p-3 rounded-2xl bg-surface active:bg-surface-elevated transition-colors text-left"
                    >
                      <div className="w-10 h-10 rounded-full bg-surface-elevated flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-black text-primary">{player.rating}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-primary truncate">
                          {player.nickname ?? player.name.split(' ')[0]}
                        </p>
                        <p className="text-xs text-secondary truncate">{player.name} · {player.position}</p>
                      </div>
                    </button>
                  ))}

                  <button
                    onClick={() => handleGoal(null, 'Sin autor', showGoalPicker!)}
                    className="w-full flex items-center gap-3 p-3 rounded-2xl bg-surface active:bg-surface-elevated transition-colors text-left"
                  >
                    <div className="w-10 h-10 rounded-full bg-surface-elevated flex items-center justify-center flex-shrink-0">
                      <span className="text-sm text-tertiary">?</span>
                    </div>
                    <p className="text-sm font-medium text-tertiary">Gol sin autor</p>
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* End Match Modal */}
      <AnimatePresence>
        {showEndModal && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="fixed inset-0 z-50 bg-surface flex flex-col overflow-y-auto"
          >
            {/* Modal header */}
            <div className="flex items-center gap-3 px-5 pt-safe pt-4 pb-4 flex-shrink-0">
              <button
                onClick={() => setShowEndModal(false)}
                className="w-9 h-9 rounded-full bg-surface-elevated flex items-center justify-center text-secondary"
              >
                <ArrowLeft size={18} />
              </button>
              <h2 className="text-xl font-black text-primary">Resultado Final</h2>
            </div>

            {/* Score */}
            <div className="px-5 mb-6 flex-shrink-0">
              <div className="bg-surface-elevated rounded-3xl p-6">
                <div className="flex items-center justify-center gap-10">
                  <div className="text-center">
                    <p className="text-xs font-bold text-blue-400 mb-2">AZUL</p>
                    <span className="text-7xl font-black text-primary">{scoreA}</span>
                  </div>
                  <span className="text-4xl font-black text-tertiary">–</span>
                  <div className="text-center">
                    <p className="text-xs font-bold text-red-400 mb-2">ROJO</p>
                    <span className="text-7xl font-black text-primary">{scoreB}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Winner selection */}
            <div className="px-5 mb-6 flex-shrink-0">
              <p className="text-xs text-secondary font-semibold uppercase tracking-widest mb-3">Ganador</p>
              <div className="grid grid-cols-3 gap-2">
                {(['A', 'draw', 'B'] as const).map(opt => (
                  <motion.button
                    key={opt}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setWinner(opt)}
                    className={`py-3 rounded-2xl text-sm font-bold transition-all ${
                      winner === opt
                        ? opt === 'A'
                          ? 'bg-blue-500 text-white shadow-lg'
                          : opt === 'B'
                          ? 'bg-red-500 text-white shadow-lg'
                          : 'bg-brand text-white shadow-lg'
                        : 'bg-surface-elevated text-secondary'
                    }`}
                  >
                    {opt === 'A' ? 'Azul' : opt === 'B' ? 'Rojo' : 'Empate'}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Goals list */}
            <div className="px-5 flex-1 mb-4">
              <p className="text-xs text-secondary font-semibold uppercase tracking-widest mb-3">
                Goles{goals.length > 0 ? ` (${goals.length})` : ''}
              </p>
              {goals.length === 0 ? (
                <p className="text-sm text-tertiary text-center py-6">Sin goles registrados</p>
              ) : (
                <div className="space-y-2">
                  {goals.map(g => (
                    <motion.div
                      key={g.id}
                      layout
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="flex items-center gap-3 p-3 rounded-2xl bg-surface-elevated"
                    >
                      <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${g.team === 'A' ? 'bg-blue-400' : 'bg-red-400'}`} />
                      <span className="text-sm font-bold text-primary flex-1">{g.playerName}</span>
                      <span className="text-xs text-tertiary">{g.minute}'</span>
                      <button
                        onClick={() => setGoals(prev => prev.filter(x => x.id !== g.id))}
                        className="w-6 h-6 rounded-full bg-surface flex items-center justify-center flex-shrink-0"
                      >
                        <X size={11} className="text-tertiary" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Save */}
            <div className="px-5 pb-safe pb-6 flex-shrink-0">
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full py-4 rounded-2xl font-bold text-white text-base bg-brand flex items-center justify-center gap-2 active:scale-95 transition-transform disabled:opacity-60"
              >
                <Trophy size={18} />
                {saving ? 'Guardando...' : 'Guardar Partido'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function TeamList({
  label,
  color,
  players,
  goalEvents,
}: {
  label: string
  color: 'blue' | 'red'
  players: Player[]
  goalEvents: GoalEvent[]
}) {
  const isBlue = color === 'blue'
  const headerText = isBlue ? 'text-blue-400' : 'text-red-400'
  const goalBg = isBlue ? 'bg-blue-500' : 'bg-red-500'

  return (
    <div>
      <p className={`text-xs font-bold ${headerText} text-center mb-2 uppercase tracking-wide`}>{label}</p>
      <div className="space-y-1.5">
        {players.map(player => {
          const count = goalEvents.filter(g => g.playerId === player.id).length
          return (
            <div
              key={player.id}
              className="flex items-center gap-2 p-2 rounded-xl bg-surface-elevated"
            >
              <div className="w-7 h-7 rounded-full bg-surface flex items-center justify-center flex-shrink-0">
                <span className="text-[10px] font-black text-primary">{player.rating}</span>
              </div>
              <p className="text-[11px] font-bold text-primary truncate flex-1">
                {player.nickname ?? player.name.split(' ')[0]}
              </p>
              {count > 0 && (
                <AnimatePresence>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={`w-5 h-5 rounded-full ${goalBg} flex items-center justify-center flex-shrink-0`}
                  >
                    <span className="text-[9px] font-black text-white">{count}</span>
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
