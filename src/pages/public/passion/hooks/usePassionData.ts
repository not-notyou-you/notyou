// src/pages/public/passion/hooks/usePassionData.ts
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { PageContent } from '@/types'
export function usePassionData() {
  const [pageContent, setPageContent] = useState<PageContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const { data, error: err } = await supabase
          .from('page_content')
          .select('*')
          .eq('page_slug', 'passion')
          .maybeSingle()
        if (err) throw err
        if (!mounted) return
        setPageContent(data)
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
  return { pageContent, loading, error }
}