// src/pages/public/identity/components/ExperienceCard.tsx
import { useState } from 'react'
import { IdentityImage } from './IdentityImage'
import { PhotoModal } from './PhotoModal'
import { getOrgInitials } from '@/lib/initials'
import type { Experience } from '@/types'

export function ExperienceCard({ item }: { item: Experience }) {
  const [expanded, setExpanded] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const dateRange = [item.start_date, item.end_date].filter(Boolean).join(' - ')
  const photoUrl = item.logo_url

  return (
    <article className={`identity-card${expanded ? ' identity-card--expanded' : ''}`}>
      <div className="identity-card__photo" onClick={() => photoUrl && setModalOpen(true)}>
        <IdentityImage src={photoUrl} alt={`${item.company} photo`} initials={getOrgInitials(item.company)} size="card" />
      </div>
      <div
        className="identity-card__body"
        role="button"
        tabIndex={0}
        onClick={() => setExpanded((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setExpanded((v) => !v)
          }
        }}
      >
        <div className="identity-card__heading">
          <div>
            <h3 className="identity-card__title">{item.company}</h3>
            <div className="identity-card__position">{item.position}</div>
          </div>
          <span className="identity-card__toggle" aria-hidden="true" />
        </div>
        {(dateRange || item.duration) && (
          <div className="identity-card__date-row">
            {dateRange && <span>{dateRange}</span>}
            {item.duration && <span>{item.duration}</span>}
          </div>
        )}
        {item.location && (
          <div className="identity-card__location">
            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M12 21s-6.5-6.1-6.5-10.5A6.5 6.5 0 0 1 18.5 10.5C18.5 14.9 12 21 12 21z" />
              <circle cx="12" cy="10.5" r="2" />
            </svg>
            <span>{item.location}</span>
          </div>
        )}
        {expanded && item.description && (
          <div className="identity-card__expand" onClick={(e) => e.stopPropagation()}>
            <div className="identity-card__divider" />
            <p className="identity-card__details">{item.description}</p>
          </div>
        )}
      </div>
      {modalOpen && photoUrl && <PhotoModal src={photoUrl} alt={`${item.company} photo`} onClose={() => setModalOpen(false)} />}
    </article>
  )
}