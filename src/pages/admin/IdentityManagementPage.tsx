// src/pages/admin/IdentityManagementPage.tsx
import { useState } from 'react'
import toast from 'react-hot-toast'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { Button } from '@/components/common/Button'
import { DataTable, type DataTableColumn } from '@/components/admin/DataTable'
import { DeleteConfirmation } from '@/components/admin/DeleteConfirmation'
import { VisibilityPill } from '@/components/admin/VisibilityPill'
import { ImageWithFallback } from '@/components/admin/ImageWithFallback'
import { EducationModal } from '@/components/admin/modals/EducationModal'
import { ExperienceModal } from '@/components/admin/modals/ExperienceModal'
import { LanguageModal } from '@/components/admin/modals/LanguageModal'
import { ProfileModal } from '@/components/admin/modals/ProfileModal'
import { SocialModal } from '@/components/admin/modals/SocialModal'
import { useSupabaseTable } from '@/hooks/useSupabaseTable'
import { useProfile } from '@/hooks/useProfile'
import type { Education, Experience, Language, Social } from '@/types'
type DeleteTarget =
  | { type: 'education'; id: string; label: string }
  | { type: 'experience'; id: string; label: string }
  | { type: 'language'; id: string; label: string }
  | { type: 'social'; id: string; label: string }
