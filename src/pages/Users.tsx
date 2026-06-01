import { useState, useEffect, useMemo } from 'react'
import {
  Users as UsersIcon,
  UserCheck,
  Shield,
  UserX,
  Eye,
  Ban,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  X,
  Loader2,
  AlertCircle,
} from 'lucide-react'
import StatsCard from '../components/StatsCard'
import { StatusBadge, RoleBadge } from '../components/StatusBadge'
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
  isActive: boolean
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
type ConfirmModal = { user: ApiUser; action: 'disable' | 'enable' }

const isNew = (dateStr: string) => {
  return Date.now() - new Date(dateStr).getTime() < 7 * 24 * 60 * 60 * 1000
}

const Users = () => {
  const [users, setUsers] = useState<ApiUser[]>([])
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1, pageSize: 10, totalElements: 0, totalPages: 1, hasNext: false, hasPrevious: false,
  })
  const [page, setPage] = useState(0)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebounced] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [toasts, setToasts] = useState<Toast[]>([])
  const [toastCounter, setCounter] = useState(0)
  const [toggling, setToggling] = useState<number | null>(null)
  const [confirmModal, setConfirmModal] = useState<ConfirmModal | null>(null)

  const addToast = (message: string, type: Toast['type'] = 'success') => {
    const id = toastCounter + 1
    setCounter(id)
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500)
  }

  useEffect(() => {
    const t = setTimeout(() => {
      setDebounced(search)
      setPage(0)
    }, 350)
    return () => clearTimeout(t)
  }, [search])

  const fetchUsers = async (p: number, q: string, role: string) => {
    setIsLoading(true)
    setError('')
    try {
      const params = new URLSearchParams({ page: String(p), size: '10', sort: 'createdAt,desc' })
      if (q) params.set('search', q)
      if (role !== 'all') params.set('role', role)
      const res = await apiFetch(`/users?${params}`)
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

  useEffect(() => { fetchUsers(page, debouncedSearch, roleFilter) }, [page, debouncedSearch, roleFilter])

  const handleRoleChange = (value: string) => {
    setRoleFilter(value)
    setPage(0)
  }

  const stats = useMemo(() => ({
    total: pagination.totalElements,
    students: users.filter(u => u.roles.includes('student')).length,
    admins: users.filter(u => u.roles.includes('admin')).length,
    newThisWeek: users.filter(u => isNew(u.createdAt)).length,
  }), [users, pagination.totalElements])

  const hasFilters = debouncedSearch || roleFilter !== 'all'

  const handleConfirm = async () => {
    if (!confirmModal) return
    const { user, action } = confirmModal
    setConfirmModal(null)
    setToggling(user.id)
    try {
      const res = await apiFetch(`/users/${user.id}/${action}`, { method: 'PUT' })
      const json = await res.json().catch(() => null)
      if (res.ok) {
        addToast(`${user.fullname} has been ${action === 'disable' ? 'deactivated' : 'reactivated'}.`)
        fetchUsers(page, debouncedSearch, roleFilter)
      } else {
        addToast(json?.message ?? `Failed to ${action === 'disable' ? 'deactivate' : 'reactivate'} user.`, 'error')
      }
    } catch {
      addToast('Network error.', 'error')
    } finally {
      setToggling(null)
    }
  }

  const handleView = (user: ApiUser) => {
    addToast(`${user.fullname} · ${user.username} · ${user.email}`, 'info')
  }

  const pageNumbers = useMemo(() => {
    const cur = pagination.currentPage
    const total = pagination.totalPages
    const start = Math.max(1, cur - 2)
    const end = Math.min(total, cur + 2)
    return Array.from({ length: end - start + 1 }, (_, i) => start + i)
  }, [pagination.currentPage, pagination.totalPages])

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          label="Total Users"
          value={stats.total}
          icon={UsersIcon}
          iconBg="bg-indigo-100"
          iconColor="text-indigo-700"
          trend={stats.newThisWeek > 0 ? { value: stats.newThisWeek, label: 'joined this week' } : undefined}
        />
        <StatsCard
          label="Students"
          value={stats.students}
          icon={UserCheck}
          iconBg="bg-blue-100"
          iconColor="text-blue-700"
        />
        <StatsCard
          label="Admins"
          value={stats.admins}
          icon={Shield}
          iconBg="bg-rose-100"
          iconColor="text-rose-700"
        />
        <StatsCard
          label="Other Roles"
          value={users.length - stats.students - stats.admins}
          icon={UserX}
          iconBg="bg-slate-200"
          iconColor="text-slate-600"
        />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 px-5 py-4 border-b border-slate-200">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="text-sm font-semibold text-slate-800">All Users</span>
            <span className="text-xs text-slate-600 bg-slate-200 px-2 py-0.5 rounded-full font-medium">
              {isLoading ? '…' : pagination.totalElements}
            </span>
          </div>

          <select
            value={roleFilter}
            onChange={e => handleRoleChange(e.target.value)}
            className="text-sm border border-slate-300 rounded-lg px-3 py-1.5 text-slate-700 bg-white outline-none focus:border-indigo-400 cursor-pointer"
          >
            <option value="all">All roles</option>
            <option value="student">Students</option>
            <option value="admin">Admins</option>
          </select>

          {hasFilters && (
            <button
              onClick={() => { setSearch(''); setRoleFilter('all') }}
              className="flex items-center gap-1 text-xs text-slate-600 hover:text-slate-800 border border-slate-300 rounded-lg px-2.5 py-1.5 transition-colors cursor-pointer"
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

        <div className="px-5 py-3 border-b border-slate-200">
          <input
            type="text"
            placeholder="Search by name, username or email…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full text-sm bg-slate-100 border border-slate-300 rounded-xl px-3.5 py-2 text-slate-800 placeholder-slate-500 outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/20 transition"
          />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16 gap-2.5 text-slate-500 text-sm">
            <Loader2 size={16} className="animate-spin" />
            Loading users…
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-16 gap-2.5 text-red-600 text-sm">
            <AlertCircle size={16} />
            {error}
            <button
              onClick={() => fetchUsers(page, debouncedSearch, roleFilter)}
              className="underline hover:no-underline ml-1 cursor-pointer"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200">
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3">User</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-3 py-3">Role</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-3 py-3">Status</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-3 py-3">University / Major</th>
                  <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center text-slate-500 py-12 text-sm">
                      No users match your filters.
                    </td>
                  </tr>
                ) : (
                  users.map(user => (
                    <tr key={user.id} className="hover:bg-slate-50 transition-colors group">
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
                              {isNew(user.createdAt) && (
                                <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-100 px-1.5 py-0.5 rounded-full border border-indigo-200 shrink-0">
                                  New
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 truncate">{user.username} · {user.email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-3 py-3.5">
                        <div className="flex flex-wrap gap-1">
                          {user.roles.map(role => (
                            <RoleBadge key={role} role={role} />
                          ))}
                        </div>
                      </td>

                      <td className="px-3 py-3.5">
                        <StatusBadge status={user.isActive ? 'active' : 'inactive'} />
                      </td>

                      <td className="px-3 py-3.5 text-xs">
                        <p className="text-slate-700 truncate max-w-[180px]">{user.university ?? '—'}</p>
                        {user.major && (
                          <p className="text-slate-500 truncate max-w-[180px]">{user.major}</p>
                        )}
                      </td>

                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleView(user)}
                            title="View"
                            className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-600 hover:text-slate-800 transition-colors cursor-pointer"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            onClick={() => setConfirmModal({ user, action: user.isActive ? 'disable' : 'enable' })}
                            title={user.isActive ? 'Deactivate user' : 'Reactivate user'}
                            disabled={toggling === user.id}
                            className={`p-1.5 rounded-lg disabled:opacity-40 transition-colors cursor-pointer ${
                              user.isActive
                                ? 'hover:bg-red-100 text-slate-500 hover:text-red-600'
                                : 'hover:bg-emerald-100 text-slate-500 hover:text-emerald-600'
                            }`}
                          >
                            {toggling === user.id
                              ? <Loader2 size={14} className="animate-spin" />
                              : user.isActive ? <Ban size={14} /> : <CheckCircle size={14} />}
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

        {!isLoading && !error && (
          <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-200">
            <p className="text-xs text-slate-500">
              Page {pagination.currentPage} of {pagination.totalPages} · {pagination.totalElements} users total
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={!pagination.hasPrevious}
                className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <ChevronLeft size={16} />
              </button>
              {pageNumbers.map(p => (
                <button
                  key={p}
                  onClick={() => setPage(p - 1)}
                  className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    p === pagination.currentPage
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={!pagination.hasNext}
                className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {confirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6">
            <h3 className="text-base font-semibold text-slate-800">
              {confirmModal.action === 'disable' ? 'Deactivate user?' : 'Reactivate user?'}
            </h3>
            <p className="text-sm text-slate-500 mt-2">
              {confirmModal.action === 'disable'
                ? `${confirmModal.user.fullname} will no longer be able to log in.`
                : `${confirmModal.user.fullname} will regain access to the platform.`}
            </p>
            <div className="flex gap-3 mt-6 justify-end">
              <button
                onClick={() => setConfirmModal(null)}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 border border-slate-300 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className={`px-4 py-2 text-sm font-medium text-white rounded-xl transition-colors cursor-pointer ${
                  confirmModal.action === 'disable'
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                Yes, {confirmModal.action === 'disable' ? 'deactivate' : 'reactivate'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-5 right-5 space-y-2 z-50 pointer-events-none">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg text-sm font-medium pointer-events-auto animate-in slide-in-from-bottom-2 ${
              toast.type === 'success' ? 'bg-slate-900 text-white' :
              toast.type === 'error' ? 'bg-red-600 text-white' :
              'bg-white text-slate-800 border border-slate-300'
            }`}
          >
            {toast.type === 'success' && <CheckCircle size={14} className="text-emerald-400 shrink-0" />}
            {toast.type === 'error' && <AlertCircle size={14} className="text-red-200 shrink-0" />}
            {toast.type === 'info' && <Eye size={14} className="text-indigo-500 shrink-0" />}
            {toast.message}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Users
