// src/pages/public/passion/sections/HeroSection.tsx
import { getPersonInitials } from '@/lib/initials'
import { ImageOrInitials } from '../components/ImageOrInitials'
import { useWanderRotation } from '../hooks/useWanderRotation'
import type { PageContent } from '@/types'
interface HeroSectionProps {
  content: PageContent | null
  name: string
}
export function HeroSection({ content, name }: HeroSectionProps) {
  const rotation = useWanderRotation()
  return (
    <div className="passion-hero-center">
      <div className="passion-scatterable">
        <div
          className="passion-box passion-box--hero"
          style={{ transform: `rotate(${rotation}deg)`, transition: 'box-shadow 0.3s ease, border-color 0.3s ease' }}
        >
          <ImageOrInitials
            src={content?.image_url || null}
            alt={name}
            initials={getPersonInitials(name)}
            className="passion-hero__img"
          />
          <div className="passion-hero__text">
            <h1 className="passion-hero__greeting">{content?.greeting_text || 'Passion'}</h1>
            {content?.subtitle_text && <p className="passion-hero__subtitle">{content.subtitle_text}</p>}
            {content?.quote_text && <p className="passion-hero__quote">{content.quote_text}</p>}
          </div>
        </div>
      </div>
    </div>
  )
}