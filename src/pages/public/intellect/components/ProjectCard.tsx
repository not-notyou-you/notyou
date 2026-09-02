// src/pages/public/intellect/components/ProjectCard.tsx
import { useState } from 'react'
import { getOrgInitials } from '@/lib/initials'
import { ImageOrInitials } from './ImageOrInitials'
import { IntellectDetailModal } from './IntellectDetailModal'
import type { ProjectWithTech } from '@/types'
interface ProjectCardProps {
  project: ProjectWithTech
}
export function ProjectCard({ project }: ProjectCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const links: { label: string; url: string }[] = []
  if (project.live_demo_url) links.push({ label: 'Live demo', url: project.live_demo_url })
  if (project.github_url) links.push({ label: 'GitHub', url: project.github_url })
  if (project.blog_url) links.push({ label: 'Write-up', url: project.blog_url })
  return (
    <article className="intellect-glass intellect-glass--blue intellect-project-card">
      <button
        type="button"
        className="intellect-project-card__cover"
        onClick={() => setIsModalOpen(true)}
        aria-label={`View ${project.title} details`}
      >
        <ImageOrInitials
          src={project.image_url}
          alt={project.title}
          initials={getOrgInitials(project.title)}
          className="intellect-project-card__img"
        />
        {project.is_featured && <span className="intellect-badge intellect-badge--featured">Featured</span>}
      </button>
      <div className="intellect-project-card__body">
        <div className="intellect-project-card__heading">
          <h3 className="intellect-project-card__title">{project.title}</h3>
          {project.year && <span className="intellect-project-card__year">{project.year}</span>}
        </div>
        {project.category && <span className="intellect-tag">{project.category}</span>}
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
      {isModalOpen && (
        <IntellectDetailModal
          title={project.title}
          subtitle={project.category || undefined}
          meta={project.year ? String(project.year) : undefined}
          imageUrl={project.image_url}
          imageAlt={project.title}
          imageInitials={getOrgInitials(project.title)}
          description={project.short_description || undefined}
          tags={project.technologies}
          links={links}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </article>
  )
}