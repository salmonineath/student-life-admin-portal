import { Bell, Search } from 'lucide-react'

interface HeaderProps {
  title: string
  subtitle?: string
  searchValue: string
  onSearchChange: (value: string) => void
}

const Header = ({ title, subtitle, searchValue, onSearchChange }: HeaderProps) => {
  return (
    <header className="bg-white border-b border-slate-100 px-6 py-4 flex items-center gap-4 shrink-0">
      <div className="flex-1">
        <h1 className="text-lg font-bold text-slate-900" style={{ fontFamily: '"Sora", system-ui, sans-serif' }}>
          {title}
        </h1>
        {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
      </div>

      {/* Search */}
      <div className="relative w-64">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search users..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-8 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-400 focus:bg-white transition-colors placeholder-slate-400"
        />
      </div>

      {/* Notification bell */}
      <button className="relative p-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer">
        <Bell size={18} className="text-slate-500" />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500" />
      </button>

      {/* Admin avatar */}
      <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold cursor-pointer select-none">
        SA
      </div>
    </header>
  )
}

export default Header
