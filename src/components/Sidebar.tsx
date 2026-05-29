import { LayoutDashboard, Users, Settings, Shield, LogOut } from 'lucide-react'
import { getInitials, getAvatarColor } from '../data/mockUsers'
import { useAuth } from '../contexts/AuthContext'

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard', key: 'dashboard' },
  { icon: Users,           label: 'Users',     key: 'users' },
  { icon: Settings,        label: 'Settings',  key: 'settings' },
]

interface SidebarProps {
  activePage: string
  onNavigate: (page: string) => void
}

const Sidebar = ({ activePage, onNavigate }: SidebarProps) => {
  const { user, logout } = useAuth()

  return (
    <aside className="w-60 shrink-0 flex flex-col h-full" style={{ backgroundColor: '#0F172A' }}>
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-white/10">
        <div className="p-1.5 rounded-lg bg-indigo-500/20">
          <Shield size={18} className="text-indigo-400" />
        </div>
        <div>
          <p className="text-white text-sm font-semibold leading-tight" style={{ fontFamily: '"Sora", system-ui, sans-serif' }}>
            Student Life
          </p>
          <p className="text-slate-400 text-xs leading-tight">Admin Portal</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map(({ icon: Icon, label, key }) => {
          const isActive = activePage === key
          return (
            <button
              key={key}
              onClick={() => onNavigate(key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 text-left cursor-pointer ${
                isActive
                  ? 'bg-indigo-500/15 text-indigo-400'
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
              }`}
            >
              <Icon size={16} />
              {label}
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400" />
              )}
            </button>
          )
        })}
      </nav>

      {/* Admin profile */}
      <div className="px-3 pb-4 border-t border-white/10 pt-3">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors group">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
            style={{ backgroundColor: getAvatarColor(String(user?.id ?? 0)) }}
          >
            {getInitials(user?.fullname ?? 'Admin')}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-slate-200 text-xs font-medium truncate">{user?.fullname ?? 'Admin'}</p>
            <p className="text-slate-500 text-xs truncate">{user?.email ?? ''}</p>
          </div>
          <button
            onClick={logout}
            title="Sign out"
            className="text-slate-600 group-hover:text-slate-400 hover:text-red-400! shrink-0 transition-colors cursor-pointer"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
