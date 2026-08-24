interface PhotoFallbackProps {
  initials: string
  size?: 'sm' | 'md' | 'lg'
}

/** Circular initials badge shown whenever a photo/logo is missing or fails to load. */
export function PhotoFallback({ initials, size = 'md' }: PhotoFallbackProps) {
  return <div className={`identity-photo-fallback identity-photo-fallback--${size}`}>{initials}</div>
}