export function IdentityManagementPage() {
  const profile = useProfile()
  const socials = useSupabaseTable<Social>('socials')
  const education = useSupabaseTable<Education>('education')
  const experience = useSupabaseTable<Experience>('experience', { column: 'position_order' })
  const languages = useSupabaseTable<Language>('languages')
  const [profileModalOpen, setProfileModalOpen] = useState(false)
  const [socialModal, setSocialModal] = useState<{ open: boolean; data: Social | null }>({
    open: false,
    data: null,
  })
  const [educationModal, setEducationModal] = useState<{ open: boolean; data: Education | null }>({
    open: false,
    data: null,
  })
  const [experienceModal, setExperienceModal] = useState<{ open: boolean; data: Experience | null }>({
    open: false,
    data: null,
  })
  const [languageModal, setLanguageModal] = useState<{ open: boolean; data: Language | null }>({
    open: false,
    data: null,
  })
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null)
  const [deleting, setDeleting] = useState(false)
  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      if (deleteTarget.type === 'education') await education.remove(deleteTarget.id)
      if (deleteTarget.type === 'experience') await experience.remove(deleteTarget.id)
      if (deleteTarget.type === 'language') await languages.remove(deleteTarget.id)
      if (deleteTarget.type === 'social') await socials.remove(deleteTarget.id)
      toast.success('Deleted.')
      setDeleteTarget(null)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Could not delete. Try again.')
    } finally {
      setDeleting(false)
    }
  }
  const educationColumns: DataTableColumn<Education>[] = [
    {
      key: 'image_url',
      label: 'Photo',
      render: (v) => <ImageWithFallback src={v as string} section="identity" alt="" className="table-thumb" />,
    },
    {
      key: 'logo_url',
      label: 'Logo',
      render: (v) => <ImageWithFallback src={v as string} section="identity" alt="" className="table-thumb" />,
    },
    { key: 'institution', label: 'Institution' },
    { key: 'degree', label: 'Degree' },
    { key: 'field', label: 'Field' },
    {
      key: 'start_year',
      label: 'Years',
      render: (_v, row) => `${row.start_year ?? '—'}–${row.end_year ?? 'Present'}`,
    },
    { key: 'is_visible', label: 'Status', render: (v) => <VisibilityPill visible={v as boolean} /> },
  ]
  const experienceColumns: DataTableColumn<Experience>[] = [
    {
      key: 'logo_url',
      label: 'Logo',
      render: (v) => <ImageWithFallback src={v as string} section="identity" alt="" className="table-thumb" />,
    },
    {
      key: 'image_url',
      label: 'Photo',
      render: (v) => <ImageWithFallback src={v as string} section="identity" alt="" className="table-thumb" />,
    },
    { key: 'company', label: 'Company' },
    { key: 'position', label: 'Position' },
    { key: 'duration', label: 'Duration' },
    { key: 'is_visible', label: 'Status', render: (v) => <VisibilityPill visible={v as boolean} /> },
  ]
  const languageColumns: DataTableColumn<Language>[] = [
    { key: 'name', label: 'Language' },
    { key: 'level', label: 'Level' },
    { key: 'is_visible', label: 'Status', render: (v) => <VisibilityPill visible={v as boolean} /> },
  ]
  const socialColumns: DataTableColumn<Social>[] = [
    { key: 'platform', label: 'Platform' },
    { key: 'url', label: 'URL', render: (v) => (v ? String(v) : '—') },
    { key: 'is_visible', label: 'Status', render: (v) => <VisibilityPill visible={v as boolean} /> },
  ]
  return (
    <AdminLayout title="Identity Management" backTo="/admin/management" section="identity">
      <div className="section-block">
        <div className="section-block__header">
          <h2 className="section-block__title">Profile & Contact</h2>
          <div className="section-block__actions">
            <Button size="sm" onClick={() => setProfileModalOpen(true)}>
              Edit profile
            </Button>
            <Button size="sm" onClick={() => setSocialModal({ open: true, data: null })}>
              Add social link
            </Button>
          </div>
        </div>
        {profile.data && (
          <div className="admin-card" style={{ marginBottom: 14, display: 'flex', gap: 14, alignItems: 'center' }}>
            <ImageWithFallback
              src={profile.data.photo_url}
              section="identity"
              alt={profile.data.name}
              style={{ width: 56, height: 56, objectFit: 'cover', border: '2px solid var(--border)', flexShrink: 0 }}
            />
            <div>
              <strong>{profile.data.name}</strong>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
                {[profile.data.email, profile.data.phone, profile.data.location].filter(Boolean).join(' · ') || 'No contact details yet.'}
              </div>
            </div>
          </div>
        )}
        <DataTable
          columns={socialColumns}
          data={socials.data}
          loading={socials.loading}
          emptyMessage="No social links yet."
          onEdit={(row) => setSocialModal({ open: true, data: row })}
          onDelete={(row) => setDeleteTarget({ type: 'social', id: row.id, label: row.platform })}
        />
      </div>
      <div className="section-block">
        <div className="section-block__header">
          <h2 className="section-block__title">Education</h2>
          <div className="section-block__actions">
            <Button size="sm" onClick={() => setEducationModal({ open: true, data: null })}>
              Add education
            </Button>
          </div>
        </div>
        <DataTable
          columns={educationColumns}
          data={education.data}
          loading={education.loading}
          emptyMessage="No education entries yet."
          onEdit={(row) => setEducationModal({ open: true, data: row })}
          onDelete={(row) => setDeleteTarget({ type: 'education', id: row.id, label: row.institution })}
        />
      </div>
      <div className="section-block">
        <div className="section-block__header">
          <h2 className="section-block__title">Experience</h2>
          <div className="section-block__actions">
            <Button size="sm" onClick={() => setExperienceModal({ open: true, data: null })}>
              Add experience
            </Button>
          </div>
        </div>
        <DataTable
          columns={experienceColumns}
          data={experience.data}
          loading={experience.loading}
          emptyMessage="No experience entries yet."
          onEdit={(row) => setExperienceModal({ open: true, data: row })}
          onDelete={(row) => setDeleteTarget({ type: 'experience', id: row.id, label: row.company })}
        />
      </div>
      <div className="section-block">
        <div className="section-block__header">
          <h2 className="section-block__title">Languages</h2>
          <div className="section-block__actions">
            <Button size="sm" onClick={() => setLanguageModal({ open: true, data: null })}>
              Add language
            </Button>
          </div>
        </div>
        <DataTable
          columns={languageColumns}
          data={languages.data}
          loading={languages.loading}
          emptyMessage="No languages yet."
          onEdit={(row) => setLanguageModal({ open: true, data: row })}
          onDelete={(row) => setDeleteTarget({ type: 'language', id: row.id, label: row.name })}
        />
      </div>
      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        initialData={profile.data}
        onSave={profile.save}
      />
      <SocialModal
        isOpen={socialModal.open}
        onClose={() => setSocialModal({ open: false, data: null })}
        initialData={socialModal.data}
        onCreate={socials.create}
        onUpdate={socials.update}
      />
      <EducationModal
        isOpen={educationModal.open}
        onClose={() => setEducationModal({ open: false, data: null })}
        initialData={educationModal.data}
        onCreate={education.create}
        onUpdate={education.update}
      />
      <ExperienceModal
        isOpen={experienceModal.open}
        onClose={() => setExperienceModal({ open: false, data: null })}
        initialData={experienceModal.data}
        onCreate={experience.create}
        onUpdate={experience.update}
      />
      <LanguageModal
        isOpen={languageModal.open}
        onClose={() => setLanguageModal({ open: false, data: null })}
        initialData={languageModal.data}
        onCreate={languages.create}
        onUpdate={languages.update}
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