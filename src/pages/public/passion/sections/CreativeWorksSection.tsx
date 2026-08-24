// src/pages/public/passion/sections/CreativeWorksSection.tsx
import { useMemo, useRef, useState } from 'react'
import { getOrgInitials } from '@/lib/initials'
import { ImageOrInitials } from '../components/ImageOrInitials'
import { useHorizontalWheel } from '../hooks/useHorizontalWheel'
import type { CreativeCategory, CreativeWork } from '@/types'
const CATEGORIES: { value: CreativeCategory; label: string }[] = [
  { value: 'digital', label: 'Digital' },
  { value: 'traditional', label: 'Traditional' },
  { value: 'stickers', label: 'Stickers' },
]
export function CreativeWorksSection({ items, loading }: { items: CreativeWork[]; loading: boolean }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  useHorizontalWheel(scrollRef)
  const available = useMemo(() => CATEGORIES.filter((c) => items.some((i) => i.category === c.value)), [items])
  const [active, setActive] = useState<CreativeCategory | null>(null)
  const activeCategory = active && available.some((c) => c.value === active) ? active : available[0]?.value ?? null
  const filtered = activeCategory ? items.filter((i) => i.category === activeCategory) : items
  return (
    <div className="passion-section-shell">
      <div className="passion-box passion-section-shell__header">
        <h2 className="passion-section__title">Creative Works</h2>
        {available.length > 1 && (
          <div className="passion-tabs">
            {available.map((cat) => (
              <button
                key={cat.value}
                type="button"
                className={`passion-tab ${activeCategory === cat.value ? 'passion-tab--active' : ''}`}
                onClick={() => setActive(cat.value)}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}
      </div>
      <div ref={scrollRef} className="passion-scroll-h">
        {loading && <p className="passion-section__note">Loading…</p>}
        {!loading && filtered.length === 0 && <p className="passion-section__note">No works here yet.</p>}
        {!loading &&
          filtered.map((work) => (
            <article key={work.id} className="passion-box passion-creative-card">
              <ImageOrInitials
                src={work.image_url}
                alt={work.title}
                initials={getOrgInitials(work.title)}
                className="passion-creative-card__img"
              />
              <h3 className="passion-creative-card__title">
                {work.title}
                {work.year && <span className="passion-creative-card__year">{work.year}</span>}
              </h3>
              {work.description && <p className="passion-creative-card__desc">{work.description}</p>}
              {work.project_link && (
                <a href={work.project_link} target="_blank" rel="noopener noreferrer" className="passion-creative-card__link">
                  View work
                </a>
              )}
            </article>
          ))}
      </div>
    </div>
  )
}