import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Camera, X, Upload, Zap, Shield, Wind, Dumbbell, Target, Eye } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { PlayerCard } from './PlayerCard'
import { usePlayersStore } from '@/store/usePlayersStore'
import { calcRatingForPosition, getCardGrade, getPositionStats } from '@/utils/cardUtils'
import type { Player, Position, Foot, StatKey } from '@/types'

const POSITIONS: Position[] = ['GK', 'CB', 'LB', 'RB', 'CDM', 'CM', 'CAM', 'LW', 'RW', 'CF', 'ST']
const FEET: { value: Foot; label: string }[] = [
  { value: 'right', label: 'Diestra' },
  { value: 'left', label: 'Zurda' },
  { value: 'both', label: 'Ambidiestro' },
]

const GRADE_LABEL: Record<string, string> = {
  special: 'Oro Brillante',
  gold: 'Oro',
  silver: 'Plata',
  bronze: 'Bronce',
  normal: 'Normal',
}

interface Props {
  open: boolean
  onClose: () => void
  editPlayer?: Player
}

function initForm(player?: Player) {
  return {
    name:     player?.name ?? '',
    nickname: player?.nickname ?? '',
    age:      player?.age?.toString() ?? '',
    position: player?.position ?? ('ST' as Position),
    foot:     player?.foot ?? ('right' as Foot),
    ritmo:    player?.ritmo   ?? 70,
    pase:     player?.pase    ?? 70,
    tiro:     player?.tiro    ?? 70,
    fisico:   player?.fisico  ?? 70,
    entrada:  player?.entrada ?? 70,
    vision:   player?.vision  ?? 70,
    photo:    player?.photo ?? '',
  }
}

