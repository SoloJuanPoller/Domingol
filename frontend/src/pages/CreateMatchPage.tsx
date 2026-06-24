import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Zap, Users, RotateCcw } from 'lucide-react'
import { TopBar } from '@/components/layout/TopBar'
import { PlayerCard } from '@/components/player/PlayerCard'
import { usePlayersStore } from '@/store/usePlayersStore'
import { useMatchStore } from '@/store/useMatchStore'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
}
const cardAnim = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  show: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 350, damping: 25 } },
}

export default function CreateMatchPage() {
  const navigate = useNavigate()
  const { players } = usePlayersStore()
  const { selectedPlayerIds, togglePlayer, selectAll, clearSelection } = useMatchStore()

  const selectedCount = selectedPlayerIds.size
  const canGenerate = selectedCount >= 2

  function handleSelectAll() {
    if (selectedCount === players.length) {
      clearSelection()
    } else {
      selectAll(players.map(p => p.id))
    }
  }

  function handleGenerate() {
    navigate('/generate')
  }

  return (
    <div>
      <TopBar
        title="Crear partido"
        subtitle={selectedCount > 0 ? `${selectedCount} seleccionados` : 'Seleccioná los jugadores'}
        right={
          <button
            onClick={clearSelection}
            className="text-xs text-secondary flex items-center gap-1 py-1.5 px-2 rounded-xl hover:bg-surface-elevated transition-colors"
          >
            <RotateCcw size={12} />
            Limpiar
          </button>
        }
      />

      <div className="px-5 pt-5">
        {/* Selection status */}
        <AnimatePresence>
          {selectedCount > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              className="overflow-hidden"
            >
              <div className="flex items-center justify-between p-4 rounded-2xl bg-brand/10 border border-brand/20">
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-brand" />
                  <span className="text-sm font-semibold text-brand">
                    {selectedCount} jugador{selectedCount !== 1 ? 'es' : ''} seleccionado{selectedCount !== 1 ? 's' : ''}
                  </span>
                </div>
                {selectedCount % 2 !== 0 && (
                  <span className="text-xs text-yellow-400">Número impar</span>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick actions */}
        <div className="flex items-center gap-2 mb-5">
          <button
            onClick={handleSelectAll}
            className="flex-1 py-2.5 rounded-2xl bg-surface-elevated text-secondary text-sm font-semibold hover:bg-surface-overlay transition-colors"
          >
            {selectedCount === players.length ? 'Deseleccionar todo' : 'Seleccionar todo'}
          </button>
        </div>

        {/* Cards */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-3 gap-3 pb-6"
        >
          {players.map(player => (
            <motion.div key={player.id} variants={cardAnim} layout>
              <PlayerCard
                player={player}
                selected={selectedPlayerIds.has(player.id)}
                onSelect={() => togglePlayer(player.id)}
                size="sm"
                className={!selectedPlayerIds.has(player.id) && selectedCount > 0 ? 'opacity-50' : ''}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Sticky bottom CTA */}
      <AnimatePresence>
        {canGenerate && (
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="fixed bottom-20 inset-x-0 px-5 z-20 max-w-lg mx-auto"
          >
            <motion.button
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.02 }}
              onClick={handleGenerate}
              className="w-full py-5 rounded-3xl text-white font-black text-lg flex items-center justify-center gap-3 relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #4F7FFF 0%, #7B5CF6 100%)',
                boxShadow: '0 8px 32px rgba(79,127,255,0.5)',
              }}
            >
              <div className="absolute inset-0 bg-white/5 pointer-events-none" />
              <Zap size={22} className="fill-white relative z-10" />
              <span className="relative z-10">¡Generar equipos!</span>
              <span className="relative z-10 text-white/70 text-sm font-medium">({selectedCount} jugadores)</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
