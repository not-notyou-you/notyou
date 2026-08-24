// src/pages/public/intellect/IntellectPage.tsx
import { useEffect } from 'react'
import { Header } from '@/components/public/Header'
import { Footer } from '@/components/public/Footer'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { GeometricBackground } from './components/GeometricBackground'
import {
  HeroSection,
  ProjectsSection,
  SkillsSection,
  CertificationsSection,
  AcademicProjectsSection,
} from './sections'
import { useIntellectData } from './hooks/useIntellectData'
import { usePublicData } from '@/contexts/PublicDataContext'
import './intellect.css'

export default function IntellectPage() {
  const { pageContent, projects, skills, certifications, academicProjects, loading } = useIntellectData()
  const { profile } = usePublicData()

  useEffect(() => {
    document.title = profile?.name ? `${profile.name} — Intellect` : 'Intellect'
  }, [profile?.name])

  return (
    <div className="intellect-page">
      <GeometricBackground />
      <Header pageType="intellect" />
      <main className="intellect-main">
        {loading ? (
          <LoadingSpinner fullPage label="Loading" />
        ) : (
          <>
            <HeroSection content={pageContent} name={profile?.name || ''} />
            <ProjectsSection projects={projects} />
            <SkillsSection skills={skills} />
            <CertificationsSection certifications={certifications} />
            <AcademicProjectsSection projects={academicProjects} />
          </>
        )}
      </main>
      <Footer pageType="intellect" />
    </div>
  )
}