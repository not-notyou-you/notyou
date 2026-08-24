import { useState, type ImgHTMLAttributes } from 'react'
import { getPlaceholder, type ImageSection } from '@/lib/imageUrl'

interface ImageWithFallbackProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'onError'> {
  src: string | null | undefined
  section: ImageSection
}

/**
 * Never renders empty: falls back to the section's placeholder
 * (black/blue/red — see public/placeholders/) whenever `src` is missing,
 * or the moment it fails to load (broken link, revoked Drive share, etc.).
 */
export function ImageWithFallback({ src, section, alt, ...rest }: ImageWithFallbackProps) {
  const placeholder = getPlaceholder(section)
  const [failed, setFailed] = useState(false)

  const resolvedSrc = !src || failed ? placeholder : src

  return (
    <img
      src={resolvedSrc}
      alt={alt || ''}
      onError={() => {
        if (!failed) setFailed(true)
      }}
      {...rest}
    />
  )
}
