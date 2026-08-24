// src/pages/public/passion/components/ImageOrInitials.tsx
import { useState } from 'react'
interface ImageOrInitialsProps {
  src: string | null
  alt: string
  initials: string
  className?: string
}
export function ImageOrInitials({ src, alt, initials, className }: ImageOrInitialsProps) {
  const [failed, setFailed] = useState(false)
  if (!src || failed) {
    return <div className={`passion-image-fallback ${className ?? ''}`}>{initials}</div>
  }
  return <img src={src} alt={alt} className={className} onError={() => setFailed(true)} />
}