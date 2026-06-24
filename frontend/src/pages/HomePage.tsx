import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, Users, Trophy, Calendar, Zap, TrendingUp } from 'lucide-react'
import { TopBar } from '@/components/layout/TopBar'
import { usePlayersStore } from '@/store/usePlayersStore'
import { useMatchStore } from '@/store/useMatchStore'

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
}

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 400, damping: 28 } },
}

export default function HomePage() {
  const navigate = useNavigate()
  const { players } = usePlayersStore()
  const { matches } = useMatchStore()

  const nextSunday = getNextSunday()

  return (
    <div>
      <TopBar />

      <div className="px-5 pt-6">
        {/* Welcome */}
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.div variants={item} className="mb-6">
            <p className="text-secondary text-sm font-medium">Bienvenido</p>
            <h1 className="text-3xl font-black text-primary mt-0.5 tracking-tight">
              ¿Listos para el partido?
            </h1>
          </motion.div>

          {/* Next match card */}
          <motion.div
            variants={item}
            className="relative mb-4 p-5 rounded-3xl overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #1a2848 0%, #263860 50%, #1a3060 100%)',
            }}
          >
            {/* Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand/20 to-transparent pointer-events-none" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand/10 rounded-full blur-3xl" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-brand/20 flex items-center justify-center">
                    <Calendar size={16} className="text-brand" />
                  </div>
                  <span className="text-white/70 text-sm font-medium">Próximo partido</span>
                </div>
                <span className="text-white/50 text-xs">{nextSunday}</span>
              </div>
              <p className="text-white text-2xl font-black mb-1">Domingo ⚽</p>
              <p className="text-white/60 text-sm">{players.length} jugadores registrados</p>
            </div>
          </motion.div>

          {/* Stats row */}
          <motion.div variants={item} className="grid grid-cols-3 gap-3 mb-6">
            <StatCard icon={<Users size={18} />} label="Jugadores" value={players.length} color="text-blue-400" />
            <StatCard icon={<Trophy size={18} />} label="Partidos" value={matches.length} color="text-yellow-400" />
            <StatCard icon={<TrendingUp size={18} />} label="Esta semana" value={1} color="text-green-400" />
          </motion.div>

          {/* BIG CTA */}
          <motion.div variants={item} className="mb-6">
            <motion.button
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.01 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              onClick={() => navigate('/match')}
              className="relative w-full py-6 rounded-3xl overflow-hidden text-white font-black text-xl tracking-tight"
              style={{
                background: 'linear-gradient(135deg, #4F7FFF 0%, #7B5CF6 50%, #4F7FFF 100%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 3s linear infinite',
                boxShadow: '0 8px 32px rgba(79,127,255,0.4), 0 2px 8px rgba(79,127,255,0.2)',
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
              <div className="flex flex-col items-center gap-1 relative z-10">
                <div className="flex items-center gap-3">
                  <Zap size={24} className="fill-white" />
                  <span>Generar Equipos</span>
                </div>
                <span className="text-white/70 text-sm font-medium">Algoritmo inteligente</span>
              </div>
            </motion.button>
          </motion.div>

          {/* Last matches */}
          {matches.length > 0 && (
            <motion.div variants={item}>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-bold text-primary">Últimos partidos</h2>
                <button
                  onClick={() => navigate('/history')}
                  className="text-xs text-brand flex items-center gap-0.5 py-3 px-1 -my-3 -mx-1"
                >
                  Ver todos <ChevronRight size={14} />
                </button>
              </div>

              <div className="flex flex-col gap-3">
                {matches.slice(0, 3).map((match, i) => (
                  <motion.div
                    key={match.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.08 }}
                    className="flex items-center justify-between p-4 rounded-2xl bg-surface-elevated border border-surface"
                  >
                    <div>
                      <p className="text-sm font-semibold text-primary">
                        {new Date(match.date).toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'short' })}
                      </p>
                      <p className="text-xs text-secondary">
                        {match.teamA.players.length + match.teamB.players.length} jugadores
                      </p>
                    </div>

                    {match.result && (
                      <div className="flex items-center gap-3">
                        <span className={`text-sm font-bold ${match.winner === 'A' ? 'text-blue-400' : 'text-secondary'}`}>
                          {match.result.scoreA}
                        </span>
                        <span className="text-xs text-tertiary">–</span>
                        <span className={`text-sm font-bold ${match.winner === 'B' ? 'text-red-400' : 'text-secondary'}`}>
                          {match.result.scoreB}
                        </span>
                      </div>
                    )}

                    <WinnerBadge winner={match.winner} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string }) {
  return (
    <div className="p-3 rounded-2xl bg-surface-elevated flex flex-col gap-2">
      <div className={color}>{icon}</div>
      <div>
        <p className="text-xl font-black text-primary">{value}</p>
        <p className="text-xs text-secondary">{label}</p>
      </div>
    </div>
  )
}

function WinnerBadge({ winner }: { winner?: string }) {
  if (!winner) return null
  if (winner === 'draw') return <span className="px-2 py-0.5 rounded-full bg-yellow-400/10 text-yellow-400 text-xs font-semibold">Empate</span>
  if (winner === 'A') return <span className="px-2 py-0.5 rounded-full bg-blue-400/10 text-blue-400 text-xs font-semibold">Azul</span>
  return <span className="px-2 py-0.5 rounded-full bg-red-400/10 text-red-400 text-xs font-semibold">Rojo</span>
}

function getNextSunday(): string {
  const today = new Date()
  const day = today.getDay()
  const diff = (7 - day) % 7 || 7
  const sunday = new Date(today)
  sunday.setDate(today.getDate() + diff)
  return sunday.toLocaleDateString('es-AR', { day: 'numeric', month: 'long' })
}
