// src/pages/public/passion/hooks/useNonOverlapLayout.ts
import { useLayoutEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'
interface Rect {
  left: number
  top: number
  width: number
  height: number
}
function overlaps(a: Rect, b: Rect, gap: number) {
  return !(
    a.left + a.width + gap < b.left ||
    b.left + b.width + gap < a.left ||
    a.top + a.height + gap < b.top ||
    b.top + b.height + gap < a.top
  )
}
export function useNonOverlapLayout(
  containerRef: RefObject<HTMLDivElement>,
  itemRefs: RefObject<Array<HTMLDivElement | null>>,
  count: number,
  gap = 18
) {
  const [positions, setPositions] = useState<{ left: number; top: number }[] | null>(null)
  const seedRef = useRef(0)
  useLayoutEffect(() => {
    seedRef.current += 1
    const currentSeed = seedRef.current
    setPositions(null)
    const raf = requestAnimationFrame(() => {
      if (seedRef.current !== currentSeed) return
      const container = containerRef.current
      if (!container) return
      const containerRect = container.getBoundingClientRect()
      const placed: Rect[] = []
      const result: { left: number; top: number }[] = []
      for (let i = 0; i < count; i++) {
        const el = itemRefs.current?.[i]
        const width = el ? el.offsetWidth : 220
        const height = el ? el.offsetHeight : 90
        const maxLeft = Math.max(0, containerRect.width - width)
        const maxTop = Math.max(0, containerRect.height - height)
        let left = Math.random() * maxLeft
        let top = Math.random() * maxTop
        let attempts = 0
        let rect: Rect = { left, top, width, height }
        while (attempts < 80 && placed.some((p) => overlaps(rect, p, gap))) {
          left = Math.random() * maxLeft
          top = Math.random() * maxTop
          rect = { left, top, width, height }
          attempts += 1
        }
        placed.push(rect)
        result.push({ left, top })
      }
      setPositions(result)
    })
    return () => cancelAnimationFrame(raf)
  }, [containerRef, itemRefs, count, gap])
  return positions
}