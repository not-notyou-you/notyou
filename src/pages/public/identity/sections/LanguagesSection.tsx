// src/pages/public/identity/sections/LanguagesSection.tsx
import { LanguageCard } from '../components/LanguageCard'
import type { Language } from '@/types'

export function LanguagesSection({ items, loading }: { items: Language[]; loading: boolean }) {
  if (loading || items.length === 0) return null
  return (
    <section className="identity-section" aria-labelledby="languages-title">
      <div className="identity-section__title-sticky">
        <h2 id="languages-title" className="identity-section__title">
          Languages
        </h2>
      </div>
      <div className="identity-languages-grid">
        {items.map((item) => (
          <LanguageCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  )
}