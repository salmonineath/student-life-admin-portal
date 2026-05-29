import type { UserStatus } from '../types'

interface StatusBadgeProps {
  status: UserStatus
}

interface RoleBadgeProps {
  role: string
}

const statusConfig: Record<UserStatus, { label: string; className: string }> = {
  active:    { label: 'Active',    className: 'bg-emerald-50 text-emerald-700 border border-emerald-100' },
  inactive:  { label: 'Inactive',  className: 'bg-slate-100 text-slate-500 border border-slate-200' },
  suspended: { label: 'Suspended', className: 'bg-red-50 text-red-600 border border-red-100' },
}

const roleConfig: Record<string, { label: string; className: string }> = {
  student: { label: 'Student', className: 'bg-blue-50 text-blue-700 border border-blue-100' },
  faculty: { label: 'Faculty', className: 'bg-violet-50 text-violet-700 border border-violet-100' },
  staff:   { label: 'Staff',   className: 'bg-amber-50 text-amber-700 border border-amber-100' },
  admin:   { label: 'Admin',   className: 'bg-rose-50 text-rose-700 border border-rose-100' },
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const config = statusConfig[status]
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${
        status === 'active' ? 'bg-emerald-500' :
        status === 'suspended' ? 'bg-red-500' : 'bg-slate-400'
      }`} />
      {config.label}
    </span>
  )
}

export const RoleBadge = ({ role }: RoleBadgeProps) => {
  const config = roleConfig[role] ?? {
    label: role.charAt(0).toUpperCase() + role.slice(1),
    className: 'bg-slate-100 text-slate-600 border border-slate-200',
  }
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  )
}
