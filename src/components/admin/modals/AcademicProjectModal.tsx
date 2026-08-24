import { useEffect, useState } from 'react'
import { Modal } from '@/components/admin/Modal'
import { FormInput } from '@/components/admin/FormInput'
import { TagsInput } from '@/components/admin/TagsInput'
import { ToggleSwitch } from '@/components/common/ToggleSwitch'
import { Button } from '@/components/common/Button'
import type { AcademicProject } from '@/types'

interface AcademicProjectModalProps {
  isOpen: boolean
  onClose: () => void
  initialData: AcademicProject | null
  onCreate: (payload: Partial<AcademicProject>) => Promise<unknown>
  onUpdate: (id: string, payload: Partial<AcademicProject>) => Promise<unknown>
}

const emptyForm = {
  title: '',
  course: '',
  description: '',
  project_url: '',
  year: '',
  position: '0',
  is_visible: true,
}

export function AcademicProjectModal({
  isOpen,
  onClose,
  initialData,
  onCreate,
  onUpdate,
}: AcademicProjectModalProps) {
  const [form, setForm] = useState(emptyForm)
  const [technologies, setTechnologies] = useState<string[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen) return
    if (initialData) {
      setForm({
        title: initialData.title,
        course: initialData.course || '',
        description: initialData.description || '',
        project_url: initialData.project_url || '',
        year: initialData.year?.toString() || '',
        position: initialData.position?.toString() || '0',
        is_visible: initialData.is_visible,
      })
      setTechnologies(initialData.technologies || [])
    } else {
      setForm(emptyForm)
      setTechnologies([])
    }
    setErrors({})
    setSubmitError(null)
  }, [isOpen, initialData])

  const validate = () => {
    const next: Record<string, string> = {}
    if (!form.title.trim()) next.title = 'Title is required.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setSaving(true)
    setSubmitError(null)
    try {
      const payload: Partial<AcademicProject> = {
        title: form.title.trim(),
        course: form.course.trim() || null,
        description: form.description.trim() || null,
        technologies: technologies.length ? technologies : null,
        project_url: form.project_url.trim() || null,
        year: form.year ? Number(form.year) : null,
        position: Number(form.position) || 0,
        is_visible: form.is_visible,
      }
      if (initialData) {
        await onUpdate(initialData.id, payload)
      } else {
        await onCreate(payload)
      }
      onClose()
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : 'Could not save. Try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      title={initialData ? 'Edit academic project' : 'Add academic project'}
      onClose={onClose}
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} loading={saving}>
            Save
          </Button>
        </>
      }
    >
      {submitError && <div className="modal-error">{submitError}</div>}
      <FormInput
        label="Title"
        name="title"
        required
        value={form.title}
        onChange={(v) => setForm((f) => ({ ...f, title: v }))}
        error={errors.title}
      />
      <FormInput
        label="Course"
        name="course"
        value={form.course}
        onChange={(v) => setForm((f) => ({ ...f, course: v }))}
      />
      <FormInput
        label="Description"
        name="description"
        type="textarea"
        value={form.description}
        onChange={(v) => setForm((f) => ({ ...f, description: v }))}
      />
      <TagsInput
        label="Technologies"
        values={technologies}
        onChange={setTechnologies}
        placeholder="Type a tech and press Enter"
      />
      <div className="form-row">
        <FormInput
          label="Project URL"
          name="project_url"
          type="url"
          value={form.project_url}
          onChange={(v) => setForm((f) => ({ ...f, project_url: v }))}
        />
        <FormInput
          label="Year"
          name="year"
          type="number"
          value={form.year}
          onChange={(v) => setForm((f) => ({ ...f, year: v }))}
        />
      </div>
      <FormInput
        label="Sort order"
        name="position"
        type="number"
        value={form.position}
        onChange={(v) => setForm((f) => ({ ...f, position: v }))}
      />
      <ToggleSwitch
        checked={form.is_visible}
        onChange={(v) => setForm((f) => ({ ...f, is_visible: v }))}
        label="Visible on site"
      />
    </Modal>
  )
}
