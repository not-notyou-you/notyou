import { useScrollReveal } from '@/hooks/useScrollReveal'

/** The double-line separator used between every section on the Identity page. */
export function Divider() {
  const { ref, inView } = useScrollReveal<HTMLDivElement>()

  return <div ref={ref} className={`identity-divider ${inView ? 'is-revealed' : ''}`} aria-hidden="true" />
}
