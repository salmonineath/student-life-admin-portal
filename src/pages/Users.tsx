import { useState, useEffect, useMemo } from 'react'
import {
  Users as UsersIcon,
  UserCheck,
  Shield,
  UserX,
  Eye,
  Ban,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  X,
  CheckCircle,
  Loader2,
  AlertCircle,
} from 'lucide-react'
import StatsCard from '../components/StatsCard'
import { RoleBadge } from '../components/StatusBadge'
import { getInitials, getAvatarColor } from '../data/mockUsers'
import { apiFetch } from '../services/api'

interface ApiUser {
  id: number
  fullname: string
  username: string
  email: string
  phone: string | null
  university: string | null
  major: string | null
  academicYear: string | null
  roles: string[]
  createdAt: string
  updatedAt: string
}

interface Pagination {
  currentPage: number
  pageSize: number
  totalElements: number
  totalPages: number
  hasNext: boolean
  hasPrevious: boolean
}

type Toast = { id: number; message: string; type: 'success' | 'info' | 'error' }

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

const isNewThisMonth = (dateStr: string) => {
  const d = new Date(dateStr)
  const now = new Date()
  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
}

const Users = () => {
  const [users, setUsers]           = useState<ApiUser[]>([])
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1, pageSize: 10, totalElements: 0, totalPages: 1, hasNext: false, hasPrevious: false,
  })
  const [page, setPage]             = useState(0) // 0-based for the API
  const [search, setSearch]         = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [isLoading, setIsLoading]   = useState(true)
  const [error, setError]           = useState('')
  const [toasts, setToasts]         = useState<Toast[]>([])
  const [toastCounter, setCounter]  = useState(0)
  const [disabling, setDisabling]   = useState<number | null>(null)

  const addToast = (message: string, type: Toast['type'] = 'success') => {
    const id = toastCounter + 1
    setCounter(id)
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500)
  }

  const fetchUsers = async (p: number) => {
    setIsLoading(true)
    setError('')
    try {
      const res = await apiFetch(`/users?page=${p}&size=10`)
      if (!res.ok) {
        const json = await res.json().catch(() => null)
        setError(json?.message ?? 'Failed to load users.')
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

  useEffect(() => { fetchUsers(page) }, [page])

  const stats = useMemo(() => ({
    total:        pagination.totalElements,
    students:     users.filter((u) => u.roles.includes('student')).length,
    admins:       users.filter((u) => u.roles.includes('admin')).length,
    newThisMonth: users.filter((u) => isNewThisMonth(u.createdAt)).length,
  }), [users, pagination.totalElements])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return users.filter((u) => {
      const matchSearch =
        !q ||
        u.fullname.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q)
      const matchRole = roleFilter === 'all' || u.roles.includes(roleFilter)
      return matchSearch && matchRole
    })
  }, [users, search, roleFilter])

  const handleDisable = async (user: ApiUser) => {
    setDisabling(user.id)
    try {
      const res = await apiFetch(`/users/${user.id}/disable`, { method: 'PUT' })
      const json = await res.json().catch(() => null)
      if (res.ok) {
        addToast(`${user.fullname} has been disabled.`)
        fetchUsers(page)
      } else {
        addToast(json?.message ?? 'Failed to disable user.', 'error')
      }
    } catch {
      addToast('Network error.', 'error')
    } finally {
      setDisabling(null)
    }
  }

  const handleView = (user: ApiUser) => {
    addToast(`${user.fullname} · ${user.username} · ${user.email}`, 'info')
  }

  const hasFilters = search || roleFilter !== 'all'

  const pageNumbers = useMemo(() => {
    const cur = pagination.currentPage
    const total = pagination.totalPages
    const start = Math.max(1, cur - 2)
    const end   = Math.min(total, cur + 2)
    return Array.from({ length: end - start + 1 }, (_, i) => start + i)
  }, [pagination.currentPage, pagination.totalPages])

  return (
    <div className="space-y-5">
      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          label="Total Users"
          value={stats.total}
          icon={UsersIcon}
          iconBg="bg-indigo-50"
          iconColor="text-indigo-600"
          trend={stats.newThisMonth > 0 ? { value: stats.newThisMonth, label: 'joined this month' } : undefined}
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
          label="Other Roles"
          value={users.length - stats.students - stats.admins}
          icon={UserX}
          iconBg="bg-slate-100"
          iconColor="text-slate-500"
        />
      </div>

      {/* Table card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="text-sm font-semibold text-slate-800">All Users</span>
            <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full font-medium">
              {isLoading ? '…' : filtered.length}
            </span>
          </div>

          {/* Role filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 text-slate-600 bg-white outline-none focus:border-indigo-400 cursor-pointer"
          >
            <option value="all">All roles</option>
            <option value="student">Students</option>
            <option value="faculty">Faculty</option>
            <option value="staff">Staff</option>
            <option value="admin">Admins</option>
          </select>

          {hasFilters && (
            <button
              onClick={() => { setSearch(''); setRoleFilter('all') }}
              className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 border border-slate-200 rounded-lg px-2.5 py-1.5 transition-colors cursor-pointer"
            >
              <X size={12} /> Clear
            </button>
          )}

          <button
            onClick={() => addToast('Add user — coming soon.', 'info')}
            className="flex items-center gap-1.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-3.5 py-1.5 rounded-xl transition-colors cursor-pointer ml-auto"
          >
            <UserPlus size={14} />
            Add User
          </button>
        </div>

        {/* Search bar */}
        <div className="px-5 py-3 border-b border-slate-50">
          <input
            type="text"
            placeholder="Search by name, username or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-700 placeholder-slate-400 outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/20 transition"
          />
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16 gap-2.5 text-slate-400 text-sm">
            <Loader2 size={16} className="animate-spin" />
            Loading users…
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-16 gap-2.5 text-red-400 text-sm">
            <AlertCircle size={16} />
            {error}
            <button
              onClick={() => fetchUsers(page)}
              className="underline hover:no-underline ml-1 cursor-pointer"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide px-5 py-3">User</th>
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide px-3 py-3">Role</th>
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide px-3 py-3">University / Major</th>
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide px-3 py-3">Joined</th>
                  <th className="text-right text-xs font-semibold text-slate-400 uppercase tracking-wide px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center text-slate-400 py-12 text-sm">
                      No users match your filters.
                    </td>
                  </tr>
                ) : (
                  filtered.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50/60 transition-colors group">
                      {/* User */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                            style={{ backgroundColor: getAvatarColor(String(user.id)) }}
                          >
                            {getInitials(user.fullname)}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <p className="font-medium text-slate-800 truncate">{user.fullname}</p>
                              {isNewThisMonth(user.createdAt) && (
                                <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-full border border-indigo-100 shrink-0">
                                  New
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-400 truncate">@{user.username} · {user.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Roles */}
                      <td className="px-3 py-3.5">
                        <div className="flex flex-wrap gap-1">
                          {user.roles.map((role) => (
                            <RoleBadge key={role} role={role} />
                          ))}
                        </div>
                      </td>

                      {/* University / Major */}
                      <td className="px-3 py-3.5 text-xs">
                        <p className="text-slate-600 truncate max-w-[180px]">{user.university ?? '—'}</p>
                        {user.major && (
                          <p className="text-slate-400 truncate max-w-[180px]">{user.major}</p>
                        )}
                      </td>

                      {/* Joined */}
                      <td className="px-3 py-3.5 text-slate-500 text-xs whitespace-nowrap">
                        {formatDate(user.createdAt)}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleView(user)}
                            title="View"
                            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            onClick={() => handleDisable(user)}
                            title="Disable user"
                            disabled={disabling === user.id}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 disabled:opacity-40 transition-colors cursor-pointer"
                          >
                            {disabling === user.id
                              ? <Loader2 size={14} className="animate-spin" />
                              : <Ban size={14} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!isLoading && !error && (
          <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-100">
            <p className="text-xs text-slate-400">
              Page {pagination.currentPage} of {pagination.totalPages} · {pagination.totalElements} users total
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={!pagination.hasPrevious}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <ChevronLeft size={16} />
              </button>
              {pageNumbers.map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p - 1)}
                  className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    p === pagination.currentPage
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={!pagination.hasNext}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Toast notifications */}
      <div className="fixed bottom-5 right-5 space-y-2 z-50 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg text-sm font-medium pointer-events-auto animate-in slide-in-from-bottom-2 ${
              toast.type === 'success' ? 'bg-slate-900 text-white' :
              toast.type === 'error'   ? 'bg-red-600 text-white' :
              'bg-white text-slate-700 border border-slate-200'
            }`}
          >
            {toast.type === 'success' && <CheckCircle size={14} className="text-emerald-400 shrink-0" />}
            {toast.type === 'error'   && <AlertCircle size={14} className="text-red-200 shrink-0" />}
            {toast.type === 'info'    && <Eye size={14} className="text-indigo-400 shrink-0" />}
            {toast.message}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Users
