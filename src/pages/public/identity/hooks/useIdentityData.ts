import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Education, Experience, Language } from '@/types'

/**
 * Profile itself comes from PublicDataContext (shared with Header/Footer) —
 * this hook only covers the three list sections unique to the Identity page.
 * RLS already filters to is_visible = true rows for the public/anon role, so
 * no client-side filtering is needed here.
 */
export function useIdentitySections() {
  const [education, setEducation] = useState<Education[]>([])
  const [experience, setExperience] = useState<Experience[]>([])
  const [languages, setLanguages] = useState<Language[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    async function load() {
      try {
        const [eduRes, expRes, langRes] = await Promise.all([
          supabase.from('education').select('*').order('position', { ascending: true }),
          supabase.from('experience').select('*').order('position_order', { ascending: true }),
          supabase.from('languages').select('*').order('position', { ascending: true }),
        ])
        if (eduRes.error) throw eduRes.error
        if (expRes.error) throw expRes.error
        if (langRes.error) throw langRes.error
        if (!mounted) return
        setEducation(eduRes.data || [])
        setExperience(expRes.data || [])
        setLanguages(langRes.data || [])
      } catch (e) {
        if (mounted) setError(e instanceof Error ? e.message : 'Failed to load data.')
      } finally {
        if (mounted) setLoading(false)
      }
    }

    load()
    return () => {
      mounted = false
    }
  }, [])

  return { education, experience, languages, loading, error }
}
