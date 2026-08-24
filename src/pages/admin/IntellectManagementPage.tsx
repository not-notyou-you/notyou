import { useState } from 'react'
import toast from 'react-hot-toast'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { Button } from '@/components/common/Button'
import { DataTable, type DataTableColumn } from '@/components/admin/DataTable'
import { DeleteConfirmation } from '@/components/admin/DeleteConfirmation'
import { VisibilityPill, FeaturedPill } from '@/components/admin/VisibilityPill'
import { ImageWithFallback } from '@/components/admin/ImageWithFallback'
import { PageContentModal } from '@/components/admin/modals/PageContentModal'
import { ProjectModal } from '@/components/admin/modals/ProjectModal'
import { SkillModal } from '@/components/admin/modals/SkillModal'
import { CertificationModal } from '@/components/admin/modals/CertificationModal'
import { AcademicProjectModal } from '@/components/admin/modals/AcademicProjectModal'
import { usePageContent } from '@/hooks/usePageContent'
import { useProjects } from '@/hooks/useProjects'
import { useSupabaseTable } from '@/hooks/useSupabaseTable'
import type { AcademicProject, Certification, ProjectWithTech, Skill, SkillCategory } from '@/types'

type DeleteTarget =
  | { type: 'project'; id: string; label: string }
  | { type: 'skill'; id: string; label: string }
  | { type: 'certification'; id: string; label: string }
  | { type: 'academic'; id: string; label: string }

const SKILL_CATEGORIES: SkillCategory[] = ['Programming Languages', 'Frameworks', 'Tools']

