// src/pages/public/identity/components/EducationCard.tsx
import { useState } from 'react'
import { IdentityImage } from './IdentityImage'
import { PhotoModal } from './PhotoModal'
import { getOrgInitials } from '@/lib/initials'
import type { Education } from '@/types'

export function EducationCard({ item }: { item: Education }) {
  const [expanded, setExpanded] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const dateRange = `${item.start_year ?? '—'} - ${item.end_year ?? 'Present'}`
  const degreeField = [item.degree, item.field].filter(Boolean).join(' · ')
  const photoUrl = item.image_url

  return (
    <article className={`identity-card${expanded ? ' identity-card--expanded' : ''}`}>
      <div className="identity-card__photo" onClick={() => photoUrl && setModalOpen(true)}>
        <IdentityImage src={photoUrl} alt={`${item.institution} photo`} initials={getOrgInitials(item.institution)} size="card" />
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
          <h3 className="identity-card__title">{item.institution}</h3>
          <span className="identity-card__toggle" aria-hidden="true" />
        </div>
        {degreeField && <div className="identity-card__meta">{degreeField}</div>}
        <div className="identity-card__subheader">{dateRange}</div>
        {expanded && item.details && (
          <div className="identity-card__expand" onClick={(e) => e.stopPropagation()}>
            <div className="identity-card__divider" />
            <p className="identity-card__details">{item.details}</p>
          </div>
        )}
      </div>
      {modalOpen && photoUrl && <PhotoModal src={photoUrl} alt={`${item.institution} photo`} onClose={() => setModalOpen(false)} />}
    </article>
  )
}