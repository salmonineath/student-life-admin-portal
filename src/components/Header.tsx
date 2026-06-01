import { Bell } from 'lucide-react'

interface HeaderProps {
  title: string
  subtitle?: string
}

const Header = ({ title, subtitle }: HeaderProps) => {
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
        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500" />
      </button>

      <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold cursor-pointer select-none">
        SA
      </div>
    </header>
  )
}

export default Header
