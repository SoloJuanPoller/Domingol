import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, SlidersHorizontal } from 'lucide-react'
import { TopBar } from '@/components/layout/TopBar'
import { PlayerCard } from '@/components/player/PlayerCard'
import { PlayerCardDetail } from '@/components/player/PlayerCardDetail'
import { AddPlayerModal } from '@/components/player/AddPlayerModal'
import { Button } from '@/components/ui/Button'
import { usePlayersStore } from '@/store/usePlayersStore'
import type { Player } from '@/types'

type SortKey = 'rating' | 'name' | 'goals' | 'matches'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
}
const cardItem = {
  hidden: { opacity: 0, scale: 0.85, y: 20 },
  show: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 350, damping: 25 } },
}

export default function PlayersPage() {
  const { players, deletePlayer } = usePlayersStore()
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<SortKey>('rating')
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null)
  const [addOpen, setAddOpen] = useState(false)
  const [editPlayer, setEditPlayer] = useState<Player | undefined>()
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const filtered = players
    .filter(p =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      (p.nickname?.toLowerCase().includes(query.toLowerCase()))
    )
    .sort((a, b) => {
      if (sort === 'rating') return b.rating - a.rating
      if (sort === 'name') return a.name.localeCompare(b.name)
      if (sort === 'goals') return b.stats.goals - a.stats.goals
      if (sort === 'matches') return b.stats.matches - a.stats.matches
      return 0
    })

  function handleEdit(player: Player) {
    setSelectedPlayer(null)
    setEditPlayer(player)
    setAddOpen(true)
  }

  function handleDelete(id: string) {
    setDeleteConfirm(id)
  }

  function confirmDelete() {
    if (deleteConfirm) {
      deletePlayer(deleteConfirm)
      setDeleteConfirm(null)
      setSelectedPlayer(null)
    }
  }

  return (
    <div>
      <TopBar
        title="Jugadores"
        subtitle={`${players.length} registrados`}
        right={
          <Button
            variant="primary"
            size="sm"
            icon={<Plus size={14} />}
            onClick={() => { setEditPlayer(undefined); setAddOpen(true) }}
          >
            Agregar
          </Button>
        }
      />

      <div className="px-5 pt-5">
        {/* Search */}
        <div className="relative mb-4">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-tertiary" />
          <input
            type="text"
            placeholder="Buscar jugador..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-surface-elevated border border-surface rounded-2xl text-sm text-primary placeholder:text-tertiary focus:outline-none focus:border-brand/50 transition-colors"
          />
        </div>

        {/* Sort pills */}
        <div className="flex items-center gap-2 mb-5 overflow-x-auto pb-1 no-scrollbar">
          <SlidersHorizontal size={14} className="text-tertiary flex-shrink-0" />
          {([
            { key: 'rating', label: 'Media' },
            { key: 'name', label: 'Nombre' },
            { key: 'goals', label: 'Goles' },
            { key: 'matches', label: 'Partidos' },
          ] as { key: SortKey; label: string }[]).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setSort(key)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0 transition-all ${
                sort === key ? 'bg-brand text-white shadow-md' : 'bg-surface-elevated text-secondary'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Cards grid */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-20 text-center">
            <span className="text-5xl">👥</span>
            <p className="text-secondary text-sm">
              {query ? 'No se encontró ningún jugador.' : 'Todavía no hay jugadores. ¡Agregá el primero!'}
            </p>
          </div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-3 gap-3"
          >
            {filtered.map(player => (
              <motion.div key={player.id} variants={cardItem} layout>
                <PlayerCard
                  player={player}
                  size="sm"
                  onClick={() => setSelectedPlayer(player)}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Detail panel */}
      <PlayerCardDetail
        player={selectedPlayer}
        onClose={() => setSelectedPlayer(null)}
        onEdit={() => selectedPlayer && handleEdit(selectedPlayer)}
        onDelete={() => selectedPlayer && handleDelete(selectedPlayer.id)}
      />

      {/* Delete confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)} />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10 w-full max-w-sm bg-surface-elevated rounded-3xl p-6 shadow-surface-xl border border-surface"
          >
            <h3 className="text-base font-bold text-primary mb-2">¿Eliminar jugador?</h3>
            <p className="text-sm text-secondary mb-5">Esta acción no se puede deshacer.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-3 rounded-2xl bg-surface text-secondary font-semibold text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-3 rounded-2xl bg-red-500 text-white font-semibold text-sm"
              >
                Eliminar
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Add / Edit modal */}
      <AddPlayerModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        editPlayer={editPlayer}
      />
    </div>
  )
}
