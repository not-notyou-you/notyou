// src/pages/public/passion/components/PassionModal.tsx
import { createPortal } from 'react-dom'
import { ImageOrInitials } from './ImageOrInitials'
import { LeadershipIcon } from './LeadershipIcon'
export interface PassionModalData {
  imageUrl: string | null
  title: string
  subtitle?: string
  description?: string
  achievements?: string[]
  icon?: string | null
}
interface PassionModalProps {
  data: PassionModalData | null
  shown: boolean
  onClose: () => void
}
export function PassionModal({ data, shown, onClose }: PassionModalProps) {
  if (!data) return null
  return createPortal(
    <div className={`passion-modal-overlay ${shown ? 'passion-modal-overlay--shown' : ''}`} onClick={onClose}>
      <div className="passion-modal-card" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="passion-modal-close" onClick={onClose} aria-label="Close">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.6">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
        <div className="passion-modal-card__image">
          <ImageOrInitials src={data.imageUrl} alt={data.title} initials="?" />
        </div>
        <div className="passion-modal-card__content">
          <div className="passion-modal-card__heading">
            {data.icon !== undefined && (
              <span className="passion-modal-icon">
                <LeadershipIcon icon={data.icon ?? null} />
              </span>
            )}
            <h3 className="passion-modal-title">{data.title}</h3>
          </div>
          {data.subtitle && <span className="passion-modal-subtitle">{data.subtitle}</span>}
          {data.description && <p className="passion-modal-desc">{data.description}</p>}
          {data.achievements && data.achievements.length > 0 && (
            <ul className="passion-modal-achievements">
              {data.achievements.map((achievement, index) => (
                <li key={index}>{achievement}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>,
    document.body
  )
}