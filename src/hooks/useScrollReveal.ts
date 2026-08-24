import { useEffect, useRef, useState } from 'react'

/**
 * Attach `ref` to an element; `inView` flips to true the first time it crosses
 * the threshold, then stays true (entrance-style reveal, not a repeating toggle).
 * Matches the spec: threshold 0.1, rootMargin "0px 0px -50px 0px".
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T | null>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Respect prefers-reduced-motion: just show content immediately, no
    // observer needed since there's nothing to animate into view.
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setInView(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return { ref, inView }
}
