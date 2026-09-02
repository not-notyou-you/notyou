import { supabase } from '@/lib/supabase'

const SESSION_KEY = 'admin_session'
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000 // 7 days

export interface AdminSession {
  id: string
  username: string
  loggedInAt: number
}

export async function adminLogin(username: string, password: string): Promise<AdminSession> {
  const { data, error } = await supabase.rpc('verify_admin_login', {
    p_username: username,
    p_password: password,
  })
  if (error) throw error

  const row = data?.[0]
  if (!row) throw new Error('Invalid username or password')

  const session: AdminSession = { id: row.id, username: row.username, loggedInAt: Date.now() }
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  return session
}

export function adminLogout() {
  localStorage.removeItem(SESSION_KEY)
}

export function getCurrentSession(): AdminSession | null {
  const raw = localStorage.getItem(SESSION_KEY)
  if (!raw) return null

  try {
    const session = JSON.parse(raw) as AdminSession
    if (Date.now() - session.loggedInAt > SESSION_TTL_MS) {
      localStorage.removeItem(SESSION_KEY)
      return null
    }
    return session
  } catch {
    localStorage.removeItem(SESSION_KEY)
    return null
  }
}
