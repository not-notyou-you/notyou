// src/pages/public/identity/components/ExperienceCard.tsx
import { useState } from 'react'
import { IdentityImage } from './IdentityImage'
import { DetailModal } from './DetailModal'
import { getOrgInitials } from '@/lib/initials'
import type { Experience } from '@/types'

export function ExperienceCard({ item }: { item: Experience }) {
  const [detailOpen, setDetailOpen] = useState(false)
  const dateRange = [item.start_date, item.end_date].filter(Boolean).join(' - ')
  const logoUrl = item.logo_url
  const photoUrl = item.image_url
  const metaLines = [dateRange, item.duration, item.location].filter(Boolean) as string[]

  return (
    <>
      <article
        className="identity-card"
        role="button"
        tabIndex={0}
        aria-label={`View details for ${item.company}`}
        onClick={() => setDetailOpen(true)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setDetailOpen(true)
          }
        }}
      >
        <div className="identity-card__photo">
          <IdentityImage src={logoUrl} alt={`${item.company} photo`} initials={getOrgInitials(item.company)} size="card" />
          {photoUrl && (
            <div className="identity-card__badge">
              <img src={photoUrl} alt={`${item.company} photo`} />
            </div>
          )}
        </div>
        <div className="identity-card__body">
          <div className="identity-card__heading">
            <div>
              <h3 className="identity-card__title">{item.company}</h3>
              <div className="identity-card__position">{item.position}</div>
            </div>
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
        </div>
      </article>
      {detailOpen && (
        <DetailModal
          photoSrc={photoUrl}
          photoAlt={`${item.company} photo`}
          photoInitials={getOrgInitials(item.company)}
          badgeSrc={logoUrl}
          badgeAlt={`${item.company} logo`}
          title={item.company}
          subtitle={item.position}
          metaLines={metaLines}
          description={item.description}
          onClose={() => setDetailOpen(false)}
        />
      )}
    </>
  )
}