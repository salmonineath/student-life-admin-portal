import { useState, type FormEvent } from 'react'
import { Shield, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const Login = () => {
  const { login } = useAuth()
  const [emailOrUsername, setEmailOrUsername] = useState('')
  const [password, setPassword]               = useState('')
  const [showPassword, setShowPassword]       = useState(false)
  const [error, setError]                     = useState('')
  const [isLoading, setIsLoading]             = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!emailOrUsername.trim() || !password) return

    setError('')
    setIsLoading(true)
    const result = await login(emailOrUsername.trim(), password)
    setIsLoading(false)

    if (!result.success) {
      setError(result.error ?? 'Something went wrong.')
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: '#0F172A' }}
    >
      {/* Card */}
      <div className="w-full max-w-sm">
        {/* Branding */}
        <div className="flex flex-col items-center mb-8">
          <div className="p-3 rounded-2xl bg-indigo-500/20 mb-4">
            <Shield size={28} className="text-indigo-400" />
          </div>
          <h1
            className="text-white text-2xl font-semibold tracking-tight"
            style={{ fontFamily: '"Sora", system-ui, sans-serif' }}
          >
            Student Life
          </h1>
          <p className="text-slate-400 text-sm mt-1">Admin Portal</p>
        </div>

        {/* Form card */}
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-7">
          <h2 className="text-slate-100 text-lg font-semibold mb-1">Sign in</h2>
          <p className="text-slate-400 text-sm mb-6">Enter your admin credentials to continue.</p>

          {error && (
            <div className="flex items-start gap-2.5 rounded-xl bg-red-500/10 border border-red-500/20 px-3.5 py-3 mb-5 text-red-400 text-sm">
              <AlertCircle size={15} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-slate-300 text-xs font-medium mb-1.5" htmlFor="identifier">
                Email or Username
              </label>
              <input
                id="identifier"
                type="text"
                autoComplete="username"
                value={emailOrUsername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full rounded-xl bg-white/5 border border-white/10 text-slate-100 placeholder-slate-600 text-sm px-3.5 py-2.5 outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 transition"
              />
            </div>

            <div>
              <label className="block text-slate-300 text-xs font-medium mb-1.5" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-xl bg-white/5 border border-white/10 text-slate-100 placeholder-slate-600 text-sm px-3.5 py-2.5 pr-10 outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !emailOrUsername.trim() || !password}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium py-2.5 mt-2 transition-colors"
            >
              {isLoading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Signing in…
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-slate-600 text-xs mt-6">
          Restricted to authorized administrators only.
        </p>
      </div>
    </div>
  )
}

export default Login
