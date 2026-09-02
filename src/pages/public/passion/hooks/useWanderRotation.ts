// src/pages/public/passion/hooks/useWanderRotation.ts
import { useEffect, useRef, useState } from 'react'
function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min
}
function easeInOutSine(t: number) {
  return -(Math.cos(Math.PI * t) - 1) / 2
}
function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
}
export function useWanderRotation(min = -5, max = 5, minDurationMs = 1600, maxDurationMs = 3200) {
  const [angle, setAngle] = useState(() => randomBetween(min, max))
  const rafRef = useRef(0)
  const currentRef = useRef(angle)
  useEffect(() => {
    if (prefersReducedMotion()) return
    let cancelled = false
    const runStep = () => {
      if (cancelled) return
      const from = currentRef.current
      const target = randomBetween(min, max)
      const duration = randomBetween(minDurationMs, maxDurationMs)
      const start = performance.now()
      const frame = (t: number) => {
        if (cancelled) return
        const progress = Math.min(1, (t - start) / duration)
        const eased = easeInOutSine(progress)
        const value = from + (target - from) * eased
        currentRef.current = value
        setAngle(value)
        if (progress < 1) {
          rafRef.current = requestAnimationFrame(frame)
        } else {
          runStep()
        }
      }
      rafRef.current = requestAnimationFrame(frame)
    }
    runStep()
    return () => {
      cancelled = true
      cancelAnimationFrame(rafRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [min, max, minDurationMs, maxDurationMs])
  return angle
}