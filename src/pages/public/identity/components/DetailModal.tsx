// src/pages/public/identity/components/DetailModal.tsx
import { useEffect } from 'react'
import { IdentityImage } from './IdentityImage'

interface DetailModalProps {
  photoSrc?: string | null
  photoAlt: string
  photoInitials: string
  badgeSrc?: string | null
  badgeAlt?: string
  title: string
  subtitle?: string
  metaLines?: string[]
  description?: string | null
  onClose: () => void
}

export function DetailModal({
  photoSrc,
  photoAlt,
  photoInitials,
  badgeSrc,
  badgeAlt,
  title,
  subtitle,
  metaLines = [],
  description,
  onClose,
}: DetailModalProps) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  return (
    <div className="identity-detail-modal" onClick={onClose}>
      <div
        className="identity-detail-modal__box"
        role="dialog"
        aria-modal="true"
        aria-labelledby="identity-detail-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="identity-detail-modal__close" onClick={onClose} aria-label="Close">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="4" y1="4" x2="20" y2="20" />
            <line x1="20" y1="4" x2="4" y2="20" />
          </svg>
        </button>
        <div className="identity-detail-modal__photo">
          <div className="identity-detail-modal__photo-frame">
            <IdentityImage src={photoSrc} alt={photoAlt} initials={photoInitials} size="modal" />
          </div>
        </div>
        <div className="identity-detail-modal__info">
          <div className="identity-detail-modal__heading">
            {badgeSrc && (
              <div className="identity-detail-modal__badge">
                <img src={badgeSrc} alt={badgeAlt || ''} />
              </div>
            )}
            <div>
              <h3 id="identity-detail-modal-title" className="identity-detail-modal__title">
                {title}
              </h3>
              {subtitle && <div className="identity-detail-modal__subtitle">{subtitle}</div>}
            </div>
          </div>
          {metaLines.length > 0 && (
            <div className="identity-detail-modal__meta">
              {metaLines.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </div>
          )}
          {description && (
            <>
              <div className="identity-detail-modal__divider" />
              <div className="identity-detail-modal__description-wrap">
                <p className="identity-detail-modal__description">{description}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}