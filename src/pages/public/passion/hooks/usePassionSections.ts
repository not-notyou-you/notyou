// src/pages/public/passion/hooks/usePassionSections.ts
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { CarouselPhoto, CreativeWork, Leadership } from '@/types'
/** RLS already filters to is_visible = true for the public/anon role, so no
 *  client-side visibility filtering is needed here (same assumption as
 *  useIdentitySections / useIntellectData). */
export function usePassionSections() {
  const [leadership, setLeadership] = useState<Leadership[]>([])
  const [creativeWorks, setCreativeWorks] = useState<CreativeWork[]>([])
  const [carouselPhotos, setCarouselPhotos] = useState<CarouselPhoto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const [leadershipRes, creativeRes, photoRes] = await Promise.all([
          supabase.from('leadership').select('*').order('position_order', { ascending: true }),
          supabase.from('creative_works').select('*').order('position', { ascending: true }),
          supabase.from('carousel_photos').select('*').order('position', { ascending: true }),
        ])
        if (leadershipRes.error) throw leadershipRes.error
        if (creativeRes.error) throw creativeRes.error
        if (photoRes.error) throw photoRes.error
        if (!mounted) return
        setLeadership(leadershipRes.data || [])
        setCreativeWorks(creativeRes.data || [])
        setCarouselPhotos(photoRes.data || [])
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
  return { leadership, creativeWorks, carouselPhotos, loading, error }
}