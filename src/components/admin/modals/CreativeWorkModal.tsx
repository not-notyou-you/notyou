import { useEffect, useState } from 'react'
import { Modal } from '@/components/admin/Modal'
import { FormInput } from '@/components/admin/FormInput'
import { ImageUpload } from '@/components/admin/ImageUpload'
import { ToggleSwitch } from '@/components/common/ToggleSwitch'
import { Button } from '@/components/common/Button'
import type { CreativeCategory, CreativeWork } from '@/types'

interface CreativeWorkModalProps {
  isOpen: boolean
  onClose: () => void
  initialData: CreativeWork | null
  /** Preselects the category tab that was active when "Create" was clicked. */
  defaultCategory?: CreativeCategory
  onCreate: (payload: Partial<CreativeWork>) => Promise<unknown>
  onUpdate: (id: string, payload: Partial<CreativeWork>) => Promise<unknown>
}

const CATEGORY_OPTIONS = [
  { value: 'digital', label: 'Digital' },
  { value: 'traditional', label: 'Traditional' },
  { value: 'stickers', label: 'Stickers' },
]

export function CreativeWorkModal({
  isOpen,
  onClose,
  initialData,
  defaultCategory,
  onCreate,
  onUpdate,
}: CreativeWorkModalProps) {
  const emptyForm = {
    title: '',
    description: '',
    category: (defaultCategory || '') as CreativeCategory | '',
    image_url: '',
    project_link: '',
    year: '',
    position: '0',
    is_visible: true,
  }
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen) return
    if (initialData) {
      setForm({
        title: initialData.title,
        description: initialData.description || '',
        category: initialData.category,
        image_url: initialData.image_url || '',
        project_link: initialData.project_link || '',
        year: initialData.year?.toString() || '',
        position: initialData.position?.toString() || '0',
        is_visible: initialData.is_visible,
      })
    } else {
      setForm({ ...emptyForm, category: (defaultCategory || '') as CreativeCategory | '' })
    }
    setErrors({})
    setSubmitError(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, initialData])

  const validate = () => {
    const next: Record<string, string> = {}
    if (!form.title.trim()) next.title = 'Title is required.'
    if (!form.category) next.category = 'Category is required.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setSaving(true)
    setSubmitError(null)
    try {
      const payload: Partial<CreativeWork> = {
        title: form.title.trim(),
        description: form.description.trim() || null,
        category: form.category as CreativeCategory,
        image_url: form.image_url.trim() || null,
        project_link: form.project_link.trim() || null,
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
      title={initialData ? 'Edit creative work' : 'Add creative work'}
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
      <div className="form-row">
        <FormInput
          label="Title"
          name="title"
          required
          value={form.title}
          onChange={(v) => setForm((f) => ({ ...f, title: v }))}
          error={errors.title}
        />
        <FormInput
          label="Category"
          name="category"
          type="select"
          required
          options={CATEGORY_OPTIONS}
          value={form.category}
          onChange={(v) => setForm((f) => ({ ...f, category: v as CreativeCategory }))}
          error={errors.category}
        />
      </div>
      <FormInput
        label="Description"
        name="description"
        type="textarea"
        rows={2}
        value={form.description}
        onChange={(v) => setForm((f) => ({ ...f, description: v }))}
      />
      <ImageUpload
        label="Artwork image"
        section="passion"
        currentImage={form.image_url || null}
        onUpload={(url) => setForm((f) => ({ ...f, image_url: url }))}
      />
      <div className="form-row">
        <FormInput
          label="Project link"
          name="project_link"
          type="url"
          value={form.project_link}
          onChange={(v) => setForm((f) => ({ ...f, project_link: v }))}
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
