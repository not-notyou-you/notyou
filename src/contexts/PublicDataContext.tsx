import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { supabase } from '@/lib/supabase'
import type { Profile, Social } from '@/types'

interface PublicDataContextValue {
  profile: Profile | null
  socials: Social[]
  loading: boolean
}

const PublicDataContext = createContext<PublicDataContextValue | undefined>(undefined)

/**
 * Fetches profile + socials exactly once for the whole public site — Header,
 * Footer, and every page all read from here instead of each firing their own
 * query for the same handful of rows.
 */
export function PublicDataProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [socials, setSocials] = useState<Social[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    Promise.all([
      supabase.from('profile').select('*').limit(1).maybeSingle(),
      supabase.from('socials').select('*').order('position', { ascending: true }),
    ]).then(([profileRes, socialsRes]) => {
      if (!mounted) return
      setProfile(profileRes.data)
      setSocials(socialsRes.data || [])
      setLoading(false)
    })

    return () => {
      mounted = false
    }
  }, [])

  return (
    <PublicDataContext.Provider value={{ profile, socials, loading }}>{children}</PublicDataContext.Provider>
  )
}

export function usePublicData() {
  const ctx = useContext(PublicDataContext)
  if (!ctx) throw new Error('usePublicData must be used within a PublicDataProvider')
  return ctx
}
