import type { Player } from '@/types'

export const mockPlayers: Player[] = [
  {
    id: '1', name: 'Carlos Rodríguez', nickname: 'Carlitos', age: 28,
    position: 'ST', foot: 'right', ritmo: 95, pase: 90, tiro: 94, rating: 93, fisico: 70, entrada: 70,
    stats: { matches: 47, wins: 29, losses: 10, draws: 8, goals: 42, assists: 11, mvp: 12 },
    createdAt: '2024-01-15',
  },
  {
    id: '2', name: 'Martín López', nickname: 'El Topo', age: 25,
    position: 'CM', foot: 'right', ritmo: 86, pase: 92, tiro: 86, rating: 88, fisico: 70, entrada: 70,
    stats: { matches: 44, wins: 27, losses: 9, draws: 8, goals: 15, assists: 24, mvp: 8 },
    createdAt: '2024-01-15',
  },
  {
    id: '3', name: 'Santiago García', nickname: 'El Muro', age: 30,
    position: 'GK', foot: 'right', ritmo: 82, pase: 88, tiro: 85, rating: 85, fisico: 70, entrada: 70,
    stats: { matches: 50, wins: 30, losses: 12, draws: 8, goals: 0, assists: 2, mvp: 10 },
    createdAt: '2024-01-15',
  },
  {
    // CB: Físico + Entrada + Ritmo — avg(84+83+80) = 82.3 ≈ 82
    id: '4', name: 'Nicolás Fernández', nickname: 'Nico', age: 27,
    position: 'CB', foot: 'right', ritmo: 80, pase: 70, tiro: 70, rating: 82, fisico: 84, entrada: 83,
    stats: { matches: 40, wins: 24, losses: 10, draws: 6, goals: 4, assists: 3, mvp: 4 },
    createdAt: '2024-01-15',
  },
  {
    id: '5', name: 'Diego Martínez', nickname: 'Dieguito', age: 23,
    position: 'LW', foot: 'left', ritmo: 90, pase: 83, tiro: 85, rating: 86, fisico: 70, entrada: 70,
    stats: { matches: 38, wins: 22, losses: 9, draws: 7, goals: 28, assists: 18, mvp: 7 },
    createdAt: '2024-01-20',
  },
  {
    id: '6', name: 'Facundo Pérez', nickname: 'Facu', age: 26,
    position: 'CAM', foot: 'right', ritmo: 82, pase: 88, tiro: 82, rating: 84, fisico: 70, entrada: 70,
    stats: { matches: 36, wins: 20, losses: 10, draws: 6, goals: 18, assists: 22, mvp: 6 },
    createdAt: '2024-01-20',
  },
  {
    // RB: Físico + Entrada + Ritmo — avg(76+80+78) = 78
    id: '7', name: 'Rodrigo Sánchez', nickname: 'El Vikingo', age: 29,
    position: 'RB', foot: 'right', ritmo: 78, pase: 70, tiro: 70, rating: 78, fisico: 76, entrada: 80,
    stats: { matches: 42, wins: 24, losses: 11, draws: 7, goals: 3, assists: 8, mvp: 2 },
    createdAt: '2024-01-20',
  },
  {
    id: '8', name: 'Leandro Torres', nickname: 'Leo', age: 31,
    position: 'CDM', foot: 'right', ritmo: 74, pase: 78, tiro: 76, rating: 76, fisico: 70, entrada: 70,
    stats: { matches: 48, wins: 25, losses: 14, draws: 9, goals: 5, assists: 10, mvp: 3 },
    createdAt: '2024-02-01',
  },
  {
    id: '9', name: 'Matías Gómez', nickname: 'Mati', age: 24,
    position: 'RW', foot: 'right', ritmo: 83, pase: 78, tiro: 79, rating: 80, fisico: 70, entrada: 70,
    stats: { matches: 32, wins: 18, losses: 9, draws: 5, goals: 20, assists: 12, mvp: 5 },
    createdAt: '2024-02-01',
  },
  {
    // CB: Físico + Entrada + Ritmo — avg(72+74+70) = 72
    id: '10', name: 'Gastón Ruiz', nickname: 'El Gordo', age: 33,
    position: 'CB', foot: 'left', ritmo: 70, pase: 70, tiro: 70, rating: 72, fisico: 72, entrada: 74,
    stats: { matches: 55, wins: 28, losses: 17, draws: 10, goals: 6, assists: 4, mvp: 2 },
    createdAt: '2024-02-01',
  },
  {
    // LB: Físico + Entrada + Ritmo — avg(65+70+68) = 67.7 ≈ 68
    id: '11', name: 'Ezequiel Moreno', nickname: 'Eze', age: 22,
    position: 'LB', foot: 'left', ritmo: 68, pase: 70, tiro: 70, rating: 68, fisico: 65, entrada: 70,
    stats: { matches: 25, wins: 13, losses: 8, draws: 4, goals: 2, assists: 6, mvp: 1 },
    createdAt: '2024-02-10',
  },
  {
    id: '12', name: 'Iván Castro', nickname: 'Cacho', age: 35,
    position: 'ST', foot: 'right', ritmo: 63, pase: 65, tiro: 67, rating: 65, fisico: 70, entrada: 70,
    stats: { matches: 60, wins: 28, losses: 20, draws: 12, goals: 35, assists: 8, mvp: 4 },
    createdAt: '2024-02-10',
  },
  {
    id: '13', name: 'Pablo Herrera', nickname: 'El Profe', age: 38,
    position: 'CM', foot: 'right', ritmo: 55, pase: 62, tiro: 57, rating: 58, fisico: 70, entrada: 70,
    stats: { matches: 70, wins: 30, losses: 25, draws: 15, goals: 8, assists: 20, mvp: 3 },
    createdAt: '2024-02-10',
  },
  {
    id: '14', name: 'Tomás Vargas', nickname: 'Tommy', age: 20,
    position: 'CAM', foot: 'both', ritmo: 72, pase: 76, tiro: 74, rating: 74, fisico: 70, entrada: 70,
    stats: { matches: 15, wins: 8, losses: 5, draws: 2, goals: 9, assists: 7, mvp: 2 },
    createdAt: '2024-03-01',
  },
  {
    id: '15', name: 'Agustín Díaz', nickname: 'Toto', age: 26,
    position: 'GK', foot: 'right', ritmo: 68, pase: 72, tiro: 70, rating: 70, fisico: 70, entrada: 70,
    stats: { matches: 20, wins: 11, losses: 6, draws: 3, goals: 0, assists: 1, mvp: 3 },
    createdAt: '2024-03-01',
  },
]
