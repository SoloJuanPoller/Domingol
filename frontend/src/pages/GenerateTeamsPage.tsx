import { useEffect, useState } from 'react'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, RefreshCw, Share2, AlertTriangle, ArrowLeftRight } from 'lucide-react'
import { TopBar } from '@/components/layout/TopBar'
import { PlayerCard } from '@/components/player/PlayerCard'
import { Button } from '@/components/ui/Button'
import { usePlayersStore } from '@/store/usePlayersStore'
import { useMatchStore } from '@/store/useMatchStore'
import { generateOptimalTeams, shuffleArray } from '@/utils/teamAlgorithm'
import { getBalanceLabel } from '@/utils/cardUtils'
import type { GeneratedTeams, Player } from '@/types'

type Stage = 'idle' | 'shuffling' | 'sorting' | 'revealed'
type SwapSelection = { player: Player; team: 'A' | 'B' } | null

export default function GenerateTeamsPage() {
  const navigate = useNavigate()
  const { players } = usePlayersStore()
  const { selectedPlayerIds, setGeneratedTeams, clearSelection } = useMatchStore()
  const [stage, setStage] = useState<Stage>('idle')
  const [teams, setTeams] = useState<GeneratedTeams | null>(null)
  const [shuffled, setShuffled] = useState<typeof players>([])
  const [counter, setCounter] = useState(0)
  const [swapSelection, setSwapSelection] = useState<SwapSelection>(null)

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
    setSwapSelection(null)
    setTimeout(startAnimation, 100)
  }

  function handlePlayerTap(player: Player, team: 'A' | 'B') {
    if (!swapSelection) {
      setSwapSelection({ player, team })
      return
    }
    if (swapSelection.team === team) {
      setSwapSelection({ player, team })
      return
    }
    if (!teams) return

    const [fromA, fromB] = team === 'B'
      ? [swapSelection.player, player]
      : [player, swapSelection.player]

    const newTeamA = teams.teamA.players.map(p => p.id === fromA.id ? fromB : p)
    const newTeamB = teams.teamB.players.map(p => p.id === fromB.id ? fromA : p)
    const totalA = newTeamA.reduce((s, p) => s + p.rating, 0)
    const totalB = newTeamB.reduce((s, p) => s + p.rating, 0)
    const avgA = Math.round(totalA / newTeamA.length)
    const avgB = Math.round(totalB / newTeamB.length)
    const max = Math.max(totalA, totalB)
    const min = Math.min(totalA, totalB)
    const balance = max > 0 ? Math.round((min / max) * 10000) / 100 : 100

    const newTeams: GeneratedTeams = {
      teamA: { players: newTeamA, totalRating: totalA, avgRating: avgA },
      teamB: { players: newTeamB, totalRating: totalB, avgRating: avgB },
      balance,
      diff: Math.abs(totalA - totalB),
    }
    setTeams(newTeams)
    setGeneratedTeams(newTeams)
    setCounter(balance)
    setSwapSelection(null)
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

              {/* Swap hint */}
              <AnimatePresence>
                {swapSelection && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="flex items-center justify-center gap-2 mb-4 py-2 px-4 rounded-2xl bg-yellow-400/10 border border-yellow-400/30"
                  >
                    <ArrowLeftRight size={13} className="text-yellow-400" />
                    <p className="text-xs text-yellow-400 font-medium">
                      Tocá un jugador del equipo contrario
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Teams */}
              <LayoutGroup id="swap-group">
              <div className="grid grid-cols-2 gap-4">
                <TeamColumn
                  label="Equipo Azul"
                  color="blue"
                  team={teams.teamA}
                  teamKey="A"
                  delay={0}
                  swapSelection={swapSelection}
                  onPlayerTap={handlePlayerTap}
                />
                <TeamColumn
                  label="Equipo Rojo"
                  color="red"
                  team={teams.teamB}
                  teamKey="B"
                  delay={0.1}
                  swapSelection={swapSelection}
                  onPlayerTap={handlePlayerTap}
                />
              </div>
              </LayoutGroup>

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
  teamKey,
  delay,
  swapSelection,
  onPlayerTap,
}: {
  label: string
  color: 'blue' | 'red'
  team: import('@/types').Team
  teamKey: 'A' | 'B'
  delay: number
  swapSelection: SwapSelection
  onPlayerTap: (player: Player, team: 'A' | 'B') => void
}) {
  const isBlue = color === 'blue'
  const headerBg = isBlue ? 'bg-blue-500/10 border-blue-500/20' : 'bg-red-500/10 border-red-500/20'
  const headerText = isBlue ? 'text-blue-400' : 'text-red-400'
  const glow = isBlue
    ? '0 0 30px rgba(59,130,246,0.2)'
    : '0 0 30px rgba(239,68,68,0.2)'

  const isEnemyTeam = swapSelection !== null && swapSelection.team !== teamKey

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
        {team.players.map((player, i) => {
          const isSelected = swapSelection?.player.id === player.id
          const isTarget = isEnemyTeam

          return (
            <motion.div
              key={player.id}
              layoutId={`card-${player.id}`}
              initial={{ opacity: 0, x: isBlue ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                opacity: { delay: delay + 0.1 + i * 0.06, duration: 0.25 },
                x: { delay: delay + 0.1 + i * 0.06, type: 'spring', stiffness: 350, damping: 28 },
                layout: { type: 'spring', stiffness: 320, damping: 28 },
              }}
              className="relative"
            >
              <motion.div
                animate={isTarget ? { scale: [1, 1.03, 1] } : {}}
                transition={{ repeat: Infinity, duration: 1.2 }}
                onClick={() => onPlayerTap(player, teamKey)}
                className="cursor-pointer"
                style={{
                  borderRadius: 16,
                  outline: isSelected
                    ? '2.5px solid #FACC15'
                    : isTarget
                    ? '2px dashed rgba(250,204,21,0.5)'
                    : 'none',
                  boxShadow: isSelected
                    ? '0 0 18px rgba(250,204,21,0.55)'
                    : undefined,
                }}
              >
                <PlayerCard player={player} size="sm" />
              </motion.div>

              {/* Icono de swap sobre el jugador seleccionado */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center z-50 shadow-md"
                >
                  <ArrowLeftRight size={10} className="text-black" />
                </motion.div>
              )}
            </motion.div>
          )
        })}
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
