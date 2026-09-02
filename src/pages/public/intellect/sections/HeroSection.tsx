// src/pages/public/intellect/sections/HeroSection.tsx
import { getPersonInitials } from '@/lib/initials'
import { ImageOrInitials } from '../components/ImageOrInitials'
import type { PageContent } from '@/types'
interface HeroSectionProps {
  content: PageContent | null
  name: string
}
export function HeroSection({ content, name }: HeroSectionProps) {
  return (
    <section className="intellect-hero">
      <div className="intellect-glass intellect-glass--neutral intellect-hero__panel">
        <ImageOrInitials
          src={content?.image_url || null}
          alt={name}
          initials={getPersonInitials(name)}
          className="intellect-hero__img"
        />
        <div className="intellect-hero__text">
          <h1 className="intellect-hero__greeting">{content?.greeting_text || 'Intellect'}</h1>
          {content?.subtitle_text && <p className="intellect-hero__subtitle">{content.subtitle_text}</p>}
          {content?.quote_text && <p className="intellect-hero__quote">{content.quote_text}</p>}
        </div>
      </div>
    </section>
  )
}