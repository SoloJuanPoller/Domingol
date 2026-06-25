import { Outlet, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BottomNav } from './BottomNav'
import { APP_VERSION } from '@/version'

export function AppShell() {
  const location = useLocation()

  return (
    <div className="min-h-dvh bg-surface flex flex-col">
      <motion.main
        key={location.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="flex-1 pb-24 max-w-lg mx-auto w-full"
      >
        <Outlet />
        <p className="text-center text-[10px] text-tertiary/40 pb-2 select-none">
          Domingol {APP_VERSION}
        </p>
      </motion.main>
      <BottomNav />
    </div>
  )
}
