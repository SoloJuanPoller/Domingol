import { NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, Users, Calendar, History } from 'lucide-react'

const tabs = [
  { to: '/', icon: Home, label: 'Inicio' },
  { to: '/players', icon: Users, label: 'Jugadores' },
  { to: '/match', icon: Calendar, label: 'Partido' },
  { to: '/history', icon: History, label: 'Historial' },
]

export function BottomNav() {
  const location = useLocation()

  return (
    <nav className="fixed bottom-0 inset-x-0 z-30 glass border-t border-surface pb-safe">
      <div className="flex items-center justify-around px-2 pt-2 pb-1 max-w-lg mx-auto">
        {tabs.map(({ to, icon: Icon, label }) => {
          const active = to === '/' ? location.pathname === '/' : location.pathname.startsWith(to)
          return (
            <NavLink
              key={to}
              to={to}
              className="relative flex flex-col items-center gap-0.5 px-4 py-2 rounded-2xl transition-colors"
            >
              <div className="relative">
                {active && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 -m-2 bg-brand/15 rounded-2xl"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon
                  size={22}
                  className={`relative z-10 transition-colors ${active ? 'text-brand' : 'text-tertiary'}`}
                  strokeWidth={active ? 2.5 : 1.8}
                />
              </div>
              <span className={`text-[10px] font-medium transition-colors ${active ? 'text-brand' : 'text-tertiary'}`}>
                {label}
              </span>
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}
