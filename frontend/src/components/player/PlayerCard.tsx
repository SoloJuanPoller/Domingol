import { useRef } from 'react'
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { CheckCircle } from 'lucide-react'
import type { Player } from '@/types'
import {
  getCardGradeClass,
  getCardTextColor,
  getCardAccentColor,
  getGradeGlow,
  getPositionLabel,
  getPositionStats,
  getPositionColor,
  getInitials,
} from '@/utils/cardUtils'
import { clsx } from 'clsx'

const ELITE_PARTICLES = [
  { left: '15%', bottom: '8%',  size: 3,   delay: '0s',    dur: '2.8s' },
  { left: '78%', bottom: '6%',  size: 2.5, delay: '1.0s',  dur: '3.4s' },
  { left: '48%', bottom: '3%',  size: 2.5, delay: '1.9s',  dur: '2.6s' },
  { left: '30%', bottom: '18%', size: 2.5, delay: '2.7s',  dur: '3.1s' },
  { left: '85%', bottom: '16%', size: 2,   delay: '0.6s',  dur: '3.7s' },
  { left: '62%', bottom: '12%', size: 2,   delay: '2.2s',  dur: '2.9s' },
] as const

function EliteParticles() {
  return (
    <>
      {ELITE_PARTICLES.map((p, i) => (
        <span
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: p.left,
            bottom: p.bottom,
            width: p.size,
            height: p.size,
            background: 'radial-gradient(circle, #FFF8A0 0%, #FFD700 60%, transparent 100%)',
            animationName: 'elite-sparkle',
            animationDuration: p.dur,
            animationDelay: p.delay,
            animationTimingFunction: 'ease-out',
            animationIterationCount: 'infinite',
            zIndex: 50,
          }}
        />
      ))}
    </>
  )
}

interface Props {
  player: Player
  selected?: boolean
  onSelect?: () => void
  onClick?: () => void
  size?: 'sm' | 'md' | 'lg'
  animate3d?: boolean
  className?: string
}

const sizes = {
  sm: { card: 'w-[110px] h-[160px]', rating: 'text-2xl', name: 'text-[9px]', pos: 'text-[8px]' },
  md: { card: 'w-[140px] h-[200px]', rating: 'text-3xl', name: 'text-[10px]', pos: 'text-[9px]' },
  lg: { card: 'w-[180px] h-[260px]', rating: 'text-4xl', name: 'text-xs', pos: 'text-[10px]' },
}

