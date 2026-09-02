// src/pages/public/identity/sections/HeroSection.tsx
import { Link } from 'react-router-dom'
import { usePublicData } from '@/contexts/PublicDataContext'
import { IdentityImage } from '../components/IdentityImage'
import { getPersonInitials } from '@/lib/initials'
import { downloadFile, getFileExtension } from '@/lib/downloadFile'

export function HeroSection() {
  const { profile, loading } = usePublicData()

  if (loading) {
    return (
      <section className="identity-hero" aria-busy="true">
        <div className="identity-hero__photo-skeleton" />
      </section>
    )
  }

  const name = profile?.name || ''
  const photoUrl = profile?.photo_url

  const handlePhotoDownload = () => {
    if (!photoUrl) return
    const extension = getFileExtension(photoUrl)
    const safeName = (name || 'profile').trim().toLowerCase().replace(/\s+/g, '-')
    downloadFile(photoUrl, `${safeName}-photo.${extension}`)
  }

  return (
    <section className="identity-hero">
      <div
        className="identity-hero__photo-ring"
        role="button"
        tabIndex={0}
        aria-label="Download profile photo"
        onClick={handlePhotoDownload}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handlePhotoDownload()
          }
        }}
      >
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
    </section>
  )
}