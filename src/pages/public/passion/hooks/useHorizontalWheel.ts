// src/pages/public/passion/hooks/useHorizontalWheel.ts
import { useEffect } from 'react'
import type { RefObject } from 'react'
/** Lets a vertical mouse-wheel gesture scroll a horizontal container — same
 *  pattern IdentityPage uses for its horizontal scroller. */
export function useHorizontalWheel(ref: RefObject<HTMLElement>) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return
      if (el.scrollWidth <= el.clientWidth) return
      e.preventDefault()
      el.scrollLeft += e.deltaY
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [ref])
}