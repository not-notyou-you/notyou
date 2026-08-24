// src/pages/public/intellect/components/ProjectCard.tsx
import { getOrgInitials } from '@/lib/initials'
import { ImageOrInitials } from './ImageOrInitials'
import type { ProjectWithTech } from '@/types'

interface ProjectCardProps {
  project: ProjectWithTech
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="intellect-glass intellect-glass--blue intellect-project-card">
      <div className="intellect-project-card__cover">
        <ImageOrInitials
          src={project.image_url}
          alt={project.title}
          initials={getOrgInitials(project.title)}
          className="intellect-project-card__img"
        />
        {project.is_featured && <span className="intellect-badge intellect-badge--featured">Featured</span>}
      </div>
      <div className="intellect-project-card__body">
        <div className="intellect-project-card__heading">
          <h3 className="intellect-project-card__title">{project.title}</h3>
          {project.year && <span className="intellect-project-card__year">{project.year}</span>}
        </div>
        {project.category && <span className="intellect-tag">{project.category}</span>}
        {project.short_description && (
          <p className="intellect-project-card__desc">{project.short_description}</p>
        )}
        {project.technologies.length > 0 && (
          <div className="intellect-chip-row">
            {project.technologies.map((tech) => (
              <span key={tech} className="intellect-chip">
                {tech}
              </span>
            ))}
          </div>
        )}
        <div className="intellect-project-card__links">
          {project.live_demo_url && (
            <a href={project.live_demo_url} target="_blank" rel="noopener noreferrer" className="intellect-link">
              Live demo
            </a>
          )}
          {project.github_url && (
            <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="intellect-link">
              GitHub
            </a>
          )}
          {project.blog_url && (
            <a href={project.blog_url} target="_blank" rel="noopener noreferrer" className="intellect-link">
              Write-up
            </a>
          )}
        </div>
      </div>
    </article>
  )
}