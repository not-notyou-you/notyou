// src/pages/public/intellect/components/CertificationCard.tsx
import { useState } from 'react'
import { getOrgInitials } from '@/lib/initials'
import { ImageOrInitials } from './ImageOrInitials'
import { IntellectDetailModal } from './IntellectDetailModal'
import type { Certification } from '@/types'
interface CertificationCardProps {
  certification: Certification
}
export function CertificationCard({ certification }: CertificationCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const links = certification.certification_url
    ? [{ label: 'View credential', url: certification.certification_url }]
    : []
  return (
    <article className="intellect-glass intellect-glass--blue intellect-cert-card">
      <button
        type="button"
        className="intellect-cert-card__cover"
        onClick={() => setIsModalOpen(true)}
        aria-label={`View ${certification.title} details`}
      >
        <ImageOrInitials
          src={certification.image_url}
          alt={certification.title}
          initials={getOrgInitials(certification.issuer)}
          className="intellect-cert-card__img"
        />
      </button>
      <div className="intellect-cert-card__body">
        <h3 className="intellect-cert-card__title">{certification.title}</h3>
        <p className="intellect-cert-card__issuer">
          {certification.issuer}
          {certification.year ? ` · ${certification.year}` : ''}
        </p>
        {certification.certification_url && (
          <a href={certification.certification_url} target="_blank" rel="noopener noreferrer" className="intellect-link">
            View credential
          </a>
        )}
      </div>
      {isModalOpen && (
        <IntellectDetailModal
          title={certification.title}
          subtitle={certification.issuer}
          meta={certification.year ? String(certification.year) : undefined}
          imageUrl={certification.image_url}
          imageAlt={certification.title}
          imageInitials={getOrgInitials(certification.issuer)}
          description={certification.skills || undefined}
          links={links}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </article>
  )
}