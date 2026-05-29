import { useEffect, useMemo, useState } from 'react'
import {
  Users,
  UserCheck,
  Shield,
  Sparkles,
  ArrowRight,
  Loader2,
  AlertCircle,
  TrendingUp,
} from 'lucide-react'
import StatsCard from '../components/StatsCard'
import { RoleBadge } from '../components/StatusBadge'
import { getInitials, getAvatarColor } from '../data/mockUsers'
import { apiFetch } from '../services/api'
import { useAuth } from '../contexts/AuthContext'

interface ApiUser {
  id: number
  fullname: string
  username: string
  email: string
  university: string | null
  major: string | null
  roles: string[]
  createdAt: string
}

interface Pagination {
  totalElements: number
  totalPages: number
  currentPage: number
  hasNext: boolean
  hasPrevious: boolean
}

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

const isNewThisMonth = (dateStr: string) => {
  const d = new Date(dateStr)
  const now = new Date()
  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
}

const getGreeting = () => {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

const Dashboard = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
  const { user } = useAuth()
  const [users, setUsers]           = useState<ApiUser[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [isLoading, setIsLoading]   = useState(true)
  const [error, setError]           = useState('')

  useEffect(() => {
    const load = async () => {
      setIsLoading(true)
      setError('')
      try {
        const res = await apiFetch('/users?page=0&size=10')
        if (!res.ok) {
          setError('Failed to load dashboard data.')
          return
        }
        const json = await res.json()
        setUsers(json.data.items)
        setPagination(json.data.pagination)
      } catch {
        setError('Network error. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  const stats = useMemo(() => {
    const total       = pagination?.totalElements ?? 0
    const students    = users.filter((u) => u.roles.includes('student')).length
    const admins      = users.filter((u) => u.roles.includes('admin')).length
    const newMonth    = users.filter((u) => isNewThisMonth(u.createdAt)).length
    return { total, students, admins, newMonth }
  }, [users, pagination])

  const recentUsers = useMemo(
    () => [...users].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5),
    [users],
  )

  const firstName = user?.fullname?.split(' ')[0] ?? 'Admin'

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-6 py-5 flex items-center justify-between">
        <div>
          <p className="text-indigo-200 text-sm font-medium">{getGreeting()},</p>
          <h2
            className="text-white text-xl font-semibold mt-0.5"
            style={{ fontFamily: '"Sora", system-ui, sans-serif' }}
          >
            {firstName}
          </h2>
          <p className="text-indigo-200 text-sm mt-1">
            Here's what's happening on the platform today.
          </p>
        </div>
        <div className="hidden sm:flex p-3 rounded-2xl bg-white/10">
          <Sparkles size={28} className="text-indigo-200" />
        </div>
      </div>

      {/* Stats */}
      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 border border-slate-100 animate-pulse h-24" />
          ))}
        </div>
      ) : error ? (
        <div className="flex items-center gap-2 text-red-400 text-sm bg-red-50 border border-red-100 rounded-2xl px-4 py-3">
          <AlertCircle size={15} />
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            label="Total Users"
            value={stats.total}
            icon={Users}
            iconBg="bg-indigo-50"
            iconColor="text-indigo-600"
            trend={stats.newMonth > 0 ? { value: stats.newMonth, label: 'joined this month' } : undefined}
          />
          <StatsCard
            label="Students"
            value={stats.students}
            icon={UserCheck}
            iconBg="bg-blue-50"
            iconColor="text-blue-600"
          />
          <StatsCard
            label="Admins"
            value={stats.admins}
            icon={Shield}
            iconBg="bg-rose-50"
            iconColor="text-rose-600"
          />
          <StatsCard
            label="New This Month"
            value={stats.newMonth}
            icon={TrendingUp}
            iconBg="bg-emerald-50"
            iconColor="text-emerald-600"
          />
        </div>
      )}

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent users */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <div>
              <p className="text-sm font-semibold text-slate-800">Recently Joined</p>
              <p className="text-xs text-slate-400 mt-0.5">Latest users on the platform</p>
            </div>
            <button
              onClick={() => onNavigate('users')}
              className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700 font-medium transition-colors cursor-pointer"
            >
              View all <ArrowRight size={12} />
            </button>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12 gap-2 text-slate-400 text-sm">
              <Loader2 size={15} className="animate-spin" />
              Loading…
            </div>
          ) : recentUsers.length === 0 ? (
            <p className="text-center text-slate-400 text-sm py-12">No users yet.</p>
          ) : (
            <ul className="divide-y divide-slate-50">
              {recentUsers.map((u) => (
                <li key={u.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50/60 transition-colors">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                    style={{ backgroundColor: getAvatarColor(String(u.id)) }}
                  >
                    {getInitials(u.fullname)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-medium text-slate-800 truncate">{u.fullname}</p>
                      {isNewThisMonth(u.createdAt) && (
                        <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-full border border-indigo-100 shrink-0">
                          New
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 truncate">@{u.username}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="flex gap-1">
                      {u.roles.map((r) => (
                        <RoleBadge key={r} role={r} />
                      ))}
                    </div>
                    <p className="text-xs text-slate-400 hidden sm:block">{formatDate(u.createdAt)}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Quick actions */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <p className="text-sm font-semibold text-slate-800">Quick Actions</p>
            <p className="text-xs text-slate-400 mt-0.5">Common admin tasks</p>
          </div>
          <div className="p-4 space-y-2">
            {[
              {
                label: 'Manage Users',
                desc: 'View, disable or search users',
                icon: Users,
                color: 'text-indigo-600',
                bg: 'bg-indigo-50',
                page: 'users',
              },
              {
                label: 'Settings',
                desc: 'Configure the admin portal',
                icon: Shield,
                color: 'text-slate-600',
                bg: 'bg-slate-100',
                page: 'settings',
              },
            ].map((action) => (
              <button
                key={action.page}
                onClick={() => onNavigate(action.page)}
                className="w-full flex items-center gap-3 p-3.5 rounded-xl hover:bg-slate-50 transition-colors text-left cursor-pointer group"
              >
                <div className={`p-2 rounded-lg ${action.bg} shrink-0`}>
                  <action.icon size={16} className={action.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800">{action.label}</p>
                  <p className="text-xs text-slate-400">{action.desc}</p>
                </div>
                <ArrowRight size={14} className="text-slate-300 group-hover:text-slate-500 transition-colors shrink-0" />
              </button>
            ))}
          </div>

          {/* Platform note */}
          <div className="mx-4 mb-4 p-3.5 rounded-xl bg-indigo-50 border border-indigo-100">
            <p className="text-xs font-semibold text-indigo-700 mb-0.5">Platform Stats</p>
            <p className="text-xs text-indigo-600">
              {isLoading
                ? 'Loading…'
                : `${pagination?.totalElements ?? 0} registered users across ${pagination?.totalPages ?? 0} pages.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
