// src/hooks/usePageReady.ts
import { useEffect, useState } from 'react'
import { preloadImagesWithProgress } from '@/lib/preloadImages'

interface UsePageReadyOptions {
  dataLoading: boolean
  imageUrls: string[]
  dataWeight?: number
}

interface UsePageReadyResult {
  ready: boolean
  progress: number
}

export function usePageReady({ dataLoading, imageUrls, dataWeight = 0.2 }: UsePageReadyOptions): UsePageReadyResult {
  const [progress, setProgress] = useState(0)
  const [ready, setReady] = useState(false)
  const urlsKey = imageUrls.join('|')

  useEffect(() => {
    let cancelled = false
    let raf = 0

    if (dataLoading) {
      setReady(false)
      const start = performance.now()
      const tick = (t: number) => {
        const elapsed = t - start
        const fake = Math.min(dataWeight - 0.02, (elapsed / 4000) * dataWeight)
        if (!cancelled) setProgress(fake)
        raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
      return () => cancelAnimationFrame(raf)
    }

    setProgress(dataWeight)
    preloadImagesWithProgress(imageUrls, (ratio) => {
      if (!cancelled) setProgress(dataWeight + ratio * (1 - dataWeight))
    }).then(() => {
      if (!cancelled) {
        setProgress(1)
        setReady(true)
      }
    })

    return () => {
      cancelled = true
    }
  }, [dataLoading, urlsKey, dataWeight])

  return { ready, progress: Math.min(100, Math.round(progress * 100)) }
}