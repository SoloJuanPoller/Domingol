import { clsx } from 'clsx'

interface Props {
  className?: string
  rounded?: boolean
}

export function Skeleton({ className, rounded }: Props) {
  return (
    <div
      className={clsx(
        'animate-pulse bg-gradient-to-r from-surface-elevated via-surface-overlay to-surface-elevated',
        'bg-[length:200%_100%]',
        rounded ? 'rounded-full' : 'rounded-2xl',
        className
      )}
      style={{ backgroundSize: '200% 100%', animation: 'shimmer 1.8s linear infinite' }}
    />
  )
}

export function PlayerCardSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      {[...Array(6)].map((_, i) => (
        <Skeleton key={i} className="h-[200px] w-[140px]" />
      ))}
    </div>
  )
}
