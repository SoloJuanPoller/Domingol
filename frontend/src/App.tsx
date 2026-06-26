import { Routes, Route, Navigate } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import LoginPage from '@/pages/LoginPage'
import HomePage from '@/pages/HomePage'
import PlayersPage from '@/pages/PlayersPage'
import CreateMatchPage from '@/pages/CreateMatchPage'
import GenerateTeamsPage from '@/pages/GenerateTeamsPage'
import HistoryPage from '@/pages/HistoryPage'
export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<AppShell />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/players" element={<PlayersPage />} />
        <Route path="/match" element={<CreateMatchPage />} />
        <Route path="/generate" element={<GenerateTeamsPage />} />
        <Route path="/history" element={<HistoryPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