export function AddPlayerModal({ open, onClose, editPlayer }: Props) {
  const { addPlayer, updatePlayer } = usePlayersStore()
  const [form, setForm] = useState(() => initForm(editPlayer))
  const fileRef = useRef<HTMLInputElement>(null)

  // Re-init when editPlayer changes
  const [lastEditId, setLastEditId] = useState(editPlayer?.id)
  if (editPlayer?.id !== lastEditId) {
    setLastEditId(editPlayer?.id)
    setForm(initForm(editPlayer))
  }

  const rating = calcRatingForPosition(form.position, form)
  const grade = getCardGrade(rating)

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const objectUrl = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      const MAX = 400
      const scale = Math.min(1, MAX / Math.max(img.width, img.height))
      const canvas = document.createElement('canvas')
      canvas.width  = Math.round(img.width  * scale)
      canvas.height = Math.round(img.height * scale)
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      // Si la imagen tiene píxeles transparentes usamos PNG para preservarlos;
      // si no, JPEG es suficiente y pesa mucho menos.
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data
      const hasAlpha = Array.from({ length: data.length / 4 }, (_, i) => data[i * 4 + 3]).some(a => a < 255)
      set('photo', canvas.toDataURL(hasAlpha ? 'image/png' : 'image/jpeg', 0.82))
      URL.revokeObjectURL(objectUrl)
    }
    img.src = objectUrl
  }

  function handleSave() {
    if (!form.name.trim()) return
    const data = {
      name: form.name.trim(),
      nickname: form.nickname.trim() || undefined,
      age: form.age ? parseInt(form.age) : undefined,
      position: form.position,
      foot: form.foot,
      ritmo: form.ritmo,
      pase: form.pase,
      tiro: form.tiro,
      rating,
      photo: form.photo || undefined,
    }
    const fullData = {
      ...data,
      fisico:  form.fisico,
      entrada: form.entrada,
      vision:  form.vision,
    }
    if (editPlayer) {
      updatePlayer(editPlayer.id, fullData)
    } else {
      addPlayer(fullData)
    }
    onClose()
  }

  const positionStats = getPositionStats(form.position)

  /* Preview player object for the card */
  const preview: Player = {
    id: editPlayer?.id ?? 'preview',
    name: form.name || 'Nombre',
    nickname: form.nickname || undefined,
    position: form.position,
    foot: form.foot,
    rating,
    ritmo:   form.ritmo,
    pase:    form.pase,
    tiro:    form.tiro,
    fisico:  form.fisico,
    entrada: form.entrada,
    vision:  form.vision,
    age: form.age ? parseInt(form.age) : undefined,
    photo: form.photo || undefined,
    stats: editPlayer?.stats ?? { matches: 0, wins: 0, losses: 0, draws: 0, goals: 0, assists: 0, mvp: 0 },
    createdAt: editPlayer?.createdAt ?? new Date().toISOString(),
  }

  const saveButton = (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={handleSave}
      disabled={!form.name.trim()}
      className="w-full py-4 rounded-2xl font-bold text-base text-white disabled:opacity-40 disabled:pointer-events-none"
      style={{
        background: 'linear-gradient(135deg, #4F7FFF 0%, #7B5CF6 100%)',
        boxShadow: form.name.trim() ? '0 4px 20px rgba(79,127,255,0.35)' : 'none',
      }}
    >
      {editPlayer ? '✓  Guardar cambios' : '+  Agregar jugador'}
    </motion.button>
  )

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editPlayer ? `Editando a ${editPlayer.name.split(' ')[0]}` : 'Nuevo jugador'}
      size="md"
      footer={saveButton}
    >
      <div className="px-5 pb-6 flex flex-col gap-5">

        {/* ── Card preview + photo ────────────────────────── */}
        <div className="flex items-center justify-center gap-5 py-3">
          <motion.div
            key={`${rating}-${form.photo}`}
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            <PlayerCard player={preview} size="lg" animate3d />
          </motion.div>

          <div className="flex flex-col gap-3">
            {/* Grade badge */}
            <div className="text-center">
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
                style={{
                  background: grade === 'special' ? 'rgba(255,215,0,0.15)' :
                               grade === 'gold'    ? 'rgba(218,165,32,0.15)' :
                               grade === 'silver'  ? 'rgba(192,192,192,0.15)' :
                               grade === 'bronze'  ? 'rgba(205,127,50,0.15)' : 'rgba(79,127,255,0.15)',
                  color: grade === 'special' ? '#FFD700' :
                         grade === 'gold'    ? '#DAA520' :
                         grade === 'silver'  ? '#C0C0C0' :
                         grade === 'bronze'  ? '#CD7F32' : '#4F7FFF',
                }}
              >
                <span className="text-base font-black">{rating}</span>
                <span>{GRADE_LABEL[grade]}</span>
              </div>
            </div>

            {/* Photo upload */}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handlePhotoChange}
            />
            <button
              onClick={() => fileRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-surface border border-surface text-secondary hover:text-primary hover:border-brand/40 transition-colors text-sm font-medium"
            >
              {form.photo ? (
                <><Camera size={15} className="text-brand" /> Cambiar foto</>
              ) : (
                <><Upload size={15} /> Subir foto</>
              )}
            </button>
            {form.photo && (
              <button
                onClick={() => set('photo', '')}
                className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 transition-colors"
              >
                <X size={12} /> Quitar foto
              </button>
            )}
          </div>
        </div>

        {/* ── Name ────────────────────────────────────────── */}
        <Field label="Nombre *">
          <input
            type="text"
            value={form.name}
            onChange={e => set('name', e.target.value)}
            placeholder="Ej: Carlos Rodríguez"
            className="input-field"
          />
        </Field>

        {/* ── Nickname ────────────────────────────────────── */}
        <Field label="Apodo (opcional)">
          <input
            type="text"
            value={form.nickname}
            onChange={e => set('nickname', e.target.value)}
            placeholder="Ej: Carlitos"
            className="input-field"
          />
        </Field>

        {/* ── Age ─────────────────────────────────────────── */}
        <Field label="Edad (opcional)">
          <input
            type="number"
            value={form.age}
            onChange={e => set('age', e.target.value)}
            placeholder="Ej: 25"
            min={10}
            max={60}
            className="input-field"
          />
        </Field>

        {/* ── Position ────────────────────────────────────── */}
        <Field label="Posición">
          <div className="flex flex-wrap gap-2">
            {POSITIONS.map(pos => (
              <button
                key={pos}
                onClick={() => set('position', pos)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  form.position === pos
                    ? 'bg-brand text-white shadow-md scale-105'
                    : 'bg-surface text-secondary hover:text-primary'
                }`}
              >
                {pos}
              </button>
            ))}
          </div>
        </Field>

        {/* ── Foot ────────────────────────────────────────── */}
        <Field label="Pierna hábil">
          <div className="flex gap-2">
            {FEET.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => set('foot', value)}
                className={`flex-1 py-2.5 rounded-2xl text-sm font-semibold transition-all ${
                  form.foot === value
                    ? 'bg-brand text-white shadow-md'
                    : 'bg-surface text-secondary hover:text-primary'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </Field>

        {/* ── Stats sliders ────────────────────────────────── */}
        <div className="bg-surface rounded-3xl p-4 flex flex-col gap-4">
          <p className="text-xs font-bold text-secondary uppercase tracking-wider">
            Estadísticas → Media: <span className="text-primary">{rating}</span>
          </p>
          {positionStats.map(stat => (
            <StatSlider
              key={stat.key}
              icon={<StatIcon name={stat.icon} color={stat.color} />}
              label={stat.label}
              value={form[stat.key as StatKey] as number}
              onChange={v => set(stat.key as StatKey, v)}
              color={stat.color}
            />
          ))}
        </div>

      </div>
    </Modal>
  )
}

/* ── Helpers ──────────────────────────────────────────── */

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-semibold text-secondary uppercase tracking-wider">{label}</label>
      {children}
    </div>
  )
}

function StatIcon({ name, color }: { name: string; color: string }) {
  if (name === 'dumbbell') return <Dumbbell size={14} style={{ color }} />
  if (name === 'target')   return <Target   size={14} style={{ color }} />
  if (name === 'zap')      return <Zap      size={14} style={{ color }} />
  if (name === 'shield')   return <Shield   size={14} style={{ color }} />
  if (name === 'eye')      return <Eye      size={14} style={{ color }} />
  return <Wind size={14} style={{ color }} />
}

function StatSlider({
  icon,
  label,
  value,
  onChange,
  color,
}: {
  icon: React.ReactNode
  label: string
  value: number
  onChange: (v: number) => void
  color: string
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {icon}
          <span className="text-sm font-semibold text-primary">{label}</span>
        </div>
        <span className="text-sm font-black text-primary tabular-nums w-8 text-right">{value}</span>
      </div>
      <div className="relative h-2 rounded-full bg-surface-elevated overflow-hidden">
        {/* Fill */}
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all"
          style={{ width: `${value}%`, background: color }}
        />
      </div>
      <input
        type="range"
        min={1}
        max={99}
        value={value}
        onChange={e => onChange(parseInt(e.target.value))}
        className="w-full"
        style={{ accentColor: color }}
      />
    </div>
  )
}
