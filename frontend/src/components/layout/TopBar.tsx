import { motion } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'
import { useThemeStore } from '@/store/useThemeStore'
import type { ReactNode } from 'react'

interface Props {
  title?: string
  subtitle?: string
  right?: ReactNode
  back?: ReactNode
}

export function TopBar({ title, subtitle, right, back }: Props) {
  const { theme, toggleTheme } = useThemeStore()

  return (
    <header className="sticky top-0 z-20 glass pt-safe border-b border-surface">
      <div className="flex items-center justify-between px-5 py-3 max-w-lg mx-auto">
        <div className="flex items-center gap-3 min-w-0">
          {back}
          {title && (
            <div className="min-w-0">
              <h1 className="text-base font-bold text-primary truncate">{title}</h1>
              {subtitle && <p className="text-xs text-secondary truncate">{subtitle}</p>}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {right}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            className="w-9 h-9 rounded-full bg-surface-elevated flex items-center justify-center text-secondary hover:text-primary transition-colors"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </motion.button>
        </div>
      </div>
    </header>
  )
}
