// src/pages/public/identity/sections/ExperienceSection.tsx
import { ExperienceCard } from '../components/ExperienceCard'
import type { Experience } from '@/types'

export function ExperienceSection({ items, loading }: { items: Experience[]; loading: boolean }) {
  if (loading || items.length === 0) return null
  return (
    <section className="identity-section identity-section--gallery identity-section--lines-bg" aria-labelledby="experience-title">
      <div className="identity-section__title-rail">
        <h2 id="experience-title" className="identity-section__title identity-section__title--side">
          Experience
        </h2>
      </div>
      <div className="identity-section__list">
        {items.map((item) => (
          <ExperienceCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  )
}