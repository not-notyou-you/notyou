// src/pages/public/identity/components/EducationCard.tsx
import { useState } from 'react'
import { IdentityImage } from './IdentityImage'
import { DetailModal } from './DetailModal'
import { getOrgInitials } from '@/lib/initials'
import type { Education } from '@/types'

export function EducationCard({ item }: { item: Education }) {
  const [detailOpen, setDetailOpen] = useState(false)
  const dateRange = `${item.start_year ?? '—'} - ${item.end_year ?? 'Present'}`
  const degreeField = [item.degree, item.field].filter(Boolean).join(' · ')
  const photoUrl = item.image_url
  const logoUrl = item.logo_url

  return (
    <>
      <article
        className="identity-card"
        role="button"
        tabIndex={0}
        aria-label={`View details for ${item.institution}`}
        onClick={() => setDetailOpen(true)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setDetailOpen(true)
          }
        }}
      >
        <div className="identity-card__photo">
          <IdentityImage src={photoUrl} alt={`${item.institution} photo`} initials={getOrgInitials(item.institution)} size="card" />
          {logoUrl && (
            <div className="identity-card__badge">
              <img src={logoUrl} alt={`${item.institution} logo`} />
            </div>
          )}
        </div>
        <div className="identity-card__body">
          <div className="identity-card__heading">
            <h3 className="identity-card__title">{item.institution}</h3>
          </div>
          {degreeField && <div className="identity-card__meta">{degreeField}</div>}
          <div className="identity-card__subheader">{dateRange}</div>
        </div>
      </article>
      {detailOpen && (
        <DetailModal
          photoSrc={photoUrl}
          photoAlt={`${item.institution} photo`}
          photoInitials={getOrgInitials(item.institution)}
          badgeSrc={logoUrl}
          badgeAlt={`${item.institution} logo`}
          title={item.institution}
          subtitle={degreeField}
          metaLines={[dateRange]}
          description={item.details}
          onClose={() => setDetailOpen(false)}
        />
      )}
    </>
  )
}