// src/pages/public/passion/sections/HeroSection.tsx
import { getPersonInitials } from '@/lib/initials'
import { ImageOrInitials } from '../components/ImageOrInitials'
import type { PageContent } from '@/types'
interface HeroSectionProps {
  content: PageContent | null
  name: string
}
export function HeroSection({ content, name }: HeroSectionProps) {
  return (
    <div className="passion-box passion-box--hero">
      {content?.image_url && (
        <ImageOrInitials
          src={content.image_url}
          alt={name}
          initials={getPersonInitials(name)}
          className="passion-hero__img"
        />
      )}
      <div className="passion-hero__text">
        <h1 className="passion-hero__greeting">{content?.greeting_text || 'Passion'}</h1>
        {content?.subtitle_text && <p className="passion-hero__subtitle">{content.subtitle_text}</p>}
        {content?.quote_text && <p className="passion-hero__quote">{content.quote_text}</p>}
      </div>
    </div>
  )
}