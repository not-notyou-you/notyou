// src/pages/public/identity/sections/EducationSection.tsx
import { EducationCard } from '../components/EducationCard'
import type { Education } from '@/types'

export function EducationSection({ items, loading }: { items: Education[]; loading: boolean }) {
  if (loading || items.length === 0) return null
  return (
    <section className="identity-section identity-section--gallery" aria-labelledby="education-title">
      <div className="identity-section__title-rail">
        <h2 id="education-title" className="identity-section__title identity-section__title--side">
          Education
        </h2>
      </div>
      <div className="identity-section__list">
        {items.map((item) => (
          <EducationCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  )
}