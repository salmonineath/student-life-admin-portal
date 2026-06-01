import type { ReactNode } from 'react'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'

interface DashboardLayoutProps {
  children: ReactNode
  activePage: string
  onNavigate: (page: string) => void
  title: string
  subtitle?: string
}

const DashboardLayout = ({ children, activePage, onNavigate, title, subtitle }: DashboardLayoutProps) => {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar activePage={activePage} onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header title={title} subtitle={subtitle} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
