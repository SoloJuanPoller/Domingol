import { motion } from 'framer-motion'
import { clsx } from 'clsx'
import type { ReactNode, ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'team-a' | 'team-b'
type Size = 'sm' | 'md' | 'lg' | 'xl'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  children: ReactNode
  fullWidth?: boolean
  loading?: boolean
  icon?: ReactNode
}

const variants: Record<Variant, string> = {
  primary: 'bg-brand text-white shadow-md hover:bg-brand-light active:bg-brand-dark',
  secondary: 'bg-surface-elevated text-primary border border-surface hover:bg-surface-overlay',
  ghost: 'text-secondary hover:text-primary hover:bg-surface-elevated',
  danger: 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20',
  'team-a': 'bg-blue-500 text-white shadow-md hover:bg-blue-400',
  'team-b': 'bg-red-500 text-white shadow-md hover:bg-red-400',
}

const sizes: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-xl gap-1.5',
  md: 'px-4 py-2.5 text-sm rounded-2xl gap-2',
  lg: 'px-6 py-3.5 text-base rounded-2xl gap-2',
  xl: 'px-8 py-4 text-lg font-semibold rounded-3xl gap-3',
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  fullWidth,
  loading,
  icon,
  className,
  disabled,
  ...props
}: Props) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      whileHover={{ scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className={clsx(
        'inline-flex items-center justify-center font-medium transition-colors duration-150 select-none',
        'disabled:opacity-40 disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled || loading}
      {...(props as object)}
    >
      {loading ? (
        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4z" />
        </svg>
      ) : icon}
      {children}
    </motion.button>
  )
}
