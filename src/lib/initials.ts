/**
 * "Muhammad Faiq Hakim Ulinnuha" -> "MU" (first word + last word).
 * Used for the profile photo fallback badge.
 */
export function getPersonInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return '?'
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase()
  return (words[0][0] + words[words.length - 1][0]).toUpperCase()
}

/**
 * "Universitas Multimedia Nusantara" -> "UMN" (first letter of each word, capped at 4).
 * Used for institution/company logo fallback badges. For acronym-style names that
 * already read as their own abbreviation (e.g. "PMDG Pusat Ponorogo"), this won't
 * always match a human-picked shorthand exactly — good enough for a rare fallback
 * that only shows up when no logo has been uploaded.
 */
export function getOrgInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return '?'
  return words
    .slice(0, 4)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}
