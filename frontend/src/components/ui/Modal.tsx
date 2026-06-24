import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import type { ReactNode } from 'react'

interface Props {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  footer?: ReactNode
  size?: 'sm' | 'md' | 'lg'
}

const widths = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg' }

export function Modal({ open, onClose, title, children, footer, size = 'md' }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Centering container — flex handles vertical alignment on desktop,
              avoids Framer Motion overwriting CSS translateY */}
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 pb-4 sm:pb-0 pointer-events-none">
            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className={`pointer-events-auto w-full ${widths[size]} flex flex-col`}
              style={{ maxHeight: 'min(90dvh, 90vh)' }}
            >
              <div className="bg-surface-elevated border border-surface rounded-3xl shadow-surface-xl flex flex-col overflow-hidden h-full">
                {title && (
                  <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 border-b border-surface">
                    <h2 className="text-base font-semibold text-primary">{title}</h2>
                    <button
                      onClick={onClose}
                      className="w-8 h-8 flex items-center justify-center rounded-full text-secondary hover:text-primary hover:bg-surface transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
                <div className="flex-1 overflow-y-auto overscroll-contain min-h-0">
                  {children}
                </div>
                {footer && (
                  <div className="flex-shrink-0 px-5 py-4 border-t border-surface bg-surface-elevated">
                    {footer}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