export function PlayerCard({
  player,
  selected = false,
  onSelect,
  onClick,
  size = 'md',
  animate3d = false,
  className,
}: Props) {
  const cardRef = useRef<HTMLDivElement>(null)
  const textColor = getCardTextColor(player.rating)
  const accentColor = getCardAccentColor(player.rating)
  const gradeClass = getCardGradeClass(player.rating)
  const glow = getGradeGlow(player.rating)
  const s = sizes[size]

  // Con foto el fondo efectivo siempre es oscuro (por los gradientes),
  // así que forzamos blanco + sombra para que se lea sobre cualquier remera.
  const tc = player.photo ? '#FFFFFF' : textColor
  const tShadow = player.photo
    ? '0 1px 5px rgba(0,0,0,1), 0 0 12px rgba(0,0,0,0.8)'
    : `0 1px 3px ${accentColor}`
  const footBg = player.photo ? 'rgba(0,0,0,0.45)' : accentColor

  /* 3D tilt */
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [12, -12]), { stiffness: 400, damping: 30 })
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-12, 12]), { stiffness: 400, damping: 30 })

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!animate3d || !cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5)
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  function handleMouseLeave() {
    mouseX.set(0)
    mouseY.set(0)
  }

  const handleClick = onSelect ?? onClick

  return (
    <motion.div
      ref={cardRef}
      style={{ rotateX: animate3d ? rotateX : 0, rotateY: animate3d ? rotateY : 0, transformStyle: 'preserve-3d' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.04, y: -4 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      onClick={handleClick}
      className={clsx('relative cursor-pointer select-none flex-shrink-0', s.card, className, player.rating >= 95 && 'elite-glow')}
    >
      {/* Card body */}
      <div
        className={clsx('relative w-full h-full rounded-2xl overflow-hidden', gradeClass)}
        style={{
          boxShadow: selected ? '0 0 0 2.5px #4F7FFF, ' + glow : glow,
        }}
      >
        {/* Position colour strip */}
        <div
          className="absolute top-0 inset-x-0 h-0.5 z-40 pointer-events-none"
          style={{ background: getPositionColor(player.position) }}
        />

        {/* Shine overlay */}
        <div className="absolute inset-0 card-shine pointer-events-none z-10" />

        {/* Selected overlay */}
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-brand/20 z-20 rounded-2xl"
          />
        )}

        {/* Top section */}
        <div className="absolute top-2 left-2 flex flex-col items-start z-30">
          <span
            className={clsx('font-black leading-none tracking-tight', s.rating)}
            style={{ color: tc, textShadow: tShadow }}
          >
            {player.rating}
          </span>
          <span
            className={clsx('font-bold tracking-widest mt-0.5', s.pos)}
            style={{ color: tc, textShadow: tShadow, opacity: 0.85 }}
          >
            {getPositionLabel(player.position)}
          </span>
          {/* Foot indicator */}
          <div
            className="mt-1 px-1 rounded text-[7px] font-semibold"
            style={{ background: footBg, color: tc }}
          >
            {player.foot === 'left' ? 'ZU' : player.foot === 'both' ? 'AM' : 'DI'}
          </div>
        </div>

        {/* Player avatar */}
        {player.photo ? (
          <div className="absolute inset-0 z-20">
            <img
              src={player.photo}
              alt={player.name}
              className="w-full h-full object-cover object-[center_15%]"
            />
            {/* Top fade — legibilidad del rating/posición */}
            <div
              className="absolute inset-x-0 top-0 h-1/3 pointer-events-none"
              style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, transparent 100%)' }}
            />
            {/* Bottom fade — transición suave hacia el nombre */}
            <div
              className="absolute inset-x-0 bottom-0 h-2/3 pointer-events-none"
              style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 45%, transparent 100%)' }}
            />
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center pt-6 pb-8 z-20">
            <Avatar name={player.name} textColor={textColor} accentColor={accentColor} size={size} />
          </div>
        )}

        {/* Bottom section */}
        <div
          className="absolute bottom-0 left-0 right-0 z-30 px-2 pb-2 pt-3"
          style={{ background: `linear-gradient(to top, ${accentColor.replace(')', ', 0.9)').replace('rgba', 'rgba')} 0%, transparent 100%)` }}
        >
          <p
            className={clsx('text-center font-bold truncate tracking-wide uppercase', s.name)}
            style={{ color: tc, textShadow: tShadow }}
          >
            {player.nickname ?? player.name.split(' ')[0]}
          </p>
          {/* Atributos por posición */}
          <div className="flex justify-center gap-1.5 mt-1">
            {getPositionStats(player.position).map(({ key, label }) => (
              <div key={key} className="flex flex-col items-center">
                <span className="text-[8px] font-black leading-none" style={{ color: tc, textShadow: tShadow }}>
                  {player[key]}
                </span>
                <span className="text-[6px] font-semibold tracking-widest" style={{ color: tc, textShadow: tShadow, opacity: 0.7 }}>
                  {label.slice(0, 3).toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Selected badge */}
      {player.rating >= 95 && <EliteParticles />}

      {selected && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute -top-2 -right-2 z-40 w-6 h-6 bg-brand rounded-full flex items-center justify-center shadow-lg"
        >
          <CheckCircle size={14} className="text-white" />
        </motion.div>
      )}
    </motion.div>
  )
}

/* Initials avatar */
function Avatar({
  name,
  textColor,
  accentColor,
  size,
}: {
  name: string
  textColor: string
  accentColor: string
  size: string
}) {
  const initials = getInitials(name)
  const fontSize = size === 'sm' ? '1.6rem' : size === 'lg' ? '2.8rem' : '2.2rem'

  return (
    <div
      className="w-3/4 h-3/4 rounded-full flex items-center justify-center"
      style={{
        background: accentColor,
        boxShadow: `0 4px 20px ${accentColor}`,
      }}
    >
      <span
        className="font-black select-none"
        style={{ fontSize, color: textColor, textShadow: `0 2px 8px ${accentColor}`, letterSpacing: '-0.02em' }}
      >
        {initials}
      </span>
    </div>
  )
}