export function IntellectManagementPage() {
  const pageContent = usePageContent('intellect')
  const projects = useProjects()
  const skills = useSupabaseTable<Skill>('skills')
  const certifications = useSupabaseTable<Certification>('certifications')
  const academicProjects = useSupabaseTable<AcademicProject>('academic_projects')

  const [pageContentModalOpen, setPageContentModalOpen] = useState(false)
  const [projectModal, setProjectModal] = useState<{ open: boolean; data: ProjectWithTech | null }>({
    open: false,
    data: null,
  })
  const [skillModal, setSkillModal] = useState<{
    open: boolean
    data: Skill | null
    defaultCategory?: SkillCategory
  }>({ open: false, data: null })
  const [certModal, setCertModal] = useState<{ open: boolean; data: Certification | null }>({
    open: false,
    data: null,
  })
  const [academicModal, setAcademicModal] = useState<{ open: boolean; data: AcademicProject | null }>({
    open: false,
    data: null,
  })
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      if (deleteTarget.type === 'project') await projects.remove(deleteTarget.id)
      if (deleteTarget.type === 'skill') await skills.remove(deleteTarget.id)
      if (deleteTarget.type === 'certification') await certifications.remove(deleteTarget.id)
      if (deleteTarget.type === 'academic') await academicProjects.remove(deleteTarget.id)
      toast.success('Deleted.')
      setDeleteTarget(null)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Could not delete. Try again.')
    } finally {
      setDeleting(false)
    }
  }

  const projectColumns: DataTableColumn<ProjectWithTech>[] = [
    {
      key: 'image_url',
      label: 'Cover',
      render: (v) => <ImageWithFallback src={v as string} section="intellect" alt="" className="table-thumb" />,
    },
    { key: 'title', label: 'Title' },
    { key: 'category', label: 'Category', render: (v) => (v ? String(v) : '—') },
    {
      key: 'technologies',
      label: 'Tech',
      render: (v) => ((v as string[]) || []).slice(0, 3).join(', ') || '—',
    },
    {
      key: 'is_visible',
      label: 'Status',
      render: (v, row) => (
        <>
          <VisibilityPill visible={v as boolean} /> <FeaturedPill featured={row.is_featured} />
        </>
      ),
    },
  ]

  const certColumns: DataTableColumn<Certification>[] = [
    {
      key: 'image_url',
      label: 'Photo',
      render: (v) => <ImageWithFallback src={v as string} section="intellect" alt="" className="table-thumb" />,
    },
    { key: 'title', label: 'Title' },
    { key: 'issuer', label: 'Issuer' },
    { key: 'year', label: 'Year', render: (v) => (v ? String(v) : '—') },
    { key: 'is_visible', label: 'Status', render: (v) => <VisibilityPill visible={v as boolean} /> },
  ]

  const academicColumns: DataTableColumn<AcademicProject>[] = [
    { key: 'title', label: 'Title' },
    { key: 'course', label: 'Course', render: (v) => (v ? String(v) : '—') },
    { key: 'year', label: 'Year', render: (v) => (v ? String(v) : '—') },
    { key: 'is_visible', label: 'Status', render: (v) => <VisibilityPill visible={v as boolean} /> },
  ]

  const skillColumns: DataTableColumn<Skill>[] = [
    {
      key: 'image_url',
      label: 'Logo',
      render: (v) => <ImageWithFallback src={v as string} section="intellect" alt="" className="table-thumb" />,
    },
    { key: 'skill_name', label: 'Skill' },
    { key: 'is_visible', label: 'Status', render: (v) => <VisibilityPill visible={v as boolean} /> },
  ]

  return (
    <AdminLayout title="Intellect Management" backTo="/admin/management" section="intellect">
      {/* Page content */}
      <div className="section-block">
        <div className="section-block__header">
          <h2 className="section-block__title">Greeting & Quote</h2>
          <div className="section-block__actions">
            <Button size="sm" onClick={() => setPageContentModalOpen(true)}>
              Edit
            </Button>
          </div>
        </div>
        <div className="admin-card" style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          <ImageWithFallback
            src={pageContent.data?.image_url}
            section="intellect"
            alt=""
            style={{ width: 56, height: 56, objectFit: 'cover', border: '2px solid var(--border)', flexShrink: 0 }}
          />
          <div>
            <div style={{ fontSize: 13 }}>
              <strong>Greeting:</strong> {pageContent.data?.greeting_text || '—'}
            </div>
            <div style={{ fontSize: 13, marginTop: 6 }}>
              <strong>Quote:</strong> {pageContent.data?.quote_text || '—'}
            </div>
          </div>
        </div>
      </div>

      {/* Projects */}
      <div className="section-block">
        <div className="section-block__header">
          <h2 className="section-block__title">Projects</h2>
          <div className="section-block__actions">
            <Button size="sm" onClick={() => setProjectModal({ open: true, data: null })}>
              Add project
            </Button>
          </div>
        </div>
        <DataTable
          columns={projectColumns}
          data={projects.data}
          loading={projects.loading}
          emptyMessage="No projects yet."
          onEdit={(row) => setProjectModal({ open: true, data: row })}
          onDelete={(row) => setDeleteTarget({ type: 'project', id: row.id, label: row.title })}
        />
      </div>

      {/* Skills, grouped by category */}
      <div className="section-block">
        <div className="section-block__header">
          <h2 className="section-block__title">Skills</h2>
          <div className="section-block__actions">
            <Button size="sm" onClick={() => setSkillModal({ open: true, data: null })}>
              Add skill
            </Button>
          </div>
        </div>
        {SKILL_CATEGORIES.map((category) => (
          <div key={category} style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
              {category}
            </div>
            <DataTable
              columns={skillColumns}
              data={skills.data.filter((s) => s.category === category)}
              loading={skills.loading}
              emptyMessage={`No ${category.toLowerCase()} yet.`}
              onEdit={(row) => setSkillModal({ open: true, data: row })}
              onDelete={(row) => setDeleteTarget({ type: 'skill', id: row.id, label: row.skill_name })}
            />
          </div>
        ))}
      </div>

      {/* Certifications */}
      <div className="section-block">
        <div className="section-block__header">
          <h2 className="section-block__title">Certifications</h2>
          <div className="section-block__actions">
            <Button size="sm" onClick={() => setCertModal({ open: true, data: null })}>
              Add certification
            </Button>
          </div>
        </div>
        <DataTable
          columns={certColumns}
          data={certifications.data}
          loading={certifications.loading}
          emptyMessage="No certifications yet."
          onEdit={(row) => setCertModal({ open: true, data: row })}
          onDelete={(row) => setDeleteTarget({ type: 'certification', id: row.id, label: row.title })}
        />
      </div>

      {/* Academic projects */}
      <div className="section-block">
        <div className="section-block__header">
          <h2 className="section-block__title">Academic Projects</h2>
          <div className="section-block__actions">
            <Button size="sm" onClick={() => setAcademicModal({ open: true, data: null })}>
              Add academic project
            </Button>
          </div>
        </div>
        <DataTable
          columns={academicColumns}
          data={academicProjects.data}
          loading={academicProjects.loading}
          emptyMessage="No academic projects yet."
          onEdit={(row) => setAcademicModal({ open: true, data: row })}
          onDelete={(row) => setDeleteTarget({ type: 'academic', id: row.id, label: row.title })}
        />
      </div>

      <PageContentModal
        isOpen={pageContentModalOpen}
        onClose={() => setPageContentModalOpen(false)}
        initialData={pageContent.data}
        section="intellect"
        onSave={pageContent.save}
      />
      <ProjectModal
        isOpen={projectModal.open}
        onClose={() => setProjectModal({ open: false, data: null })}
        initialData={projectModal.data}
        onCreate={projects.create}
        onUpdate={projects.update}
      />
      <SkillModal
        isOpen={skillModal.open}
        onClose={() => setSkillModal({ open: false, data: null })}
        initialData={skillModal.data}
        onCreate={skills.create}
        onUpdate={skills.update}
      />
      <CertificationModal
        isOpen={certModal.open}
        onClose={() => setCertModal({ open: false, data: null })}
        initialData={certModal.data}
        onCreate={certifications.create}
        onUpdate={certifications.update}
      />
      <AcademicProjectModal
        isOpen={academicModal.open}
        onClose={() => setAcademicModal({ open: false, data: null })}
        initialData={academicModal.data}
        onCreate={academicProjects.create}
        onUpdate={academicProjects.update}
      />
      <DeleteConfirmation
        isOpen={!!deleteTarget}
        itemLabel={deleteTarget?.label || ''}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        isLoading={deleting}
      />
    </AdminLayout>
  )
}
