import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, RefreshCw, Share2, AlertTriangle } from 'lucide-react'
import { TopBar } from '@/components/layout/TopBar'
import { PlayerCard } from '@/components/player/PlayerCard'
import { Button } from '@/components/ui/Button'
import { usePlayersStore } from '@/store/usePlayersStore'
import { useMatchStore } from '@/store/useMatchStore'
import { generateOptimalTeams, shuffleArray } from '@/utils/teamAlgorithm'
import { getBalanceLabel } from '@/utils/cardUtils'
import type { GeneratedTeams } from '@/types'

type Stage = 'idle' | 'shuffling' | 'sorting' | 'revealed'

export default function GenerateTeamsPage() {
  const navigate = useNavigate()
  const { players } = usePlayersStore()
  const { selectedPlayerIds, setGeneratedTeams, clearSelection } = useMatchStore()
  const [stage, setStage] = useState<Stage>('idle')
  const [teams, setTeams] = useState<GeneratedTeams | null>(null)
  const [shuffled, setShuffled] = useState<typeof players>([])
  const [counter, setCounter] = useState(0)

  const selected = players.filter(p => selectedPlayerIds.has(p.id))

  useEffect(() => {
    if (selected.length < 2) {
      navigate('/match')
      return
    }
    startAnimation()
  }, [])

  async function startAnimation() {
    setStage('shuffling')
    setShuffled(shuffleArray(selected))

    // Shuffle animation — scramble a few times
    for (let i = 0; i < 4; i++) {
      await sleep(300)
      setShuffled(shuffleArray(selected))
    }

    // Compute optimal teams (may take a moment for large n)
    await sleep(200)
    const result = generateOptimalTeams(selected)
    setTeams(result)
    setGeneratedTeams(result)

    await sleep(300)
    setStage('sorting')

    // Animated counter
    await sleep(200)
    setStage('revealed')
    animateCounter(result.balance)
  }

  function animateCounter(target: number) {
    const duration = 1200
    const startTime = performance.now()

    function tick(now: number) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 4)
      setCounter(Math.round(eased * target * 100) / 100)
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }

  function handleRegenerate() {
    setStage('idle')
    setTeams(null)
    setCounter(0)
    setTimeout(startAnimation, 100)
  }

  const balanceInfo = teams ? getBalanceLabel(teams.balance) : null

  return (
    <div>
      <TopBar
        title="Generando equipos"
        back={
          <button
            onClick={() => { clearSelection(); navigate('/match') }}
            className="w-9 h-9 rounded-full bg-surface-elevated flex items-center justify-center text-secondary hover:text-primary transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
        }
      />

      <div className="px-5 pt-6">
        {/* Shuffling state */}
        <AnimatePresence mode="wait">
          {(stage === 'shuffling' || stage === 'sorting') && (
            <motion.div
              key="shuffling"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center py-8"
            >
              <div className="relative w-full h-48 mb-8">
                {shuffled.map((player, i) => {
                  const angle = (i / shuffled.length) * 360
                  const radius = 80
                  const x = Math.cos((angle * Math.PI) / 180) * radius
                  const y = Math.sin((angle * Math.PI) / 180) * radius * 0.5
                  return (
                    <motion.div
                      key={player.id}
                      className="absolute left-1/2 top-1/2"
                      animate={{
                        x: x - 55,
                        y: y - 80,
                        rotate: Math.random() * 30 - 15,
                        scale: 0.7,
                      }}
                      transition={{ type: 'spring', stiffness: 200, damping: 20, delay: i * 0.03 }}
                    >
                      <PlayerCard player={player} size="md" />
                    </motion.div>
                  )
                })}
              </div>
              <motion.p
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="text-secondary text-sm font-medium"
              >
                Calculando la mejor combinación...
              </motion.p>
              <p className="text-tertiary text-xs mt-1">
                Analizando {Math.round(factorial(selected.length) / (factorial(Math.floor(selected.length / 2)) ** 2)).toLocaleString()} combinaciones
              </p>
            </motion.div>
          )}

          {/* Revealed state */}
          {stage === 'revealed' && teams && (
            <motion.div
              key="revealed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {/* Balance score */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="text-center mb-6"
              >
                <div className="inline-flex flex-col items-center gap-1">
                  <span className="text-5xl font-black text-primary tracking-tight">
                    {counter.toFixed(1)}%
                  </span>
                  <span
                    className="text-sm font-bold px-3 py-1 rounded-full"
                    style={{ color: balanceInfo?.color, background: `${balanceInfo?.color}20` }}
                  >
                    {balanceInfo?.label}
                  </span>
                  {teams.diff > 0 && (
                    <p className="text-xs text-tertiary mt-1">
                      Diferencia de {teams.diff} punto{teams.diff !== 1 ? 's' : ''}
                    </p>
                  )}
                </div>
              </motion.div>

              {/* Warning for large imbalance */}
              <AnimatePresence>
                {teams.balance < 85 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="flex items-center gap-2 p-3 rounded-2xl bg-yellow-400/10 border border-yellow-400/20 mb-4"
                  >
                    <AlertTriangle size={14} className="text-yellow-400 flex-shrink-0" />
                    <p className="text-xs text-yellow-400">
                      Los equipos presentan cierto desequilibrio. Podés volver a intentarlo.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Teams */}
              <div className="grid grid-cols-2 gap-4">
                {/* Team A */}
                <TeamColumn
                  label="Equipo Azul"
                  color="blue"
                  team={teams.teamA}
                  delay={0}
                />
                {/* Team B */}
                <TeamColumn
                  label="Equipo Rojo"
                  color="red"
                  team={teams.teamB}
                  delay={0.1}
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-6 pb-4">
                <Button
                  variant="secondary"
                  icon={<RefreshCw size={14} />}
                  onClick={handleRegenerate}
                  className="flex-1"
                >
                  Regenerar
                </Button>
                <Button
                  variant="primary"
                  icon={<Share2 size={14} />}
                  onClick={() => {}}
                  className="flex-1"
                >
                  Compartir
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function TeamColumn({
  label,
  color,
  team,
  delay,
}: {
  label: string
  color: 'blue' | 'red'
  team: import('@/types').Team
  delay: number
}) {
  const isBlue = color === 'blue'
  const headerBg = isBlue ? 'bg-blue-500/10 border-blue-500/20' : 'bg-red-500/10 border-red-500/20'
  const headerText = isBlue ? 'text-blue-400' : 'text-red-400'
  const glow = isBlue
    ? '0 0 30px rgba(59,130,246,0.2)'
    : '0 0 30px rgba(239,68,68,0.2)'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: 'spring', stiffness: 300, damping: 25 }}
    >
      {/* Header */}
      <div className={`flex flex-col items-center p-2 rounded-2xl border mb-3 ${headerBg}`} style={{ boxShadow: glow }}>
        <span className={`text-xs font-bold ${headerText}`}>{label}</span>
        <span className={`text-lg font-black ${headerText}`}>Ø {team.avgRating}</span>
      </div>

      {/* Players */}
      <div className="flex flex-col gap-2 items-center">
        {team.players.map((player, i) => (
          <motion.div
            key={player.id}
            initial={{ opacity: 0, x: isBlue ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: delay + 0.1 + i * 0.06, type: 'spring', stiffness: 350, damping: 28 }}
          >
            <PlayerCard player={player} size="sm" />
          </motion.div>
        ))}
      </div>

      {/* Total */}
      <div className={`text-center mt-2 text-xs ${headerText} font-semibold`}>
        Total: {team.totalRating} pts
      </div>
    </motion.div>
  )
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function factorial(n: number): number {
  if (n <= 1) return 1
  if (n > 20) return 2432902008176640000 // cap at 20!
  return n * factorial(n - 1)
}
