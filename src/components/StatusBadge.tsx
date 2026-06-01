import type { UserStatus } from '../types'

interface StatusBadgeProps {
  status: UserStatus
}

interface RoleBadgeProps {
  role: string
}

const statusConfig: Record<UserStatus, { label: string; className: string }> = {
  active:    { label: 'Active',    className: 'bg-emerald-100 text-emerald-800 border border-emerald-200' },
  inactive:  { label: 'Inactive',  className: 'bg-slate-200 text-slate-700 border border-slate-300' },
  suspended: { label: 'Suspended', className: 'bg-red-100 text-red-800 border border-red-200' },
}

const roleConfig: Record<string, { label: string; className: string }> = {
  student: { label: 'Student', className: 'bg-blue-100 text-blue-800 border border-blue-200' },
  faculty: { label: 'Faculty', className: 'bg-violet-100 text-violet-800 border border-violet-200' },
  staff:   { label: 'Staff',   className: 'bg-amber-100 text-amber-800 border border-amber-200' },
  admin:   { label: 'Admin',   className: 'bg-rose-100 text-rose-800 border border-rose-200' },
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const config = statusConfig[status]
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${
        status === 'active' ? 'bg-emerald-600' :
        status === 'suspended' ? 'bg-red-600' : 'bg-slate-500'
      }`} />
      {config.label}
    </span>
  )
}

export const RoleBadge = ({ role }: RoleBadgeProps) => {
  const config = roleConfig[role] ?? {
    label: role.charAt(0).toUpperCase() + role.slice(1),
    className: 'bg-slate-200 text-slate-700 border border-slate-300',
  }
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  )
}
