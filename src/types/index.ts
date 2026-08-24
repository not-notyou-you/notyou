// Types mirror the tables defined in sql/schema.sql 1:1.
// Keeping them hand-written (rather than generated) so the admin panel
// has zero extra build steps — regenerate manually if the schema changes.

export type PageSlug = 'identity' | 'intellect' | 'passion'
export type LanguageLevel = 'Native' | 'Fluent' | 'Intermediate' | 'Beginner'
export type SkillCategory = 'Programming Languages' | 'Frameworks' | 'Tools'
export type CreativeCategory = 'digital' | 'traditional' | 'stickers'

export interface Profile {
  id: string
  name: string
  short_bio: string | null
  full_description: string | null
  email: string | null
  phone: string | null
  location: string | null
  photo_url: string | null
  updated_at: string
}

export interface Social {
  id: string
  platform: string
  url: string | null
  position: number
  is_visible: boolean
  created_at: string
}

export interface Education {
  id: string
  institution: string
  degree: string | null
  field: string
  start_year: number | null
  end_year: number | null
  gpa: string | null
  honors: string | null
  details: string | null
  image_url: string | null
  position: number
  is_visible: boolean
  created_at: string
  updated_at: string
}

export interface Experience {
  id: string
  company: string
  position: string
  start_date: string | null
  end_date: string | null
  duration: string | null
  location: string | null
  description: string | null
  institution_details: string | null
  logo_url: string | null
  position_order: number
  is_visible: boolean
  created_at: string
  updated_at: string
}

export interface Language {
  id: string
  name: string
  level: LanguageLevel
  position: number
  is_visible: boolean
  created_at: string
}

export interface PageContent {
  id: string
  page_slug: PageSlug
  greeting_text: string | null
  quote_text: string | null
  subtitle_text: string | null
  image_url: string | null
  custom_content: Record<string, unknown> | null
  is_published: boolean
  updated_at: string
}

export interface Project {
  id: string
  title: string
  short_description: string | null
  long_description: string | null
  image_url: string | null
  additional_images: string[] | null
  live_demo_url: string | null
  github_url: string | null
  blog_url: string | null
  year: number | null
  category: string | null
  is_featured: boolean
  position: number
  is_visible: boolean
  created_at: string
  updated_at: string
}

export interface ProjectWithTech extends Project {
  technologies: string[]
}

export interface ProjectTechnology {
  id: string
  project_id: string
  tech_name: string
  position: number
  created_at: string
}

export interface Skill {
  id: string
  category: SkillCategory
  skill_name: string
  image_url: string | null
  position: number
  is_visible: boolean
  created_at: string
}

export interface Certification {
  id: string
  title: string
  issuer: string
  skills: string | null
  certification_url: string | null
  image_url: string | null
  year: number | null
  position: number
  is_visible: boolean
  created_at: string
  updated_at: string
}

export interface AcademicProject {
  id: string
  title: string
  course: string | null
  description: string | null
  technologies: string[] | null
  project_url: string | null
  year: number | null
  position: number
  is_visible: boolean
  created_at: string
  updated_at: string
}

export interface Leadership {
  id: string
  organization: string
  position: string
  start_date: string | null
  end_date: string | null
  period: string | null
  description: string
  achievements: string[] | null
  icon_type: string | null
  position_order: number
  is_visible: boolean
  created_at: string
  updated_at: string
}

export interface CreativeWork {
  id: string
  title: string
  description: string | null
  category: CreativeCategory
  image_url: string | null
  project_link: string | null
  year: number | null
  position: number
  is_visible: boolean
  created_at: string
  updated_at: string
}

export interface CarouselPhoto {
  id: string
  image_url: string
  caption: string | null
  event_or_context: string | null
  position: number
  is_visible: boolean
  created_at: string
  updated_at: string
}
