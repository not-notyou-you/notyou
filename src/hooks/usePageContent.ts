import { useCallback, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { PageContent, PageSlug } from '@/types'

/**
 * `page_content` has exactly one row per page_slug (identity/intellect/passion),
 * seeded up front — so this hook is a single-record read + upsert, not a list.
 */
export function usePageContent(slug: PageSlug) {
  const [data, setData] = useState<PageContent | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data: result, error: err } = await supabase
        .from('page_content')
        .select('*')
        .eq('page_slug', slug)
        .maybeSingle()
      if (err) throw err
      setData(result)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load page content.')
    } finally {
      setLoading(false)
    }
  }, [slug])

  const save = async (payload: Partial<PageContent>) => {
    const { data: result, error: err } = await supabase
      .from('page_content')
      .upsert({ page_slug: slug, ...payload }, { onConflict: 'page_slug' })
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
