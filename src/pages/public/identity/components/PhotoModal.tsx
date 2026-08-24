// src/pages/public/identity/components/PhotoModal.tsx
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

export function PhotoModal({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  const [percent, setPercent] = useState(100)

  useEffect(() => {
    const id = window.setInterval(() => {
      setPercent((p) => {
        if (p <= 10) {
          window.clearInterval(id)
          onClose()
          return 0
        }
        return p - 10
      })
    }, 1000)
    return () => window.clearInterval(id)
  }, [onClose])

  return createPortal(
    <div className="identity-photo-modal" onClick={onClose}>
      <div className="identity-photo-modal__box" onClick={(e) => e.stopPropagation()}>
        <img src={src} alt={alt} className="identity-photo-modal__img" />
        <div className="identity-photo-modal__bar">
          <div className="identity-photo-modal__bar-fill" style={{ width: `${percent}%` }} />
        </div>
      </div>
    </div>,
    document.body
  )
}