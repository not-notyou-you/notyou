import { useCallback, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Profile } from '@/types'

/** There is exactly one row in `profile`. Fetch it, update it — never create/delete. */
export function useProfile() {
  const [data, setData] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data: result, error: err } = await supabase.from('profile').select('*').limit(1).maybeSingle()
      if (err) throw err
      setData(result)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load profile.')
    } finally {
      setLoading(false)
    }
  }, [])

  const save = async (payload: Partial<Profile>) => {
    if (!data) throw new Error('Profile has not loaded yet.')
    const { data: result, error: err } = await supabase
      .from('profile')
      .update(payload)
      .eq('id', data.id)
      .select()
    if (err) throw err
    setData(result[0])
    return result[0]
  }

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, error, fetchData, save }
}
