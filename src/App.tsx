import { useState } from 'react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import DashboardLayout from './layouts/DashboardLayout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Users from './pages/Users'
import Settings from './pages/Settings'

const PAGE_META: Record<string, { title: string; subtitle: string }> = {
  dashboard: { title: 'Dashboard', subtitle: 'Overview of your platform' },
  users: { title: 'Users Management', subtitle: 'Monitor and manage all platform users' },
  settings: { title: 'Settings', subtitle: 'Manage your account and profile' },
}

const AppContent = () => {
  const { user, isLoading } = useAuth()
  const [activePage, setActivePage] = useState(
    () => sessionStorage.getItem('activePage') ?? 'dashboard'
  )

  const navigate = (page: string) => {
    sessionStorage.setItem('activePage', page)
    setActivePage(page)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0F172A' }}>
        <div className="w-5 h-5 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
      </div>
    )
  }

  if (!user) return <Login />

  const meta = PAGE_META[activePage] ?? PAGE_META.dashboard

  return (
    <DashboardLayout
      activePage={activePage}
      onNavigate={navigate}
      title={meta.title}
      subtitle={meta.subtitle}
    >
      {activePage === 'dashboard' && <Dashboard onNavigate={navigate} />}
      {activePage === 'users' && <Users />}
      {activePage === 'settings' && <Settings />}
      {activePage !== 'dashboard' && activePage !== 'users' && activePage !== 'settings' && (
        <div className="flex items-center justify-center h-64 text-slate-400 text-sm">
          {meta.title} — coming soon
        </div>
      )}
    </DashboardLayout>
  )
}

const App = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
)

export default App
