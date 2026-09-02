// src/pages/public/passion/sections/CreativeWorksSection.tsx
import { useMemo, useRef, useState } from 'react'
import { ImageOrInitials } from '../components/ImageOrInitials'
import { ScrollProgressBar } from '../components/ScrollProgressBar'
import { useHorizontalWheel } from '../hooks/useHorizontalWheel'
import { getOrgInitials } from '@/lib/initials'
import type { PassionModalData } from '../components/PassionModal'
import type { CreativeCategory, CreativeWork } from '@/types'
const CATEGORIES: { value: CreativeCategory; label: string }[] = [
  { value: 'digital', label: 'Digital' },
  { value: 'traditional', label: 'Traditional' },
  { value: 'stickers', label: 'Stickers' },
]
const ALL_VALUE = 'all' as const
type CategoryFilter = CreativeCategory | typeof ALL_VALUE
function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}
// Real-size-driven scale: each tile's height reflects its own image's natural
// pixel height relative to the tallest loaded image in its row (not random).
const MIN_SCALE = 0.6
function useNaturalScales() {
  const [sizes, setSizes] = useState<Record<string, number>>({})
  const report = (id: string, img: HTMLImageElement) => {
    if (img.naturalHeight <= 0) return
    setSizes((prev) => (prev[id] === img.naturalHeight ? prev : { ...prev, [id]: img.naturalHeight }))
  }
  const scaleFor = (rowIds: string[], id: string) => {
    const known = rowIds.map((rid) => sizes[rid]).filter((h): h is number => typeof h === 'number')
    const own = sizes[id]
    if (!own || known.length === 0) return 1
    const max = Math.max(...known)
    return MIN_SCALE + (1 - MIN_SCALE) * (own / max)
  }
  return { report, scaleFor }
}
interface CreativeWorksSectionProps {
  items: CreativeWork[]
  loading: boolean
  onImageClick: (data: PassionModalData) => void
}
export function CreativeWorksSection({ items, loading, onImageClick }: CreativeWorksSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  useHorizontalWheel(scrollRef)
  const available = useMemo(() => CATEGORIES.filter((c) => items.some((i) => i.category === c.value)), [items])
  const [active, setActive] = useState<CategoryFilter>(ALL_VALUE)
  const activeCategory: CategoryFilter =
    active === ALL_VALUE || available.some((c) => c.value === active) ? active : ALL_VALUE
  const filtered = useMemo(
    () => shuffle(activeCategory === ALL_VALUE ? items : items.filter((i) => i.category === activeCategory)),
    [items, activeCategory]
  )
  const topRow = filtered.filter((_, i) => i % 2 === 0)
  const bottomRow = filtered.filter((_, i) => i % 2 === 1)
  const topIds = topRow.map((w) => w.id)
  const bottomIds = bottomRow.map((w) => w.id)
  const { report, scaleFor } = useNaturalScales()
  const renderTile = (work: CreativeWork, rowIds: string[]) => (
    <button
      key={work.id}
      type="button"
      className="passion-scatterable passion-creative-tile"
      style={{ height: `${scaleFor(rowIds, work.id) * 100}%` }}
      onClick={() =>
        onImageClick({
          imageUrl: work.image_url,
          title: work.title,
          subtitle: work.year ? String(work.year) : undefined,
          description: work.description || undefined,
        })
      }
    >
      <ImageOrInitials
        src={work.image_url}
        alt={work.title}
        initials={getOrgInitials(work.title)}
        className="passion-creative-tile__img"
        onLoad={(img) => report(work.id, img)}
      />
    </button>
  )
  return (
    <div className="passion-section-shell">
      <div className="passion-creative-header">
        <div className="passion-box passion-scatterable passion-creative-header__title">
          <h2 className="passion-section__title">Creative Works</h2>
        </div>
        {available.length > 1 && (
          <div className="passion-tabs passion-creative-header__tabs">
            <button
              type="button"
              className={`passion-tab ${activeCategory === ALL_VALUE ? 'passion-tab--active' : ''}`}
              onClick={() => setActive(ALL_VALUE)}
            >
              All
            </button>
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
      {loading && <p className="passion-section__note">Loading…</p>}
      {!loading && filtered.length === 0 && <p className="passion-section__note">No works here yet.</p>}
      {!loading && filtered.length > 0 && (
        <div ref={scrollRef} className="passion-creative-scroll">
          <div className="passion-creative-rows">
            <div className="passion-creative-row passion-creative-row--top">
              {topRow.map((work) => renderTile(work, topIds))}
            </div>
            <div className="passion-creative-row passion-creative-row--bottom">
              {bottomRow.map((work) => renderTile(work, bottomIds))}
            </div>
          </div>
        </div>
      )}
      <ScrollProgressBar targetRef={scrollRef} />
    </div>
  )
}