// src/pages/public/intellect/sections/SkillsSection.tsx
import { getOrgInitials } from '@/lib/initials'
import { ImageOrInitials } from '../components/ImageOrInitials'
import type { Skill, SkillCategory } from '@/types'

interface SkillsSectionProps {
  skills: Skill[]
}

const CATEGORIES: SkillCategory[] = ['Programming Languages', 'Frameworks', 'Tools']

export function SkillsSection({ skills }: SkillsSectionProps) {
  if (skills.length === 0) return null
  return (
    <section className="intellect-section">
      <h2 className="intellect-section__title">Skills</h2>
      {CATEGORIES.map((category) => {
        const items = skills.filter((skill) => skill.category === category)
        if (items.length === 0) return null
        return (
          <div key={category} className="intellect-skill-group">
            <h3 className="intellect-skill-group__title">{category}</h3>
            <div className="intellect-skill-row">
              {items.map((skill) => (
                <div key={skill.id} className="intellect-glass intellect-glass--neutral intellect-skill-badge">
                  <ImageOrInitials
                    src={skill.image_url}
                    alt={skill.skill_name}
                    initials={getOrgInitials(skill.skill_name)}
                    className="intellect-skill-badge__img"
                  />
                  <span>{skill.skill_name}</span>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </section>
  )
}