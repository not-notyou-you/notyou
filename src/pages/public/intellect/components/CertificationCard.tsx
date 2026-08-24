// src/pages/public/intellect/components/CertificationCard.tsx
import { getOrgInitials } from '@/lib/initials'
import { ImageOrInitials } from './ImageOrInitials'
import type { Certification } from '@/types'

interface CertificationCardProps {
  certification: Certification
}

export function CertificationCard({ certification }: CertificationCardProps) {
  return (
    <article className="intellect-glass intellect-glass--blue intellect-cert-card">
      <ImageOrInitials
        src={certification.image_url}
        alt={certification.title}
        initials={getOrgInitials(certification.issuer)}
        className="intellect-cert-card__img"
      />
      <div className="intellect-cert-card__body">
        <h3 className="intellect-cert-card__title">{certification.title}</h3>
        <p className="intellect-cert-card__issuer">
          {certification.issuer}
          {certification.year ? ` · ${certification.year}` : ''}
        </p>
        {certification.skills && <p className="intellect-cert-card__skills">{certification.skills}</p>}
        {certification.certification_url && (
          <a href={certification.certification_url} target="_blank" rel="noopener noreferrer" className="intellect-link">View credential</a>
        )}
      </div>
    </article>
  )
}