// src/pages/public/identity/sections/HeroSection.tsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { usePublicData } from '@/contexts/PublicDataContext'
import { IdentityImage } from '../components/IdentityImage'
import { PhotoModal } from '../components/PhotoModal'
import { getPersonInitials } from '@/lib/initials'

export function HeroSection() {
  const { profile, loading } = usePublicData()
  const [modalOpen, setModalOpen] = useState(false)
  if (loading) {
    return (
      <section className="identity-hero" aria-busy="true">
        <div className="identity-hero__photo-skeleton" />
      </section>
    )
  }
  const name = profile?.name || ''
  const photoUrl = profile?.photo_url
  return (
    <section className="identity-hero">
      <div className="identity-hero__photo-ring" onClick={() => photoUrl && setModalOpen(true)}>
        <IdentityImage src={photoUrl} alt={`${name} profile photo`} initials={getPersonInitials(name || '?')} size="lg" />
      </div>
      <div className="identity-hero__content">
        <h1 className="identity-hero__name">{name}</h1>
        {profile?.full_description && <p className="identity-hero__description">{profile.full_description}</p>}
        <div className="identity-hero__buttons">
          <Link to="/intellect" className="identity-button">
            Intellect →
          </Link>
          <Link to="/passion" className="identity-button">
            Passion →
          </Link>
        </div>
      </div>
      {modalOpen && photoUrl && <PhotoModal src={photoUrl} alt={`${name} profile photo`} onClose={() => setModalOpen(false)} />}
    </section>
  )
}