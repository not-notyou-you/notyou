// src/pages/public/passion/sections/GallerySection.tsx
import { useRef } from 'react'
import type { RefObject } from 'react'
import { ImageOrInitials } from '../components/ImageOrInitials'
import { ScrollProgressBar } from '../components/ScrollProgressBar'
import { useHorizontalWheel } from '../hooks/useHorizontalWheel'
import { useDragToScroll } from '../hooks/useDragToScroll'
import { useAutoScrollRow } from '../hooks/useAutoScrollRow'
import { useMediaQuery } from '../hooks/useMediaQuery'
import type { PassionModalData } from '../components/PassionModal'
import type { CarouselPhoto } from '@/types'
interface GallerySectionProps {
  items: CarouselPhoto[]
  loading: boolean
  paused: boolean
  onImageClick: (data: PassionModalData) => void
}
interface GalleryRowProps {
  scrollRef: RefObject<HTMLDivElement>
  items: CarouselPhoto[]
  direction: 'left' | 'right'
  paused: boolean
  onImageClick: (data: PassionModalData) => void
}
function GalleryRow({ scrollRef, items, direction, paused, onImageClick }: GalleryRowProps) {
  useHorizontalWheel(scrollRef)
  useDragToScroll(scrollRef)
  useAutoScrollRow(scrollRef, { direction, paused, itemCount: items.length })
  const renderCard = (photo: CarouselPhoto, keySuffix: string) => (
    <button
      key={`${photo.id}${keySuffix}`}
      type="button"
      className="passion-scatterable passion-gallery-card"
      onClick={() =>
        onImageClick({
          imageUrl: photo.image_url,
          title: photo.caption || 'Untitled',
          subtitle: photo.event_or_context || undefined,
        })
      }
    >
      <ImageOrInitials
        src={photo.image_url}
        alt={photo.caption || 'Gallery photo'}
        initials="•"
        className="passion-gallery-card__img"
      />
    </button>
  )
  return (
    <div
      ref={scrollRef}
      className="passion-scroll-h passion-scroll-h--bleed passion-scroll-h--draggable passion-gallery-row"
    >
      {items.map((photo) => renderCard(photo, '-a'))}
      {items.map((photo) => renderCard(photo, '-b'))}
    </div>
  )
}
export function GallerySection({ items, loading, paused, onImageClick }: GallerySectionProps) {
  const isMobileOrTablet = useMediaQuery('(max-width: 1024px)')
  const secondRowDirection = isMobileOrTablet ? 'left' : 'right'
  const rowARef = useRef<HTMLDivElement>(null)
  const rowBRef = useRef<HTMLDivElement>(null)
  return (
    <div className="passion-section-shell">
      <div className="passion-box passion-scatterable passion-section-shell__header">
        <h2 className="passion-section__title">Random Activity</h2>
      </div>
      {loading && <p className="passion-section__note">Loading…</p>}
      {!loading && items.length === 0 && <p className="passion-section__note">No photos yet.</p>}
      {!loading && items.length > 0 && (
        <div className="passion-gallery-rows">
          <GalleryRow scrollRef={rowARef} items={items} direction="right" paused={paused} onImageClick={onImageClick} />
          {isMobileOrTablet && (
            <GalleryRow
              scrollRef={rowBRef}
              items={items}
              direction={secondRowDirection}
              paused={paused}
              onImageClick={onImageClick}
            />
          )}
        </div>
      )}
      <ScrollProgressBar targetRef={rowARef} />
    </div>
  )
}
