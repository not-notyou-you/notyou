// src/pages/public/intellect/hooks/useIntellectData.ts
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { AcademicProject, Certification, PageContent, ProjectWithTech, Skill } from '@/types'

export function useIntellectData() {
  const [pageContent, setPageContent] = useState<PageContent | null>(null)
  const [projects, setProjects] = useState<ProjectWithTech[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [certifications, setCertifications] = useState<Certification[]>([])
  const [academicProjects, setAcademicProjects] = useState<AcademicProject[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const [contentRes, projectsRes, techRes, skillsRes, certRes, academicRes] = await Promise.all([
          supabase.from('page_content').select('*').eq('page_slug', 'intellect').maybeSingle(),
          supabase.from('projects').select('*').order('position', { ascending: true }),
          supabase.from('project_technologies').select('*').order('position', { ascending: true }),
          supabase.from('skills').select('*').order('position', { ascending: true }),
          supabase.from('certifications').select('*').order('position', { ascending: true }),
          supabase.from('academic_projects').select('*').order('position', { ascending: true }),
        ])
        if (contentRes.error) throw contentRes.error
        if (projectsRes.error) throw projectsRes.error
        if (techRes.error) throw techRes.error
        if (skillsRes.error) throw skillsRes.error
        if (certRes.error) throw certRes.error
        if (academicRes.error) throw academicRes.error
        if (!mounted) return
        const mergedProjects: ProjectWithTech[] = (projectsRes.data || []).map((p) => ({
          ...p,
          technologies: (techRes.data || [])
            .filter((t) => t.project_id === p.id)
            .map((t) => t.tech_name as string),
        }))
        setPageContent(contentRes.data)
        setProjects(mergedProjects)
        setSkills(skillsRes.data || [])
        setCertifications(certRes.data || [])
        setAcademicProjects(academicRes.data || [])
      } catch (e) {
        if (mounted) setError(e instanceof Error ? e.message : 'Failed to load data.')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [])

  return { pageContent, projects, skills, certifications, academicProjects, loading, error }
}