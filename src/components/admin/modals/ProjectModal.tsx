import { useEffect, useState } from 'react'
import { Modal } from '@/components/admin/Modal'
import { FormInput } from '@/components/admin/FormInput'
import { TagsInput } from '@/components/admin/TagsInput'
import { ImageUpload } from '@/components/admin/ImageUpload'
import { MultiImageUpload } from '@/components/admin/MultiImageUpload'
import { ToggleSwitch } from '@/components/common/ToggleSwitch'
import { Button } from '@/components/common/Button'
import type { Project, ProjectWithTech } from '@/types'

interface ProjectModalProps {
  isOpen: boolean
  onClose: () => void
  initialData: ProjectWithTech | null
  onCreate: (payload: Partial<Project>, technologies: string[]) => Promise<unknown>
  onUpdate: (id: string, payload: Partial<Project>, technologies: string[]) => Promise<unknown>
}

const CATEGORY_OPTIONS = [
  { value: 'Web Development', label: 'Web Development' },
  { value: 'UI/UX', label: 'UI/UX' },
  { value: 'Data & Database', label: 'Data & Database' },
  { value: 'Mobile', label: 'Mobile' },
  { value: 'Other', label: 'Other' },
]

const emptyForm = {
  title: '',
  short_description: '',
  long_description: '',
  image_url: '',
  live_demo_url: '',
  github_url: '',
  blog_url: '',
  year: '',
  category: '',
  position: '0',
  is_featured: false,
  is_visible: true,
}

export function ProjectModal({ isOpen, onClose, initialData, onCreate, onUpdate }: ProjectModalProps) {
  const [form, setForm] = useState(emptyForm)
  const [technologies, setTechnologies] = useState<string[]>([])
  const [additionalImages, setAdditionalImages] = useState<string[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen) return
    if (initialData) {
      setForm({
        title: initialData.title,
        short_description: initialData.short_description || '',
        long_description: initialData.long_description || '',
        image_url: initialData.image_url || '',
        live_demo_url: initialData.live_demo_url || '',
        github_url: initialData.github_url || '',
        blog_url: initialData.blog_url || '',
        year: initialData.year?.toString() || '',
        category: initialData.category || '',
        position: initialData.position?.toString() || '0',
        is_featured: initialData.is_featured,
        is_visible: initialData.is_visible,
      })
      setTechnologies(initialData.technologies || [])
      setAdditionalImages(initialData.additional_images || [])
    } else {
      setForm(emptyForm)
      setTechnologies([])
      setAdditionalImages([])
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
      const payload: Partial<Project> = {
        title: form.title.trim(),
        short_description: form.short_description.trim() || null,
        long_description: form.long_description.trim() || null,
        image_url: form.image_url.trim() || null,
        additional_images: additionalImages.length ? additionalImages : null,
        live_demo_url: form.live_demo_url.trim() || null,
        github_url: form.github_url.trim() || null,
        blog_url: form.blog_url.trim() || null,
        year: form.year ? Number(form.year) : null,
        category: form.category.trim() || null,
        position: Number(form.position) || 0,
        is_featured: form.is_featured,
        is_visible: form.is_visible,
      }
      if (initialData) {
        await onUpdate(initialData.id, payload, technologies)
      } else {
        await onCreate(payload, technologies)
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
      title={initialData ? 'Edit project' : 'Add project'}
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
        label="Short description"
        name="short_description"
        type="textarea"
        rows={2}
        value={form.short_description}
        onChange={(v) => setForm((f) => ({ ...f, short_description: v }))}
      />
      <FormInput
        label="Long description"
        name="long_description"
        type="textarea"
        value={form.long_description}
        onChange={(v) => setForm((f) => ({ ...f, long_description: v }))}
      />
      <ImageUpload
        label="Cover image"
        section="intellect"
        currentImage={form.image_url || null}
        onUpload={(url) => setForm((f) => ({ ...f, image_url: url }))}
      />
      <MultiImageUpload
        label="Additional images"
        section="intellect"
        values={additionalImages}
        onChange={setAdditionalImages}
        max={3}
      />
      <TagsInput
        label="Technologies"
        values={technologies}
        onChange={setTechnologies}
        placeholder="Type a tech and press Enter"
      />
      <div className="form-row">
        <FormInput
          label="Live demo URL"
          name="live_demo_url"
          type="url"
          value={form.live_demo_url}
          onChange={(v) => setForm((f) => ({ ...f, live_demo_url: v }))}
        />
        <FormInput
          label="GitHub URL"
          name="github_url"
          type="url"
          value={form.github_url}
          onChange={(v) => setForm((f) => ({ ...f, github_url: v }))}
        />
      </div>
      <div className="form-row">
        <FormInput
          label="Blog URL"
          name="blog_url"
          type="url"
          value={form.blog_url}
          onChange={(v) => setForm((f) => ({ ...f, blog_url: v }))}
        />
        <FormInput
          label="Year"
          name="year"
          type="number"
          value={form.year}
          onChange={(v) => setForm((f) => ({ ...f, year: v }))}
        />
      </div>
      <div className="form-row">
        <FormInput
          label="Category"
          name="category"
          type="select"
          options={CATEGORY_OPTIONS}
          value={form.category}
          onChange={(v) => setForm((f) => ({ ...f, category: v }))}
        />
        <FormInput
          label="Sort order"
          name="position"
          type="number"
          value={form.position}
          onChange={(v) => setForm((f) => ({ ...f, position: v }))}
        />
      </div>
      <ToggleSwitch
        checked={form.is_featured}
        onChange={(v) => setForm((f) => ({ ...f, is_featured: v }))}
        label="Featured"
      />
      <div style={{ height: 8 }} />
      <ToggleSwitch
        checked={form.is_visible}
        onChange={(v) => setForm((f) => ({ ...f, is_visible: v }))}
        label="Visible on site"
      />
    </Modal>
  )
}
