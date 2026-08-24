// src/pages/public/passion/PassionPage.tsx
import { useEffect, useRef, useState } from 'react'
import { Header } from '@/components/public/Header'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { PassionFooter } from '@/components/public/footer/PassionFooter'
import { PassionTunnelBackground } from './components/PassionTunnelBackground'
import { PassionDustParticles } from './components/PassionDustParticles'
import { HeroSection, LeadershipSection, CreativeWorksSection, GallerySection } from './sections'
import { usePassionData } from './hooks/usePassionData'
import { usePassionSections } from './hooks/usePassionSections'
import { useFooterData } from '@/hooks/useFooterData'
import { usePublicData } from '@/contexts/PublicDataContext'
import './passion.css'
type Phase = 'idle' | 'exiting' | 'entering'
const EXIT_MS = 480
const ENTER_MS = 560
const FILL_SECTION_IDS = new Set(['leadership', 'creative', 'gallery'])
interface PassionSection {
  id: string
  label: string
}
const SECTIONS: PassionSection[] = [
  { id: 'hero', label: 'Intro' },
  { id: 'leadership', label: 'Leadership' },
  { id: 'creative', label: 'Creative Works' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'contact', label: 'Contact' },
]
function ContactPanel() {
  const { profile, socials, loading, error } = useFooterData()
  if (loading || error || !profile) return null
  return (
    <div className="passion-contact-panel footer-passion">
      <PassionFooter profile={profile} socials={socials} />
    </div>
  )
}
export default function PassionPage() {
  const { pageContent, loading: contentLoading } = usePassionData()
  const { leadership, creativeWorks, carouselPhotos, loading: sectionsLoading } = usePassionSections()
  const { profile } = usePublicData()
  const [activeIndex, setActiveIndex] = useState(0)
  const [phase, setPhase] = useState<Phase>('idle')
  const [direction, setDirection] = useState<1 | -1>(1)
  const timeoutRef = useRef<number>()
  useEffect(() => {
    document.title = profile?.name ? `${profile.name} — Passion` : 'Passion'
  }, [profile?.name])
  useEffect(() => {
    document.body.classList.add('passion-fixed-lock')
    return () => document.body.classList.remove('passion-fixed-lock')
  }, [])
  useEffect(() => () => window.clearTimeout(timeoutRef.current), [])
  const goTo = (nextIndex: number, dir: 1 | -1) => {
    if (phase !== 'idle' || nextIndex === activeIndex) return
    setDirection(dir)
    setPhase('exiting')
    window.clearTimeout(timeoutRef.current)
    timeoutRef.current = window.setTimeout(() => {
      setActiveIndex(nextIndex)
      setPhase('entering')
      timeoutRef.current = window.setTimeout(() => setPhase('idle'), ENTER_MS)
    }, EXIT_MS)
  }
  const handlePrev = () => goTo((activeIndex - 1 + SECTIONS.length) % SECTIONS.length, -1)
  const handleNext = () => goTo((activeIndex + 1) % SECTIONS.length, 1)
  const renderSection = (id: string) => {
    switch (id) {
      case 'hero':
        return <HeroSection content={pageContent} name={profile?.name || ''} />
      case 'leadership':
        return <LeadershipSection items={leadership} loading={sectionsLoading} />
      case 'creative':
        return <CreativeWorksSection items={creativeWorks} loading={sectionsLoading} />
      case 'gallery':
        return <GallerySection items={carouselPhotos} loading={sectionsLoading} />
      case 'contact':
        return <ContactPanel />
      default:
        return null
    }
  }
  const activeId = SECTIONS[activeIndex].id
  const panelClass =
    phase === 'exiting' ? 'passion-panel--exiting' : phase === 'entering' ? 'passion-panel--entering' : 'passion-panel--idle'
  const fillClass = FILL_SECTION_IDS.has(activeId) ? 'passion-panel--fill' : ''
  const loading = contentLoading
  return (
    <div className="passion-page passion-page--fixed">
      <Header pageType="passion" />
      <main className="passion-viewport">
        <PassionTunnelBackground phase={phase} direction={direction} exitDurationMs={EXIT_MS} />
        <PassionDustParticles phase={phase} direction={direction} />
        <div className="passion-stage">
          {loading ? (
            <div className="passion-panel passion-panel--idle">
              <LoadingSpinner label="Loading" />
            </div>
          ) : (
            <div key={activeIndex} className={`passion-panel ${panelClass} ${fillClass}`}>
              {renderSection(activeId)}
            </div>
          )}
        </div>
      </main>
      <nav className="passion-floating-nav" aria-label="Passion sections">
        <button
          type="button"
          className="passion-floating-nav__arrow"
          onClick={handlePrev}
          disabled={phase !== 'idle'}
          aria-label="Previous section"
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <polygon points="16,2 16,22 2,12" />
          </svg>
        </button>
        <span className="passion-floating-nav__label">{SECTIONS[activeIndex].label}</span>
        <button
          type="button"
          className="passion-floating-nav__arrow"
          onClick={handleNext}
          disabled={phase !== 'idle'}
          aria-label="Next section"
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <polygon points="8,2 8,22 22,12" />
          </svg>
        </button>
      </nav>
    </div>
  )
}