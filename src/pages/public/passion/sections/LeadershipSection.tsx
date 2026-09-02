// src/pages/public/passion/sections/LeadershipSection.tsx
import { useMemo, useRef } from 'react'
import { ImageOrInitials } from '../components/ImageOrInitials'
import { ScrollProgressBar } from '../components/ScrollProgressBar'
import { useHorizontalWheel } from '../hooks/useHorizontalWheel'
import { generateLeadershipCardShape } from '../utils/jaggedClipPath'
import { getOrgInitials } from '@/lib/initials'
import type { PassionModalData } from '../components/PassionModal'
import type { Leadership } from '@/types'
interface LeadershipSectionProps {
  items: Leadership[]
  loading: boolean
  photoUrl: string | null | undefined
  personName: string
  onImageClick: (data: PassionModalData) => void
}
function LeadershipCard({
  item,
  photoUrl,
  personName,
  onImageClick,
}: {
  item: Leadership
  photoUrl: string | null | undefined
  personName: string
  onImageClick: (data: PassionModalData) => void
}) {
  const { cardClipPath, photoClipPath, roleFlourishClipPath } = useMemo(() => generateLeadershipCardShape(), [item.id])
  const resolvedImage = item.image_url || photoUrl || null
  return (
    <article className="passion-leadership-card" style={{ clipPath: cardClipPath }}>
      <button
        type="button"
        className="passion-leadership-card__photo"
        style={{ clipPath: photoClipPath }}
        onClick={() =>
          onImageClick({
            imageUrl: resolvedImage,
            title: item.organization,
            subtitle: item.position,
            description: item.description,
            achievements: item.achievements || undefined,
            icon: item.icon_type,
          })
        }
      >
        <ImageOrInitials src={resolvedImage} alt={`${item.organization} — ${personName}`} initials={getOrgInitials(item.organization)} />
      </button>
      <div className="passion-leadership-card__org-band">{item.organization}</div>
      <div className="passion-leadership-card__role-band">
        {item.position}
        <div className="passion-leadership-card__role-flourish" style={{ clipPath: roleFlourishClipPath }} />
      </div>
    </article>
  )
}
export function LeadershipSection({ items, loading, photoUrl, personName, onImageClick }: LeadershipSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  useHorizontalWheel(scrollRef)
  return (
    <div className="passion-section-shell">
      <div className="passion-box passion-scatterable passion-section-shell__header">
        <h2 className="passion-section__title">Leadership &amp; Committees</h2>
      </div>
      <div ref={scrollRef} className="passion-scroll-h passion-scroll-h--bleed">
        {loading && <p className="passion-section__note">Loading…</p>}
        {!loading && items.length === 0 && <p className="passion-section__note">No leadership roles yet.</p>}
        {!loading &&
          items.map((item) => (
            <LeadershipCard key={item.id} item={item} photoUrl={photoUrl} personName={personName} onImageClick={onImageClick} />
          ))}
      </div>
      <ScrollProgressBar targetRef={scrollRef} />
    </div>
  )
}