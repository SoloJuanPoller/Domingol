import { motion, AnimatePresence } from 'framer-motion'
import { X, Swords, TrendingUp, Star, Target, Zap } from 'lucide-react'
import type { Player } from '@/types'
import { PlayerCard } from './PlayerCard'
import { getFootLabel, getPositionLabel, getBalanceLabel } from '@/utils/cardUtils'

interface Props {
  player: Player | null
  onClose: () => void
  onEdit?: () => void
  onDelete?: () => void
}

export function PlayerCardDetail({ player, onClose, onEdit, onDelete }: Props) {
  return (
    <AnimatePresence>
      {player && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-md"
            onClick={onClose}
          />

          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            className="fixed inset-x-0 bottom-0 z-50 max-w-lg mx-auto"
          >
            <div className="bg-surface-elevated rounded-t-4xl overflow-hidden border-t border-surface shadow-surface-xl pb-safe">
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-surface" />
              </div>

              <div className="px-6 pb-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-primary">{player.name}</h2>
                    {player.nickname && (
                      <p className="text-secondary text-sm">"{player.nickname}"</p>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-tertiary">{getPositionLabel(player.position)}</span>
                      <span className="text-tertiary">·</span>
                      <span className="text-xs text-tertiary">{getFootLabel(player.foot)}</span>
                      {player.age && (
                        <>
                          <span className="text-tertiary">·</span>
                          <span className="text-xs text-tertiary">{player.age} años</span>
                        </>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="w-9 h-9 rounded-full bg-surface flex items-center justify-center text-secondary hover:text-primary transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Card + stats */}
                <div className="flex gap-6 mb-6">
                  <PlayerCard player={player} size="lg" animate3d />

                  {/* Win rate */}
                  <div className="flex-1 flex flex-col gap-3">
                    <WinRate stats={player.stats} />
                    <StatRow icon={<Target size={14} />} label="Goles" value={player.stats.goals} color="text-red-400" />
                    <StatRow icon={<Zap size={14} />} label="Asistencias" value={player.stats.assists} color="text-blue-400" />
                    <StatRow icon={<Star size={14} />} label="MVP" value={player.stats.mvp} color="text-yellow-400" />
                    <StatRow icon={<Swords size={14} />} label="Partidos" value={player.stats.matches} color="text-purple-400" />
                  </div>
                </div>

                {/* Record bar */}
                <RecordBar stats={player.stats} />

                {/* Actions */}
                {(onEdit || onDelete) && (
                  <div className="flex gap-3 mt-6">
                    {onEdit && (
                      <button
                        onClick={onEdit}
                        className="flex-1 py-3 rounded-2xl bg-brand/10 text-brand font-semibold text-sm hover:bg-brand/20 transition-colors"
                      >
                        Editar jugador
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={onDelete}
                        className="py-3 px-4 rounded-2xl bg-red-500/10 text-red-400 font-semibold text-sm hover:bg-red-500/20 transition-colors"
                      >
                        Eliminar
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function WinRate({ stats }: { stats: Player['stats'] }) {
  const rate = stats.matches > 0 ? Math.round((stats.wins / stats.matches) * 100) : 0
  const { color } = getBalanceLabel(rate)
  return (
    <div className="bg-surface rounded-2xl px-3 py-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-secondary">
          <TrendingUp size={12} />
          <span className="text-xs">% Victoria</span>
        </div>
        <span className="text-xs font-bold" style={{ color }}>{rate}%</span>
      </div>
      <div className="mt-1.5 h-1.5 rounded-full bg-surface-elevated overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${rate}%` }}
          transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="h-full rounded-full bg-brand"
        />
      </div>
    </div>
  )
}

function StatRow({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className={`flex items-center gap-1.5 ${color}`}>
        {icon}
        <span className="text-xs text-secondary">{label}</span>
      </div>
      <span className="text-sm font-bold text-primary">{value}</span>
    </div>
  )
}

function RecordBar({ stats }: { stats: Player['stats'] }) {
  const total = stats.wins + stats.losses + stats.draws
  const wPct = total > 0 ? (stats.wins / total) * 100 : 0
  const dPct = total > 0 ? (stats.draws / total) * 100 : 0
  const lPct = total > 0 ? (stats.losses / total) * 100 : 0

  return (
    <div>
      <div className="flex justify-between text-xs text-secondary mb-2">
        <span className="text-green-400 font-semibold">{stats.wins}G</span>
        <span className="text-yellow-400 font-semibold">{stats.draws}E</span>
        <span className="text-red-400 font-semibold">{stats.losses}P</span>
      </div>
      <div className="flex h-2 rounded-full overflow-hidden gap-0.5">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${wPct}%` }}
          transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="bg-green-500 rounded-l-full"
        />
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${dPct}%` }}
          transition={{ delay: 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="bg-yellow-400"
        />
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${lPct}%` }}
          transition={{ delay: 0.4, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="bg-red-500 rounded-r-full"
        />
      </div>
    </div>
  )
}
