// src/pages/public/intellect/sections/ProjectsSection.tsx
import { ProjectCard } from '../components/ProjectCard'
import type { ProjectWithTech } from '@/types'

interface ProjectsSectionProps {
  projects: ProjectWithTech[]
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  if (projects.length === 0) return null
  return (
    <section className="intellect-section">
      <h2 className="intellect-section__title">Projects</h2>
      <div className="intellect-project-grid">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  )
}