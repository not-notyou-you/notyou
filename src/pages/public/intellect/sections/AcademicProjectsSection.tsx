// src/pages/public/intellect/sections/AcademicProjectsSection.tsx
import { AcademicProjectCard } from '../components/AcademicProjectCard'
import type { AcademicProject } from '@/types'

interface AcademicProjectsSectionProps {
  projects: AcademicProject[]
}

export function AcademicProjectsSection({ projects }: AcademicProjectsSectionProps) {
  if (projects.length === 0) return null
  return (
    <section className="intellect-section">
      <h2 className="intellect-section__title">Academic Projects</h2>
      <div className="intellect-academic-grid">
        {projects.map((project) => (
          <AcademicProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  )
}