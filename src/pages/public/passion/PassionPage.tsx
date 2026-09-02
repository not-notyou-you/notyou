// src/pages/public/passion/PassionPage.tsx
import { useEffect, useMemo, useRef, useState } from 'react'
import { Header } from '@/components/public/Header'
import { PassionTunnelBackground } from './components/PassionTunnelBackground'
import { PassionDustParticles } from './components/PassionDustParticles'
import { PassionModal } from './components/PassionModal'
import type { PassionModalData } from './components/PassionModal'
import { PassionLoader } from './components/PassionLoader'
import { HeroSection, LeadershipSection, CreativeWorksSection, GallerySection, ContactSection, VoidSection } from './sections'
import { usePassionData } from './hooks/usePassionData'
import { usePassionSections } from './hooks/usePassionSections'
import { usePublicData } from '@/contexts/PublicDataContext'
import { usePageReady } from '@/hooks/usePageReady'
import { collectImageUrls } from '@/lib/preloadImages'
import './passion.css'
type Phase = 'idle' | 'exiting' | 'entering'
const EXIT_MS = 480
const ENTER_MS = 560
const SCATTER_MS = 400
const MODAL_FADE_MS = 300
const SHAKE_MS = 900
const FILL_SECTION_IDS = new Set(['leadership', 'creative', 'gallery', 'contact'])
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
  { id: 'void', label: 'The Void' },
]
export default function PassionPage() {
  const { pageContent, loading: contentLoading } = usePassionData()
  const { leadership, creativeWorks, carouselPhotos, loading: sectionsLoading } = usePassionSections()
  const { profile } = usePublicData()
  const imageUrls = useMemo(
    () =>
      [profile?.photo_url, ...collectImageUrls([leadership, creativeWorks, carouselPhotos])].filter(
        (u): u is string => Boolean(u)
      ),
    [profile?.photo_url, leadership, creativeWorks, carouselPhotos]
  )
  const { ready, progress } = usePageReady({ dataLoading: contentLoading || sectionsLoading, imageUrls })
  const [activeIndex, setActiveIndex] = useState(0)
  const [phase, setPhase] = useState<Phase>('idle')
  const [direction, setDirection] = useState<1 | -1>(1)
  const [modalData, setModalData] = useState<PassionModalData | null>(null)
  const [modalShown, setModalShown] = useState(false)
  const [scatterActive, setScatterActive] = useState(false)
  const [shockKey, setShockKey] = useState(0)
  const [shaking, setShaking] = useState(false)
  const transitionTimeoutRef = useRef<number>()
  const modalTimeoutRef = useRef<number>()
  const shakeTimeoutRef = useRef<number>()
  useEffect(() => {
    document.title = profile?.name ? `${profile.name} — Passion` : 'Passion'
  }, [profile?.name])
  useEffect(() => {
    document.body.classList.add('passion-fixed-lock')
    return () => document.body.classList.remove('passion-fixed-lock')
  }, [])
  useEffect(
    () => () => {
      window.clearTimeout(transitionTimeoutRef.current)
      window.clearTimeout(modalTimeoutRef.current)
      window.clearTimeout(shakeTimeoutRef.current)
    },
    []
  )
  const goTo = (nextIndex: number, dir: 1 | -1) => {
    if (phase !== 'idle' || modalData || scatterActive || nextIndex === activeIndex) return
    setDirection(dir)
    setPhase('exiting')
    window.clearTimeout(transitionTimeoutRef.current)
    transitionTimeoutRef.current = window.setTimeout(() => {
      setActiveIndex(nextIndex)
      setPhase('entering')
      transitionTimeoutRef.current = window.setTimeout(() => setPhase('idle'), ENTER_MS)
    }, EXIT_MS)
  }
  const handlePrev = () => goTo((activeIndex - 1 + SECTIONS.length) % SECTIONS.length, -1)
  const handleNext = () => goTo((activeIndex + 1) % SECTIONS.length, 1)
  const openModal = (data: PassionModalData) => {
    if (scatterActive || modalData) return
    setScatterActive(true)
    window.clearTimeout(modalTimeoutRef.current)
    modalTimeoutRef.current = window.setTimeout(() => {
      setModalData(data)
      requestAnimationFrame(() => setModalShown(true))
    }, SCATTER_MS)
  }
  const closeModal = () => {
    setModalShown(false)
    window.clearTimeout(modalTimeoutRef.current)
    modalTimeoutRef.current = window.setTimeout(() => {
      setModalData(null)
      setScatterActive(false)
    }, MODAL_FADE_MS)
  }
  const triggerVoidShake = () => {
    setShockKey((k) => k + 1)
    setShaking(false)
    window.clearTimeout(shakeTimeoutRef.current)
    requestAnimationFrame(() => {
      setShaking(true)
      shakeTimeoutRef.current = window.setTimeout(() => setShaking(false), SHAKE_MS)
    })
  }
  const renderSection = (id: string) => {
    switch (id) {
      case 'hero':
        return <HeroSection content={pageContent} name={profile?.name || ''} />
      case 'leadership':
        return (
          <LeadershipSection
            items={leadership}
            loading={sectionsLoading}
            photoUrl={profile?.photo_url}
            personName={profile?.name || ''}
            onImageClick={openModal}
          />
        )
      case 'creative':
        return <CreativeWorksSection items={creativeWorks} loading={sectionsLoading} onImageClick={openModal} />
      case 'gallery':
        return (
          <GallerySection
            items={carouselPhotos}
            loading={sectionsLoading}
            paused={scatterActive || !!modalData}
            onImageClick={openModal}
          />
        )
      case 'contact':
        return <ContactSection />
      case 'void':
        return <VoidSection onTrigger={triggerVoidShake} />
      default:
        return null
    }
  }
  if (!ready) {
    return (
      <div className="passion-page passion-page--fixed">
        <Header pageType="passion" />
        <div className="passion-loader">
          <PassionLoader progress={progress} />
        </div>
      </div>
    )
  }
  const activeId = SECTIONS[activeIndex].id
  const panelClass =
    phase === 'exiting'
      ? direction === 1
        ? 'passion-panel--exiting-fwd'
        : 'passion-panel--exiting-back'
      : phase === 'entering'
      ? direction === 1
        ? 'passion-panel--entering-fwd'
        : 'passion-panel--entering-back'
      : 'passion-panel--idle'
  const fillClass = FILL_SECTION_IDS.has(activeId) ? 'passion-panel--fill' : ''
  const navDisabled = phase !== 'idle' || !!modalData || scatterActive
  return (
    <div className={`passion-page passion-page--fixed ${shaking ? 'passion-page--shaking' : ''}`}>
      <Header pageType="passion" />
      <main className="passion-viewport">
        <div className={`passion-bg-fade ${scatterActive ? 'passion-bg-fade--dim' : ''}`}>
          <PassionTunnelBackground phase={phase} direction={direction} exitDurationMs={EXIT_MS} shockKey={shockKey} />
          <PassionDustParticles phase={phase} direction={direction} />
        </div>
        <div className="passion-stage">
          <div
            key={activeIndex}
            className={`passion-panel ${panelClass} ${fillClass} ${scatterActive ? 'passion-scatter-active' : ''}`}
          >
            {renderSection(activeId)}
          </div>
        </div>
      </main>
      <nav className="passion-floating-nav" aria-label="Passion sections">
        <button
          type="button"
          className="passion-floating-nav__arrow"
          onClick={handlePrev}
          disabled={navDisabled}
          aria-label="Previous section"
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <polygon points="16,2 16,22 2,12" />
          </svg>
        </button>
        <div className="passion-floating-nav__center">
          <span className="passion-floating-nav__label">{SECTIONS[activeIndex].label}</span>
          <div className="passion-floating-nav__dots">
            {SECTIONS.map((section, index) => (
              <span
                key={section.id}
                className={`passion-floating-nav__dot ${index === activeIndex ? 'passion-floating-nav__dot--active' : ''}`}
              />
            ))}
          </div>
        </div>
        <button
          type="button"
          className="passion-floating-nav__arrow"
          onClick={handleNext}
          disabled={navDisabled}
          aria-label="Next section"
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <polygon points="8,2 8,22 22,12" />
          </svg>
        </button>
      </nav>
      <PassionModal data={modalData} shown={modalShown} onClose={closeModal} />
    </div>
  )
}