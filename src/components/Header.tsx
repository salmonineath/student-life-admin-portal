import { useEffect, useState } from 'react'
import { Bell } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { apiFetch } from '../services/api'
import { getInitials, getAvatarColor } from '../utils/avatar'

interface HeaderProps {
  title: string
  subtitle?: string
}

const Header = ({ title, subtitle }: HeaderProps) => {
  const { user } = useAuth()
  const [unread, setUnread] = useState(0)

  useEffect(() => {
    let active = true
    apiFetch('/notification/unread/count')
      .then((res) => (res.ok ? res.json() : 0))
      .then((count) => { if (active) setUnread(Number(count) || 0) })
      .catch(() => {})
    return () => { active = false }
  }, [])

  return (
    <header className="bg-white border-b border-slate-100 px-6 py-4 flex items-center gap-4 shrink-0">
      <div className="flex-1">
        <h1 className="text-lg font-bold text-slate-900" style={{ fontFamily: '"Sora", system-ui, sans-serif' }}>
          {title}
        </h1>
        {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
      </div>

      <button className="relative p-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer">
        <Bell size={18} className="text-slate-500" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 flex items-center justify-center rounded-full bg-indigo-500 text-white text-[10px] font-semibold">
            {unread > 99 ? '99+' : unread}
          </span>
        )}
      </button>

      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold cursor-pointer select-none shrink-0"
        style={{ backgroundColor: getAvatarColor(String(user?.id ?? 0)) }}
        title={user?.fullname ?? 'Admin'}
      >
        {getInitials(user?.fullname ?? 'Admin')}
      </div>
    </header>
  )
}

export default Header
