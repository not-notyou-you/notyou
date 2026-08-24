import type { ReactNode } from 'react'
import { useScrollReveal } from '@/hooks/useScrollReveal'

interface RevealOnScrollProps {
  children: ReactNode
  index?: number
  staggerMs?: number
  className?: string
}

/** Wraps a card/item so it fades + slides up the first time it scrolls into view. */
export function RevealOnScroll({ children, index = 0, staggerMs = 100, className = '' }: RevealOnScrollProps) {
  const { ref, inView } = useScrollReveal<HTMLDivElement>()

  return (
    <div
      ref={ref}
      className={`scroll-reveal ${inView ? 'is-revealed' : ''} ${className}`}
      style={{ animationDelay: inView ? `${index * staggerMs}ms` : undefined }}
    >
      {children}
    </div>
  )
}
