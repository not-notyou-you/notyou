export type ImageSection = 'identity' | 'intellect' | 'passion'

/** Matches the 3 files the user places in public/placeholders/. */
export const PLACEHOLDER_BY_SECTION: Record<ImageSection, string> = {
  identity: '/placeholders/black_placeholder.webp',
  intellect: '/placeholders/blue_placeholder.webp',
  passion: '/placeholders/red_placeholder.webp',
}

export function getPlaceholder(section: ImageSection): string {
  return PLACEHOLDER_BY_SECTION[section]
}

/**
 * Google Drive "share" links (…/file/d/FILE_ID/view, …?id=FILE_ID, …/open?id=FILE_ID)
 * point at an HTML viewer page, not the raw image — an <img> tag can't render them
 * directly. This rewrites them to Drive's direct-content endpoint instead.
 *
 * Requires the file to be shared as "Anyone with the link". Very large files can
 * still show Drive's "can't scan this file for viruses" interstitial instead of the
 * image — that's a Google-side limitation, not something a URL rewrite can fix.
 */
export function normalizeImageUrl(input: string): string {
  const trimmed = input.trim()

  const patterns = [
    /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/, // .../file/d/FILE_ID/view
    /drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/, // .../open?id=FILE_ID
    /drive\.google\.com\/uc\?id=([a-zA-Z0-9_-]+)/, // .../uc?id=FILE_ID
    /[?&]id=([a-zA-Z0-9_-]+)/, // any other ?id=FILE_ID variant
  ]

  if (/drive\.google\.com/.test(trimmed)) {
    for (const pattern of patterns) {
      const match = trimmed.match(pattern)
      if (match) {
        return `https://drive.google.com/uc?export=view&id=${match[1]}`
      }
    }
  }

  return trimmed
}

export function isLikelyUrl(value: string): boolean {
  return /^https?:\/\/\S+$/i.test(value.trim())
}
