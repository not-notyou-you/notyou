// src/pages/public/passion/sections/GallerySection.tsx
import { useRef } from 'react'
import { ImageOrInitials } from '../components/ImageOrInitials'
import { useHorizontalWheel } from '../hooks/useHorizontalWheel'
import type { CarouselPhoto } from '@/types'
export function GallerySection({ items, loading }: { items: CarouselPhoto[]; loading: boolean }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  useHorizontalWheel(scrollRef)
  return (
    <div className="passion-section-shell">
      <div className="passion-box passion-section-shell__header">
        <h2 className="passion-section__title">Gallery</h2>
      </div>
      <div ref={scrollRef} className="passion-scroll-h">
        {loading && <p className="passion-section__note">Loading…</p>}
        {!loading && items.length === 0 && <p className="passion-section__note">No photos yet.</p>}
        {!loading &&
          items.map((photo) => (
            <figure key={photo.id} className="passion-box passion-gallery-card">
              <ImageOrInitials
                src={photo.image_url}
                alt={photo.caption || 'Gallery photo'}
                initials="•"
                className="passion-gallery-card__img"
              />
              {photo.caption && <figcaption className="passion-gallery-card__caption">{photo.caption}</figcaption>}
              {photo.event_or_context && <div className="passion-gallery-card__context">{photo.event_or_context}</div>}
            </figure>
          ))}
      </div>
    </div>
  )
}