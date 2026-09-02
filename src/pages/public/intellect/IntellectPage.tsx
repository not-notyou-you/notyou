// src/pages/public/intellect/IntellectPage.tsx
import { useEffect, useMemo } from 'react'
import { Header } from '@/components/public/Header'
import { Footer } from '@/components/public/Footer'
import { GeometricBackground } from './components/GeometricBackground'
import { IntellectLoader } from './components/IntellectLoader'
import {
  HeroSection,
  ProjectsSection,
  SkillsSection,
  CertificationsSection,
  AcademicProjectsSection,
} from './sections'
import { useIntellectData } from './hooks/useIntellectData'
import { usePublicData } from '@/contexts/PublicDataContext'
import { usePageReady } from '@/hooks/usePageReady'
import { collectImageUrls } from '@/lib/preloadImages'
import './intellect.css'

export default function IntellectPage() {
  const { pageContent, projects, skills, certifications, academicProjects, loading } = useIntellectData()
  const { profile } = usePublicData()

  const imageUrls = useMemo(
    () =>
      [profile?.photo_url, ...collectImageUrls([projects, skills, certifications, academicProjects])].filter(
        (u): u is string => Boolean(u)
      ),
    [profile?.photo_url, projects, skills, certifications, academicProjects]
  )
  const { ready, progress } = usePageReady({ dataLoading: loading, imageUrls })

  useEffect(() => {
    document.title = profile?.name ? `${profile.name} — Intellect` : 'Intellect'
  }, [profile?.name])

  if (!ready) {
    return (
      <div className="intellect-page">
        <Header pageType="intellect" />
        <div className="intellect-loader">
          <IntellectLoader progress={progress} />
        </div>
      </div>
    )
  }

  return (
    <div className="intellect-page">
      <GeometricBackground />
      <Header pageType="intellect" />
      <main className="intellect-main">
        <HeroSection content={pageContent} name={profile?.name || ''} />
        <ProjectsSection projects={projects} />
        <SkillsSection skills={skills} />
        <CertificationsSection certifications={certifications} />
        <AcademicProjectsSection projects={academicProjects} />
      </main>
      <Footer pageType="intellect" />
    </div>
  )
}