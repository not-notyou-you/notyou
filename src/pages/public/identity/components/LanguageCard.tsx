// src/pages/public/identity/components/LanguageCard.tsx
import type { Language } from '@/types'

export function LanguageCard({ item }: { item: Language }) {
  return (
    <div className="identity-language-card">
      <div className="identity-language-card__name">{item.name}</div>
      <div className="identity-language-card__divider" />
      <div className="identity-language-card__level">{item.level}</div>
    </div>
  )
}