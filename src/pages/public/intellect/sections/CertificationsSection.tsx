// src/pages/public/intellect/sections/CertificationsSection.tsx
import { CertificationCard } from '../components/CertificationCard'
import type { Certification } from '@/types'

interface CertificationsSectionProps {
  certifications: Certification[]
}

export function CertificationsSection({ certifications }: CertificationsSectionProps) {
  if (certifications.length === 0) return null
  return (
    <section className="intellect-section">
      <h2 className="intellect-section__title">Certifications</h2>
      <div className="intellect-cert-grid">
        {certifications.map((certification) => (
          <CertificationCard key={certification.id} certification={certification} />
        ))}
      </div>
    </section>
  )
}