import { motion, AnimatePresence } from 'framer-motion'

function WhistleSVG() {
  return (
    <svg width="100" height="62" viewBox="0 0 100 62" fill="none">
      <circle cx="24" cy="9" r="6" stroke="white" strokeWidth="2.5" />
      <path d="M24 15 Q26 20 30 22" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="36" cy="34" rx="26" ry="21" fill="white" opacity="0.92" />
      <rect x="60" y="27" width="36" height="14" rx="5" fill="white" opacity="0.88" />
      <circle cx="28" cy="37" r="6" stroke="#aaa" strokeWidth="1.5" fill="none" opacity="0.5" />
      <ellipse cx="28" cy="28" rx="9" ry="6" fill="white" opacity="0.35" />
    </svg>
  )
}

interface Props {
  visible: boolean
  paddingBottom?: number
}

export function WhistleOverlay({ visible, paddingBottom = 150 }: Props) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="whistle-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[60] flex items-center justify-center pointer-events-none"
          style={{ paddingBottom }}
        >
          <motion.div
            initial={{ scale: 0.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.15, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 20 }}
            className="flex flex-col items-center gap-3"
          >
            <motion.div
              animate={{
                rotate:     [-14, 14, -10, 10, -6, 6, 0],
                y:          [  0, -4,   0,  4,  0, -2, 0],
              }}
              transition={{ duration: 0.75, ease: 'easeOut' }}
            >
              <WhistleSVG />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: [1, 1.1, 1, 1.06, 1],
              }}
              transition={{
                opacity: { delay: 0.12, duration: 0.2 },
                y:       { delay: 0.12, duration: 0.22 },
                scale:   { delay: 0.12, duration: 0.55 },
              }}
              className="text-4xl font-black text-white tracking-[0.18em]"
              style={{
                textShadow: '0 2px 24px rgba(0,0,0,0.6), 0 0 60px rgba(255,255,255,0.2)',
              }}
            >
              ¡PIIIIT!
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
