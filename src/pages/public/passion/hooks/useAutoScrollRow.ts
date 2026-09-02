// src/pages/public/passion/hooks/useAutoScrollRow.ts
import { useEffect, useRef } from 'react'
import type { RefObject } from 'react'
const AUTOPLAY_SPEED = 36
const WHEEL_RESUME_DELAY_MS = 500
const RESUME_RAMP_MS = 700
const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3)
/** Drives an infinitely-looping, auto-scrolling horizontal row. Content must
 *  be rendered twice back-to-back (see GallerySection) so that wrapping the
 *  scroll position by half the scrollWidth is visually seamless — the second
 *  copy is identical to the first, so the wrap never shows a jump/cut.
 *  A drag/touch pauses autoplay only while the pointer is down and resumes
 *  the instant it's released; a wheel gesture (no discrete release event)
 *  resumes after a short debounce once scrolling stops. Either way it eases
 *  back up to full speed rather than snapping. */
export function useAutoScrollRow(
  ref: RefObject<HTMLDivElement>,
  { direction, paused, itemCount }: { direction: 'left' | 'right'; paused: boolean; itemCount: number }
) {
  const userPausedRef = useRef(false)
  const wheelResumeTimeoutRef = useRef<number>()
  const resumeStartedAtRef = useRef<number | null>(null)
  const initializedRef = useRef(false)
  useEffect(() => {
    initializedRef.current = false
  }, [itemCount])
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let raf = 0
    let last = performance.now()
    const wrap = (value: number, half: number) => {
      if (half <= 0) return value
      let v = value % half
      if (v < 0) v += half
      return v
    }
    const step = (t: number) => {
      const dt = (t - last) / 1000
      last = t
      const half = el.scrollWidth / 2
      if (half > 0) {
        if (!initializedRef.current) {
          initializedRef.current = true
          el.scrollLeft = direction === 'right' ? half : 0
        }
        if (!userPausedRef.current && !paused) {
          let speedFactor = 1
          if (resumeStartedAtRef.current !== null) {
            const elapsed = t - resumeStartedAtRef.current
            if (elapsed < RESUME_RAMP_MS) {
              speedFactor = easeOutCubic(elapsed / RESUME_RAMP_MS)
            } else {
              resumeStartedAtRef.current = null
            }
          }
          const delta = AUTOPLAY_SPEED * speedFactor * dt
          el.scrollLeft = wrap(el.scrollLeft + (direction === 'left' ? delta : -delta), half)
        } else {
          el.scrollLeft = wrap(el.scrollLeft, half)
        }
      }
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    const resume = () => {
      userPausedRef.current = false
      resumeStartedAtRef.current = performance.now()
    }
    const pause = () => {
      userPausedRef.current = true
      resumeStartedAtRef.current = null
      window.clearTimeout(wheelResumeTimeoutRef.current)
    }
    const onWheel = () => {
      pause()
      wheelResumeTimeoutRef.current = window.setTimeout(resume, WHEEL_RESUME_DELAY_MS)
    }
    const onPointerDown = () => {
      pause()
      window.addEventListener('pointerup', resume, { once: true })
      window.addEventListener('pointercancel', resume, { once: true })
    }
    const onTouchStart = () => {
      pause()
      el.addEventListener('touchend', resume, { once: true })
      el.addEventListener('touchcancel', resume, { once: true })
    }
    el.addEventListener('wheel', onWheel, { passive: true })
    el.addEventListener('pointerdown', onPointerDown)
    el.addEventListener('touchstart', onTouchStart, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(wheelResumeTimeoutRef.current)
      el.removeEventListener('wheel', onWheel)
      el.removeEventListener('pointerdown', onPointerDown)
      el.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('pointerup', resume)
      window.removeEventListener('pointercancel', resume)
      el.removeEventListener('touchend', resume)
      el.removeEventListener('touchcancel', resume)
    }
  }, [ref, direction, paused])
}
