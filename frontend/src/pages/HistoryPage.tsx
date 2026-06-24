import { motion } from 'framer-motion'
import { Trophy, Users2, TrendingUp } from 'lucide-react'
import { TopBar } from '@/components/layout/TopBar'
import { useMatchStore } from '@/store/useMatchStore'
import { usePlayersStore } from '@/store/usePlayersStore'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
}
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 350, damping: 28 } },
}

export default function HistoryPage() {
  const { matches } = useMatchStore()
  const { players } = usePlayersStore()

  function getPlayerName(id?: string) {
    if (!id) return null
    return players.find(p => p.id === id)?.name ?? 'Desconocido'
  }

  return (
    <div>
      <TopBar title="Historial" subtitle={`${matches.length} partidos jugados`} />

      <div className="px-5 pt-5">
        {matches.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-24 text-center">
            <span className="text-5xl">📋</span>
            <p className="text-secondary text-sm">Todavía no hay partidos registrados.</p>
          </div>
        ) : (
          <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col gap-4">
            {matches.map(match => {
              const totalPlayers = match.teamA.players.length + match.teamB.players.length
              const mvpName = getPlayerName(match.mvpId)
              return (
                <motion.div
                  key={match.id}
                  variants={item}
                  className="bg-surface-elevated border border-surface rounded-3xl overflow-hidden shadow-surface"
                >
                  {/* Date header */}
                  <div className="px-5 pt-4 pb-3 flex items-center justify-between border-b border-surface">
                    <div>
                      <p className="text-sm font-bold text-primary">
                        {new Date(match.date).toLocaleDateString('es-AR', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                      <p className="text-xs text-secondary flex items-center gap-1 mt-0.5">
                        <Users2 size={11} /> {totalPlayers} jugadores
                      </p>
                    </div>
                    {match.winner && <WinnerBadge winner={match.winner} />}
                  </div>

                  {/* Score */}
                  {match.result && (
                    <div className="flex items-center justify-center gap-6 py-5">
                      <TeamScore
                        label="Azul"
                        score={match.result.scoreA}
                        avg={match.teamA.avgRating}
                        isWinner={match.winner === 'A'}
                        color="blue"
                      />
                      <span className="text-2xl font-black text-tertiary">–</span>
                      <TeamScore
                        label="Rojo"
                        score={match.result.scoreB}
                        avg={match.teamB.avgRating}
                        isWinner={match.winner === 'B'}
                        color="red"
                      />
                    </div>
                  )}

                  {/* MVP */}
                  {mvpName && (
                    <div className="px-5 pb-4 flex items-center gap-2">
                      <Trophy size={14} className="text-yellow-400" />
                      <span className="text-xs text-secondary">MVP:</span>
                      <span className="text-xs font-bold text-primary">{mvpName}</span>
                    </div>
                  )}
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </div>
    </div>
  )
}

function TeamScore({
  label,
  score,
  avg,
  isWinner,
  color,
}: {
  label: string
  score: number
  avg: number
  isWinner: boolean
  color: 'blue' | 'red'
}) {
  const c = color === 'blue' ? 'text-blue-400' : 'text-red-400'
  return (
    <div className={`flex flex-col items-center gap-1 ${isWinner ? 'opacity-100' : 'opacity-50'}`}>
      <span className={`text-xs font-semibold ${c}`}>{label}</span>
      <span className={`text-5xl font-black ${c}`}>{score}</span>
      <span className="text-xs text-tertiary flex items-center gap-0.5">
        <TrendingUp size={10} /> Ø {avg}
      </span>
    </div>
  )
}

function WinnerBadge({ winner }: { winner: string }) {
  if (winner === 'draw') return <span className="px-2.5 py-1 rounded-full bg-yellow-400/10 text-yellow-400 text-xs font-bold">Empate</span>
  if (winner === 'A') return <span className="px-2.5 py-1 rounded-full bg-blue-400/10 text-blue-400 text-xs font-bold">Ganó Azul</span>
  return <span className="px-2.5 py-1 rounded-full bg-red-400/10 text-red-400 text-xs font-bold">Ganó Rojo</span>
}
