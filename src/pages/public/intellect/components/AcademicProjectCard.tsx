// src/pages/public/intellect/components/AcademicProjectCard.tsx
import type { AcademicProject } from '@/types'

interface AcademicProjectCardProps {
  project: AcademicProject
}

export function AcademicProjectCard({ project }: AcademicProjectCardProps) {
  return (
    <article className="intellect-glass intellect-glass--neutral intellect-academic-card">
      <div className="intellect-academic-card__heading">
        <h3 className="intellect-academic-card__title">{project.title}</h3>
        {project.year && <span className="intellect-project-card__year">{project.year}</span>}
      </div>
      {project.course && <span className="intellect-tag">{project.course}</span>}
      {project.description && <p className="intellect-academic-card__desc">{project.description}</p>}
      {project.technologies && project.technologies.length > 0 && (
        <div className="intellect-chip-row">
          {project.technologies.map((tech) => (
            <span key={tech} className="intellect-chip">
              {tech}
            </span>
          ))}
        </div>
      )}
      {project.project_url && (
        <a href={project.project_url} target="_blank" rel="noopener noreferrer" className="intellect-link">
          View project
        </a>
      )}
    </article>
  )
}