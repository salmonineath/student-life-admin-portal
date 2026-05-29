import type { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  label: string
  value: number
  icon: LucideIcon
  iconBg: string
  iconColor: string
  trend?: { value: number; label: string }
}

const StatsCard = ({ label, value, icon: Icon, iconBg, iconColor, trend }: StatsCardProps) => {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-start gap-4 hover:shadow-md transition-shadow duration-200">
      <div className={`p-3 rounded-xl ${iconBg} shrink-0`}>
        <Icon size={20} className={iconColor} />
      </div>
      <div className="min-w-0">
        <p className="text-sm text-slate-500 font-medium">{label}</p>
        <p className="text-2xl font-bold text-slate-900 mt-0.5" style={{ fontFamily: '"Sora", system-ui, sans-serif' }}>
          {value.toLocaleString()}
        </p>
        {trend && (
          <p className="text-xs text-emerald-600 font-medium mt-1">
            +{trend.value} {trend.label}
          </p>
        )}
      </div>
    </div>
  )
}

export default StatsCard
