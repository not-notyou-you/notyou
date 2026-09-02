// src/pages/public/passion/components/ScrollProgressBar.tsx
import { useEffect, useState } from 'react'
import type { RefObject } from 'react'
export function ScrollProgressBar({ targetRef }: { targetRef: RefObject<HTMLElement> }) {
  const [ratio, setRatio] = useState(0)
  useEffect(() => {
    const el = targetRef.current
    if (!el) return
    const update = () => {
      const max = el.scrollWidth - el.clientWidth
      setRatio(max > 0 ? el.scrollLeft / max : 0)
    }
    update()
    el.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      el.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [targetRef])
  return (
    <div className="passion-scroll-progress">
      <div className="passion-scroll-progress__thumb" style={{ left: `${ratio * 100}%` }} />
    </div>
  )
}