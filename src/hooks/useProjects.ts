import { useCallback, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Project, ProjectWithTech } from '@/types'

/**
 * Projects live in two tables: `projects` and `project_technologies`.
 * This hook merges them into ProjectWithTech so the rest of the app can
 * treat `technologies` as a plain string array (a tags input), and
 * transparently rewrites the join rows whenever a project is saved.
 */
export function useProjects() {
  const [data, setData] = useState<ProjectWithTech[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data: projects, error: projectsErr } = await supabase
        .from('projects')
        .select('*')
        .order('position', { ascending: true })
      if (projectsErr) throw projectsErr

      const { data: techs, error: techsErr } = await supabase
        .from('project_technologies')
        .select('*')
        .order('position', { ascending: true })
      if (techsErr) throw techsErr

      const merged: ProjectWithTech[] = (projects || []).map((p: Project) => ({
        ...p,
        technologies: (techs || [])
          .filter((t) => t.project_id === p.id)
          .map((t) => t.tech_name as string),
      }))

      setData(merged)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load projects.')
    } finally {
      setLoading(false)
    }
  }, [])

  const replaceTechnologies = async (projectId: string, technologies: string[]) => {
    const { error: deleteErr } = await supabase
      .from('project_technologies')
      .delete()
      .eq('project_id', projectId)
    if (deleteErr) throw deleteErr

    if (technologies.length > 0) {
      const rows = technologies.map((tech_name, position) => ({
        project_id: projectId,
        tech_name,
        position,
      }))
      const { error: insertErr } = await supabase.from('project_technologies').insert(rows)
      if (insertErr) throw insertErr
    }
  }

  const create = async (payload: Partial<Project>, technologies: string[]) => {
    const { data: result, error: err } = await supabase.from('projects').insert([payload]).select()
    if (err) throw err
    const project = result[0] as Project
    await replaceTechnologies(project.id, technologies)
    await fetchData()
    return project
  }

  const update = async (id: string, payload: Partial<Project>, technologies: string[]) => {
    const { error: err } = await supabase.from('projects').update(payload).eq('id', id)
    if (err) throw err
    await replaceTechnologies(id, technologies)
    await fetchData()
  }

  const remove = async (id: string) => {
    // project_technologies rows cascade-delete via the FK constraint.
    const { error: err } = await supabase.from('projects').delete().eq('id', id)
    if (err) throw err
    setData((prev) => prev.filter((p) => p.id !== id))
  }

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, error, fetchData, create, update, remove }
}
