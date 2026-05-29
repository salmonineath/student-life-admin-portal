import { createContext, useContext, useEffect, useState } from 'react'
import { apiFetch } from '../services/api'

export interface AuthUser {
  id: number
  fullname: string
  username: string
  email: string
  roles: string[]
}

interface AuthContextValue {
  user: AuthUser | null
  isLoading: boolean
  login: (emailOrUsername: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    apiFetch('/me')
      .then(async (res) => {
        if (res.ok) {
          const json = await res.json()
          const me: AuthUser = json.data
          if (me.roles.includes('admin')) {
            setUser(me)
          }
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false))
  }, [])

  const login = async (emailOrUsername: string, password: string) => {
    try {
      const res = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email_or_username: emailOrUsername, password }),
      })
      const json = await res.json()

      if (!json.success) {
        return { success: false, error: json.message ?? 'Invalid credentials.' }
      }

      const loggedIn: AuthUser = json.data.user
      if (!loggedIn.roles.includes('admin')) {
        await apiFetch('/auth/logout', { method: 'POST' })
        return { success: false, error: 'Access denied. This portal is for administrators only.' }
      }

      setUser(loggedIn)
      return { success: true }
    } catch {
      return { success: false, error: 'Unable to connect. Please try again.' }
    }
  }

  const logout = async () => {
    await apiFetch('/auth/logout', { method: 'POST' }).catch(() => {})
    setUser(null)
  }

  const refreshUser = async () => {
    const res = await apiFetch('/me').catch(() => null)
    if (res?.ok) {
      const json = await res.json()
      setUser(json.data)
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
