// src/pages/public/passion/sections/ContactSection.tsx
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { PassionFooter } from '@/components/public/footer/PassionFooter'
import { PassionLoader } from '../components/PassionLoader'
import { useFooterData } from '@/hooks/useFooterData'
interface Rect {
  left: number
  top: number
  width: number
  height: number
}
const GAP = 16
const MAX_NEIGHBOR_GAP = 80
const RANDOM_ATTEMPTS = 200
const GRID_STEP = 12
function overlaps(a: Rect, b: Rect, gap: number) {
  return !(
    a.left + a.width + gap < b.left ||
    b.left + b.width + gap < a.left ||
    a.top + a.height + gap < b.top ||
    b.top + b.height + gap < a.top
  )
}
function edgeGap(a: Rect, b: Rect): number {
  const dx = Math.max(a.left - (b.left + b.width), b.left - (a.left + a.width), 0)
  const dy = Math.max(a.top - (b.top + b.height), b.top - (a.top + a.height), 0)
  return Math.sqrt(dx * dx + dy * dy)
}
function nearestGap(rect: Rect, placed: Rect[]): number {
  if (placed.length === 0) return 0
  return Math.min(...placed.map((p) => edgeGap(rect, p)))
}
function overlapArea(a: Rect, b: Rect, gap: number) {
  const aLeft = a.left - gap / 2
  const aTop = a.top - gap / 2
  const aRight = a.left + a.width + gap / 2
  const aBottom = a.top + a.height + gap / 2
  const bLeft = b.left - gap / 2
  const bTop = b.top - gap / 2
  const bRight = b.left + b.width + gap / 2
  const bBottom = b.top + b.height + gap / 2
  const overlapWidth = Math.max(0, Math.min(aRight, bRight) - Math.max(aLeft, bLeft))
  const overlapHeight = Math.max(0, Math.min(aBottom, bBottom) - Math.max(aTop, bTop))
  return overlapWidth * overlapHeight
}
function findPosition(
  width: number,
  height: number,
  containerWidth: number,
  containerHeight: number,
  placed: Rect[],
  gap: number
): { left: number; top: number } {
  const maxLeft = Math.max(0, containerWidth - width)
  const maxTop = Math.max(0, containerHeight - height)
  const fitsWell = (rect: Rect) =>
    !placed.some((p) => overlaps(rect, p, gap)) && nearestGap(rect, placed) <= MAX_NEIGHBOR_GAP
  const fitsLoosely = (rect: Rect) => !placed.some((p) => overlaps(rect, p, gap))
  for (let attempt = 0; attempt < RANDOM_ATTEMPTS; attempt++) {
    const left = Math.random() * maxLeft
    const top = Math.random() * maxTop
    const rect: Rect = { left, top, width, height }
    if (fitsWell(rect)) return { left, top }
  }
  for (let top = 0; top <= maxTop; top += GRID_STEP) {
    for (let left = 0; left <= maxLeft; left += GRID_STEP) {
      const rect: Rect = { left, top, width, height }
      if (fitsWell(rect)) return { left, top }
    }
  }
  for (let top = 0; top <= maxTop; top += GRID_STEP) {
    for (let left = 0; left <= maxLeft; left += GRID_STEP) {
      const rect: Rect = { left, top, width, height }
      if (fitsLoosely(rect)) return { left, top }
    }
  }
  let bestLeft = 0
  let bestTop = 0
  let bestOverlap = Infinity
  for (let top = 0; top <= maxTop; top += GRID_STEP) {
    for (let left = 0; left <= maxLeft; left += GRID_STEP) {
      const rect: Rect = { left, top, width, height }
      const total = placed.reduce((sum, p) => sum + overlapArea(rect, p, gap), 0)
      if (total < bestOverlap) {
        bestOverlap = total
        bestLeft = left
        bestTop = top
      }
    }
  }
  return { left: bestLeft, top: bestTop }
}
export function ContactSection() {
  const { profile, socials, loading, error } = useFooterData()
  const containerRef = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)
  const [loaderProgress, setLoaderProgress] = useState(0)
  useEffect(() => {
    if (!loading) {
      setLoaderProgress(100)
      return
    }
    setLoaderProgress(0)
    let raf = 0
    const start = performance.now()
    const tick = (t: number) => {
      const elapsed = t - start
      setLoaderProgress(Math.min(92, (elapsed / 1200) * 100))
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [loading])
  useLayoutEffect(() => {
    if (loading || error || !profile) return
    const container = containerRef.current
    if (!container) return
    setReady(false)
    const raf = requestAnimationFrame(() => {
      const boxes = Array.from(container.querySelectorAll<HTMLElement>('.footer-passion__box'))
      if (boxes.length === 0) return
      // offsetWidth/offsetHeight (layout size) — not getBoundingClientRect, which
      // reports the post-transform painted size and reads as near-zero while the
      // parent panel is still mid scale-in from its enter animation.
      const containerWidth = container.offsetWidth
      const containerHeight = container.offsetHeight
      const placed: Rect[] = []
      boxes.forEach((box) => {
        const width = box.offsetWidth
        const height = box.offsetHeight
        const { left, top } = findPosition(width, height, containerWidth, containerHeight, placed, GAP)
        placed.push({ left, top, width, height })
        box.style.left = `${left}px`
        box.style.top = `${top}px`
      })
      setReady(true)
    })
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, error, profile, socials])
  if (loading || error || !profile) {
    return (
      <div className="passion-contact-field">
        <PassionLoader progress={loaderProgress} />
      </div>
    )
  }
  return (
    <div ref={containerRef} className={`passion-contact-field ${ready ? 'passion-contact-field--ready' : ''}`}>
      <div className="passion-contact-panel footer-passion">
        <PassionFooter profile={profile} socials={socials} />
      </div>
    </div>
  )
}