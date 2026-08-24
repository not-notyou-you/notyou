// src/pages/public/identity/IdentityPage.tsx
import { useEffect, useRef, useState } from 'react'
import { Header } from '@/components/public/Header'
import { HeroSection, EducationSection, ExperienceSection, LanguagesSection, FooterSection } from './sections'
import { useIdentitySections } from './hooks/useIdentityData'
import { usePublicData } from '@/contexts/PublicDataContext'
import { useTheme } from '@/contexts/ThemeContext'
import { ChibiIdentity } from './components/ChibiIdentity'
import './identity.css'

const CHIBI_FOOTER_OFFSET = 0
const BANNER_DURATION_MS = 10000

export default function IdentityPage() {
  const { education, experience, languages, loading } = useIdentitySections()
  const { profile } = usePublicData()
  const { theme } = useTheme()
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [showBanner, setShowBanner] = useState(true)

  useEffect(() => {
    document.title = profile?.name ? `${profile.name} — Identity` : 'Identity'
  }, [profile?.name])

  useEffect(() => {
    document.body.classList.add('identity-hscroll-lock')
    return () => document.body.classList.remove('identity-hscroll-lock')
  }, [])

  useEffect(() => {
    const id = window.setTimeout(() => setShowBanner(false), BANNER_DURATION_MS)
    return () => window.clearTimeout(id)
  }, [])

  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return
      e.preventDefault()
      el.scrollLeft -= e.deltaY
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [])

  return (
    <div className="identity-page identity-page--hscroll">
      <Header pageType="identity" />
      <div className="identity-banner-slot">
        {showBanner && (
          <div className="identity-banner">
            <span className="identity-banner__text">
              &lt;&lt;&lt; swipe horizontally, don't stop, don't touch it &gt;&gt;&gt;
            </span>
          </div>
        )}
      </div>
      <div className="identity-main">
        <div ref={scrollerRef} className="identity-scroller">
          <div className="identity-panel identity-panel--fixed">
            <HeroSection />
          </div>
          <div className="identity-panel">
            <EducationSection items={education} loading={loading} />
          </div>
          <div className="identity-panel">
            <ExperienceSection items={experience} loading={loading} />
          </div>
          <div className="identity-panel identity-panel--fixed">
            <LanguagesSection items={languages} loading={loading} />
          </div>
          <div className="identity-panel identity-panel--fixed">
            <FooterSection />
          </div>
        </div>
      </div>
      <ChibiIdentity scrollerRef={scrollerRef} dark={theme === 'dark'} footerHeight={CHIBI_FOOTER_OFFSET} />
    </div>
  )
}