import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'

export default function LoginPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-dvh bg-surface flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-brand/20 rounded-full blur-[100px]" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-500/15 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-400/10 rounded-full blur-[80px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex flex-col items-center text-center max-w-sm w-full"
      >
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 300, damping: 20 }}
          className="mb-6 relative"
        >
          <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-brand to-purple-500 flex items-center justify-center shadow-xl shadow-brand/30">
            <span className="text-5xl">⚽</span>
          </div>
          <div className="absolute -inset-3 rounded-[2.5rem] bg-brand/10 blur-xl" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
        >
          <h1 className="text-4xl font-black text-primary tracking-tight mb-2">
            MatchMaker
          </h1>
          <p className="text-secondary text-base leading-relaxed">
            Armá los equipos perfectos para tu partido del domingo.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="w-full mt-12 flex flex-col gap-3"
        >
          <Button
            variant="primary"
            size="xl"
            fullWidth
            onClick={() => navigate('/')}
          >
            Comenzar a jugar
          </Button>

          <p className="text-xs text-tertiary mt-4">
            Google Login · Apple ID disponibles próximamente
          </p>
        </motion.div>

        {/* Feature pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="flex flex-wrap justify-center gap-2 mt-10"
        >
          {['Algoritmo inteligente', 'Cartas FIFA', 'Estadísticas', 'Historial'].map((f) => (
            <span
              key={f}
              className="px-3 py-1.5 rounded-full bg-surface-elevated border border-surface text-xs text-secondary"
            >
              {f}
            </span>
          ))}
        </motion.div>
      </motion.div>
    </div>
  )
}
