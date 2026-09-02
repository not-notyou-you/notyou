// src/pages/public/intellect/components/IntellectDetailModal.tsx
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { ImageOrInitials } from './ImageOrInitials'
interface IntellectDetailModalLink {
  label: string
  url: string
}
interface IntellectDetailModalProps {
  title: string
  subtitle?: string
  meta?: string
  imageUrl: string | null
  imageAlt: string
  imageInitials: string
  description?: string
  tags?: string[]
  links?: IntellectDetailModalLink[]
  onClose: () => void
}
export function IntellectDetailModal({
  title,
  subtitle,
  meta,
  imageUrl,
  imageAlt,
  imageInitials,
  description,
  tags,
  links,
  onClose,
}: IntellectDetailModalProps) {
  const [theme] = useState(() => document.documentElement.getAttribute('data-theme'))
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [onClose])
  return createPortal(
    <div data-theme={theme || undefined}>
      <div className="intellect-page intellect-modal-overlay" onClick={onClose}>
        <div
          className="intellect-glass intellect-glass--blue intellect-modal"
          onClick={(event) => event.stopPropagation()}
        >
          <button type="button" className="intellect-modal__close" onClick={onClose} aria-label="Close">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <div className="intellect-modal__image-wrap">
            <ImageOrInitials src={imageUrl} alt={imageAlt} initials={imageInitials} className="intellect-modal__image" />
          </div>
          <div className="intellect-modal__body">
            <div className="intellect-modal__heading">
              <h3 className="intellect-modal__title">{title}</h3>
              {meta && <span className="intellect-modal__meta">{meta}</span>}
            </div>
            {subtitle && <p className="intellect-modal__subtitle">{subtitle}</p>}
            {tags && tags.length > 0 && (
              <div className="intellect-chip-row">
                {tags.map((tag) => (
                  <span key={tag} className="intellect-chip">
                    {tag}
                  </span>
                ))}
              </div>
            )}
            {description && (
              <div className="intellect-modal__description">
                <p>{description}</p>
              </div>
            )}
            {links && links.length > 0 && (
              <div className="intellect-modal__links">
                {links.map((link) => (
                  <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer" className="intellect-link">
                    {link.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}