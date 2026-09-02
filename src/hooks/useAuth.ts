import { useEffect, useState } from 'react'
import { adminLogin, adminLogout, getCurrentSession, type AdminSession } from '@/lib/auth'

export function useAuth() {
  const [session, setSession] = useState<AdminSession | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setSession(getCurrentSession())
    setLoading(false)
  }, [])

  const login = async (username: string, password: string) => {
    const result = await adminLogin(username, password)
    setSession(result)
    return result
  }

  const logout = () => {
    adminLogout()
    setSession(null)
  }

  return { user: session, loading, isAuthenticated: !!session, login, logout }
}
