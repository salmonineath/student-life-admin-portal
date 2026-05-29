import { useEffect, useState } from 'react'
import {
  Mail,
  Phone,
  Building2,
  BookOpen,
  GraduationCap,
  ShieldCheck,
  Loader2,
  AlertCircle,
  CalendarDays,
  Pencil,
  X,
  CheckCircle,
  AtSign,
  Hash,
} from 'lucide-react'
import { apiFetch } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import { getInitials, getAvatarColor } from '../data/mockUsers'

interface FullProfile {
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
}

interface FormState {
  fullname: string
  phone: string
  university: string
  major: string
  academic_year: string
}

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

const Settings = () => {
  const { refreshUser } = useAuth()

  const [profile, setProfile]       = useState<FullProfile | null>(null)
  const [form, setForm]             = useState<FormState>({ fullname: '', phone: '', university: '', major: '', academic_year: '' })
  const [editing, setEditing]       = useState(false)
  const [isLoading, setLoading]     = useState(true)
  const [isSaving, setSaving]       = useState(false)
  const [loadError, setLoadErr]     = useState('')
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [saveMessage, setSaveMsg]   = useState('')

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setLoadErr('')
      try {
        const res = await apiFetch('/me')
        if (!res.ok) { setLoadErr('Failed to load profile.'); return }
        const json = await res.json()
        const p: FullProfile = json.data
        setProfile(p)
        setForm({
          fullname:      p.fullname      ?? '',
          phone:         p.phone         ?? '',
          university:    p.university    ?? '',
          major:         p.major         ?? '',
          academic_year: p.academicYear  ?? '',
        })
      } catch {
        setLoadErr('Network error. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const startEdit = () => { setEditing(true); setSaveStatus('idle') }

  const cancelEdit = () => {
    setEditing(false)
    setSaveStatus('idle')
    if (profile) {
      setForm({
        fullname:      profile.fullname      ?? '',
        phone:         profile.phone         ?? '',
        university:    profile.university    ?? '',
        major:         profile.major         ?? '',
        academic_year: profile.academicYear  ?? '',
      })
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setSaveStatus('idle')
    try {
      const body: Record<string, string> = {}
      if (form.fullname)      body.fullname      = form.fullname
      if (form.phone)         body.phone         = form.phone
      if (form.university)    body.university    = form.university
      if (form.major)         body.major         = form.major
      if (form.academic_year) body.academic_year = form.academic_year

      const res = await apiFetch('/api/v1/me/update-profile', {
        method: 'PATCH',
        body: JSON.stringify(body),
      })
      const json = await res.json().catch(() => null)

      if (res.ok) {
        setSaveStatus('success')
        setSaveMsg(json?.message ?? 'Profile updated.')
        if (json?.data) setProfile(json.data)
        setEditing(false)
        await refreshUser()
      } else {
        setSaveStatus('error')
        setSaveMsg(json?.message ?? 'Failed to update profile.')
      }
    } catch {
      setSaveStatus('error')
      setSaveMsg('Network error. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24 gap-2.5 text-slate-400 text-sm">
        <Loader2 size={16} className="animate-spin" /> Loading profile…
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="flex items-center gap-2 text-red-400 text-sm bg-red-50 border border-red-100 rounded-2xl px-4 py-3 max-w-sm">
        <AlertCircle size={15} className="shrink-0" /> {loadError}
      </div>
    )
  }

  const avatarBg = getAvatarColor(String(profile?.id ?? 0))

  const fields: { label: string; key: keyof FormState; icon: React.ElementType; value: string | null | undefined; placeholder: string }[] = [
    { label: 'Full Name',      key: 'fullname',      icon: AtSign,        value: profile?.fullname,     placeholder: 'Your full name' },
    { label: 'Phone Number',   key: 'phone',         icon: Phone,         value: profile?.phone,        placeholder: '+855 12 345 678' },
    { label: 'University',     key: 'university',    icon: Building2,     value: profile?.university,   placeholder: 'e.g. RUPP' },
    { label: 'Major',          key: 'major',         icon: BookOpen,      value: profile?.major,        placeholder: 'e.g. Computer Science' },
    { label: 'Academic Year',  key: 'academic_year', icon: GraduationCap, value: profile?.academicYear, placeholder: 'e.g. Year 3' },
  ]

  return (
    <div className="space-y-2">
      {/* Page heading */}
      <div className="mb-6">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Account</p>
        <h1
          className="text-2xl font-bold text-slate-900"
          style={{ fontFamily: '"Sora", system-ui, sans-serif' }}
        >
          My Profile
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-5 items-start">

        {/* ── Left column ── */}
        <div className="flex flex-col gap-4">

          {/* Avatar card */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col items-center text-center">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-md mb-4"
              style={{ backgroundColor: avatarBg }}
            >
              {getInitials(profile?.fullname ?? 'Admin')}
            </div>

            <h2
              className="text-slate-900 text-base font-bold leading-snug"
              style={{ fontFamily: '"Sora", system-ui, sans-serif' }}
            >
              {profile?.fullname}
            </h2>
            <p className="text-slate-400 text-xs mt-0.5">{profile?.username}</p>

            {/* Role dots */}
            <div className="flex gap-1.5 mt-3">
              {profile?.roles.map((r) => (
                <span
                  key={r}
                  className="text-xs px-2.5 py-0.5 rounded-full font-medium border"
                  style={{
                    backgroundColor: r === 'admin' ? '#fef2f2' : '#eef2ff',
                    color:           r === 'admin' ? '#be123c'  : '#4338ca',
                    borderColor:     r === 'admin' ? '#fecdd3'  : '#c7d2fe',
                  }}
                >
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </span>
              ))}
            </div>

            {/* Edit / Save / Cancel */}
            {!editing ? (
              <button
                onClick={startEdit}
                className="mt-5 w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium py-2.5 rounded-xl transition-colors cursor-pointer"
              >
                <Pencil size={13} />
                Edit Profile
              </button>
            ) : (
              <div className="mt-5 w-full flex flex-col gap-2">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-medium py-2.5 rounded-xl transition-colors cursor-pointer"
                >
                  {isSaving
                    ? <><Loader2 size={13} className="animate-spin" /> Saving…</>
                    : <><CheckCircle size={13} /> Save Changes</>}
                </button>
                <button
                  onClick={cancelEdit}
                  className="w-full flex items-center justify-center gap-2 text-slate-500 hover:text-slate-700 text-sm font-medium py-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <X size={13} /> Cancel
                </button>
              </div>
            )}
          </div>

          {/* Quick info card */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-4">
              Quick Info
            </p>
            <div className="space-y-3">
              {[
                { icon: ShieldCheck,   label: 'Role',     value: profile?.roles.join(', ') || '—' },
                { icon: Mail,          label: 'Email',    value: profile?.email             || '—' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center shrink-0">
                    <Icon size={13} className="text-slate-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] text-slate-400">{label}</p>
                    <p className="text-xs font-semibold text-slate-700 truncate">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right column ── */}
        <div className="flex flex-col gap-4">

          {/* Personal information card */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="px-6 pt-6 pb-4">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">Details</p>
              <h3
                className="text-lg font-bold text-slate-900 mt-1"
                style={{ fontFamily: '"Sora", system-ui, sans-serif' }}
              >
                Personal Information
              </h3>
            </div>

            <div className="divide-y divide-slate-100">
              {fields.map(({ label, key, icon: Icon, value, placeholder }) => (
                <div key={key} className="flex items-start gap-4 px-6 py-4">
                  <div className="w-9 h-9 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon size={14} className="text-slate-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-400 mb-1">{label}</p>
                    {editing ? (
                      <input
                        type="text"
                        value={form[key]}
                        onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
                        placeholder={placeholder}
                        className="w-full text-sm font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/20 placeholder-slate-400 transition"
                      />
                    ) : (
                      <p className="text-sm font-semibold text-slate-800">
                        {value || <span className="text-slate-300 font-normal">—</span>}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Save status */}
            {saveStatus !== 'idle' && (
              <div className={`mx-6 mb-5 mt-1 flex items-center gap-2 text-xs rounded-xl px-3.5 py-2.5 ${
                saveStatus === 'success'
                  ? 'bg-emerald-50 border border-emerald-100 text-emerald-700'
                  : 'bg-red-50 border border-red-100 text-red-600'
              }`}>
                {saveStatus === 'success'
                  ? <CheckCircle size={13} className="shrink-0" />
                  : <AlertCircle size={13} className="shrink-0" />}
                {saveMessage}
              </div>
            )}
          </div>

          {/* Coming soon card */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-6 py-10 text-center">
            <p className="text-sm font-semibold text-slate-500">More sections coming soon</p>
            <p className="text-xs text-slate-400 mt-1">Security, preferences, notifications…</p>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Settings
