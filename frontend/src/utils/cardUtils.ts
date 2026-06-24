import type { CardGrade, Position, StatConfig } from '@/types'

export function getCardGrade(rating: number): CardGrade {
  if (rating >= 90) return 'special'   // oro brillante
  if (rating >= 80) return 'gold'      // oro
  if (rating >= 70) return 'silver'    // plata
  if (rating >= 50) return 'bronze'    // bronce
  return 'normal'
}

const DEFENDER_POSITIONS: Position[] = ['CB', 'LB', 'RB']

export function getPositionStats(position: Position): StatConfig[] {
  if (DEFENDER_POSITIONS.includes(position)) {
    return [
      { key: 'fisico',  label: 'Físico',  color: '#10B981', icon: 'dumbbell' },
      { key: 'entrada', label: 'Entrada', color: '#8B5CF6', icon: 'target'   },
      { key: 'ritmo',   label: 'Ritmo',   color: '#F59E0B', icon: 'wind'     },
    ]
  }
  return [
    { key: 'ritmo', label: 'Ritmo', color: '#F59E0B', icon: 'wind'   },
    { key: 'pase',  label: 'Pase',  color: '#3B82F6', icon: 'zap'    },
    { key: 'tiro',  label: 'Tiro',  color: '#EF4444', icon: 'shield' },
  ]
}

export function calcRating(ritmo: number, pase: number, tiro: number): number {
  return Math.round((ritmo + pase + tiro) / 3)
}

export function calcRatingForPosition(
  position: Position,
  stats: { ritmo: number; pase: number; tiro: number; fisico: number; entrada: number },
): number {
  const keys = getPositionStats(position).map(s => s.key)
  const values = keys.map(k => stats[k] ?? 70)
  return Math.round(values.reduce((a, b) => a + b, 0) / 3)
}

export function getCardGradeClass(rating: number): string {
  const grade = getCardGrade(rating)
  return `grade-${grade}`
}

export function getCardTextColor(rating: number): string {
  const grade = getCardGrade(rating)
  if (grade === 'special') return '#3D2000'
  if (grade === 'gold') return '#2A1800'
  if (grade === 'silver') return '#1A1A1A'
  if (grade === 'bronze') return '#2A1000'
  return '#C8D8FF'
}

export function getCardAccentColor(rating: number): string {
  const grade = getCardGrade(rating)
  if (grade === 'special') return 'rgba(0,0,0,0.3)'
  if (grade === 'gold') return 'rgba(0,0,0,0.25)'
  if (grade === 'silver') return 'rgba(0,0,0,0.2)'
  if (grade === 'bronze') return 'rgba(0,0,0,0.25)'
  return 'rgba(255,255,255,0.15)'
}

export function getGradeGlow(rating: number): string {
  if (rating >= 90) return '0 0 30px rgba(255,215,0,0.5), 0 0 80px rgba(255,165,0,0.2)'
  if (rating >= 80) return '0 0 20px rgba(218,165,32,0.4), 0 0 50px rgba(184,144,32,0.15)'
  if (rating >= 70) return '0 0 15px rgba(200,200,200,0.3), 0 0 40px rgba(150,150,150,0.1)'
  if (rating >= 60) return '0 0 15px rgba(205,127,50,0.35), 0 0 40px rgba(154,88,24,0.15)'
  return '0 0 15px rgba(79,127,255,0.2), 0 0 40px rgba(38,56,96,0.1)'
}

export function getPositionLabel(position: Position): string {
  const labels: Record<Position, string> = {
    GK: 'GK', CB: 'CB', LB: 'LB', RB: 'RB',
    CDM: 'CDM', CM: 'CM', CAM: 'CAM',
    LW: 'LW', RW: 'RW', CF: 'CF', ST: 'ST',
  }
  return labels[position]
}

export function getPositionColor(position: Position): string {
  const goalkeepers = ['GK']
  const defenders = ['CB', 'LB', 'RB']
  const midfielders = ['CDM', 'CM', 'CAM']
  const attackers = ['LW', 'RW', 'CF', 'ST']

  if (goalkeepers.includes(position)) return '#F59E0B'
  if (defenders.includes(position)) return '#3B82F6'
  if (midfielders.includes(position)) return '#10B981'
  if (attackers.includes(position)) return '#EF4444'
  return '#8B5CF6'
}

export function getFootLabel(foot: string): string {
  if (foot === 'right') return 'Diestra'
  if (foot === 'left') return 'Zurda'
  return 'Ambidiestro'
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map(n => n[0])
    .join('')
    .toUpperCase()
}

export function formatRating(rating: number): string {
  return rating.toString().padStart(2, '0')
}

export function getBalanceLabel(balance: number): { label: string; color: string } {
  if (balance >= 99) return { label: 'Perfecto', color: '#10B981' }
  if (balance >= 97) return { label: 'Excelente', color: '#34D399' }
  if (balance >= 94) return { label: 'Muy bueno', color: '#6EE7B7' }
  if (balance >= 90) return { label: 'Bueno', color: '#FCD34D' }
  if (balance >= 85) return { label: 'Regular', color: '#F97316' }
  return { label: 'Desequilibrado', color: '#EF4444' }
}
