// src/pages/public/identity/components/IdentityImage.tsx
import { useState } from 'react'

interface IdentityImageProps {
  src: string | null | undefined
  alt: string
  initials: string
  size?: 'lg' | 'card'
  className?: string
}

export function IdentityImage({ src, alt, initials, size = 'lg', className = '' }: IdentityImageProps) {
  const [failed, setFailed] = useState(false)
  if (!src || failed) {
    return <div className={`identity-photo-fallback identity-photo-fallback--${size} ${className}`}>{initials}</div>
  }
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className={`identity-photo identity-photo--${size} ${className}`}
      onError={() => setFailed(true)}
    />
  )
}