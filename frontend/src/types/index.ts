export type Position = 'GK' | 'CB' | 'LB' | 'RB' | 'CDM' | 'CM' | 'CAM' | 'LW' | 'RW' | 'CF' | 'ST'

export type Foot = 'right' | 'left' | 'both'

export type CardGrade = 'special' | 'gold' | 'silver' | 'bronze' | 'normal'

export interface PlayerStats {
  matches: number
  wins: number
  losses: number
  draws: number
  goals: number
  assists: number
  mvp: number
}

export type StatKey = 'ritmo' | 'pase' | 'tiro' | 'fisico' | 'entrada' | 'vision'

export interface StatConfig {
  key: StatKey
  label: string
  color: string
  icon: 'wind' | 'zap' | 'shield' | 'dumbbell' | 'target' | 'eye'
}

export interface Player {
  id: string
  name: string
  nickname?: string
  age?: number
  position: Position
  foot: Foot
  /** Calculated automatically from the 3 position-specific stats */
  rating: number
  // Positional stats
  ritmo: number   // 1–99
  pase: number    // 1–99
  tiro: number    // 1–99
  fisico: number  // 1–99
  entrada: number // 1–99
  // Universal stat
  vision: number  // 1–99
  photo?: string
  stats: PlayerStats
  createdAt: string
}

export interface Team {
  players: Player[]
  totalRating: number
  avgRating: number
  score?: number
}

export interface GeneratedTeams {
  teamA: Team
  teamB: Team
  balance: number       // 0–100 percentage
  diff: number          // absolute difference
}

export interface Match {
  id: string
  date: string
  teamA: Team
  teamB: Team
  result?: { scoreA: number; scoreB: number }
  winner?: 'A' | 'B' | 'draw'
  mvpId?: string
}

export type Theme = 'dark' | 'light'
