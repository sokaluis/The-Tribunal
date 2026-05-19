import { createContext, useContext, useEffect, useState } from 'react'
import { getStoredTrialClaims, removeTrialClaims } from '../utils/trialClaims'

export interface AuthUser {
  id: string
  email: string
  displayName: string
  profileSlug: string
  avatarUrl: string | null
}

interface AuthContextValue {
  user: AuthUser | null
  loading: boolean
  signIn: () => void
  signOut: () => Promise<void>
  refresh: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

async function claimStoredTrials() {
  const claims = getStoredTrialClaims()
  if (claims.length === 0) return

  const res = await fetch('/api/auth/claim-trials', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ claims }),
  })

  if (!res.ok) return
  const data = await res.json() as { claimedIds?: string[] }
  removeTrialClaims(data.claimedIds ?? [])
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = async () => {
    try {
      const res = await fetch('/api/auth/me', { credentials: 'include' })
      const data = await res.json() as { user: AuthUser | null }
      setUser(data.user)
      if (data.user) {
        await claimStoredTrials()
      }
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  const signIn = () => {
    const returnTo = `${window.location.pathname}${window.location.search}`
    window.location.href = `/api/auth/google/start?returnTo=${encodeURIComponent(returnTo)}`
  }

  const signOut = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut, refresh }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}

