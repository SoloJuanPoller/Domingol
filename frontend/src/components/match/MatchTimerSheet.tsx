import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Hourglass, Pause, Play } from 'lucide-react'
import { WhistleOverlay } from './WhistleOverlay'

type Phase = 'idle' | 'first-half' | 'half-time' | 'second-half'

const HALF = 30 * 60

interface Props {
  open: boolean
  onEnd: () => void
}

export function MatchTimerSheet({ open, onEnd }: Props) {
  const [phase, setPhase] = useState<Phase>('idle')
  const [seconds, setSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [showWhistle, setShowWhistle] = useState(false)
  const whistleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (open) {
      setPhase('idle')
      setSeconds(0)
      setIsRunning(false)
      setShowWhistle(false)
    }
    return () => {
      if (whistleTimerRef.current) clearTimeout(whistleTimerRef.current)
    }
  }, [open])

  useEffect(() => {
    if (!isRunning) return
    const currentPhase = phase
    const id = setInterval(() => {
      setSeconds(s => {
        const next = s + 1
        if (next >= HALF) {
          setIsRunning(false)
          if (currentPhase === 'first-half') setPhase('half-time')
          else if (currentPhase === 'second-half') onEnd()
          return HALF
        }
        return next
      })
    }, 1000)
    return () => clearInterval(id)
  }, [isRunning, phase, onEnd])

  const totalDisplay = phase === 'second-half' ? seconds + HALF : seconds
  const mins = Math.floor(totalDisplay / 60).toString().padStart(2, '0')
  const secs = (totalDisplay % 60).toString().padStart(2, '0')

  function handleMainAction() {
    if (phase === 'idle') {
      setShowWhistle(true)
      setPhase('first-half')
      setIsRunning(true)
      whistleTimerRef.current = setTimeout(() => setShowWhistle(false), 2000)
    } else if (phase === 'first-half') {
      setIsRunning(false)
      setPhase('half-time')
    } else if (phase === 'half-time') {
      setSeconds(0)
      setPhase('second-half')
      setIsRunning(true)
    } else if (phase === 'second-half') {
      setIsRunning(false)
      onEnd()
    }
  }

  const phaseConfig = {
    idle:          { label: '',           btn: 'Comenzar partido' },
    'first-half':  { label: '1er Tiempo', btn: 'Terminar 1º'     },
    'half-time':   { label: 'Descanso',   btn: 'Comenzar 2º'     },
    'second-half': { label: '2do Tiempo', btn: 'Terminar 2º'     },
  }[phase]

  const isActive = phase === 'first-half' || phase === 'second-half'

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/45 z-40"
          />

          {/* Whistle animation — floats above the card for 2 s */}
          <WhistleOverlay visible={showWhistle} paddingBottom={150} />

          {/* Centered floating card */}
          <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none px-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.88 }}
              transition={{ type: 'spring', stiffness: 340, damping: 28 }}
              className="pointer-events-auto bg-surface rounded-3xl w-full overflow-hidden relative"
              style={{
                maxWidth: 300,
                boxShadow: '0 24px 60px rgba(0,0,0,0.45), 0 8px 20px rgba(0,0,0,0.2)',
              }}
            >
              {/* Pause button — top right when active */}
              {isActive && (
                <button
                  onClick={() => setIsRunning(r => !r)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-surface-elevated flex items-center justify-center text-secondary"
                >
                  {isRunning ? <Pause size={13} /> : <Play size={13} />}
                </button>
              )}

              <div className="px-7 pt-7 pb-6">
                <AnimatePresence mode="wait">
                  {phase === 'idle' ? (
                    <motion.div
                      key="idle"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center gap-5 py-4"
                    >
                      <motion.button
                        whileTap={{ scale: 0.88 }}
                        onClick={handleMainAction}
                        className="w-20 h-20 rounded-full bg-surface-elevated flex items-center justify-center shadow-surface-md"
                      >
                        <span className="text-4xl select-none">⚽</span>
                      </motion.button>
                      <button
                        onClick={handleMainAction}
                        className="text-sm font-bold text-secondary"
                      >
                        Comenzar partido
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="active"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center gap-5"
                    >
                      <p className="text-[11px] font-semibold text-secondary uppercase tracking-widest">
                        {phaseConfig.label}
                      </p>

                      <span className="text-7xl font-black font-mono text-primary leading-none tracking-tight">
                        {mins}:{secs}
                      </span>

                      <motion.button
                        key={phase}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleMainAction}
                        className="w-full py-3.5 rounded-2xl font-bold text-white text-sm bg-brand flex items-center justify-center gap-2"
                      >
                        <Hourglass size={16} />
                        {phaseConfig.btn}
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
