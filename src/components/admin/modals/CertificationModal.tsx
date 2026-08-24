import { useEffect, useState } from 'react'
import { Modal } from '@/components/admin/Modal'
import { FormInput } from '@/components/admin/FormInput'
import { ImageUpload } from '@/components/admin/ImageUpload'
import { ToggleSwitch } from '@/components/common/ToggleSwitch'
import { Button } from '@/components/common/Button'
import type { Certification } from '@/types'

interface CertificationModalProps {
  isOpen: boolean
  onClose: () => void
  initialData: Certification | null
  onCreate: (payload: Partial<Certification>) => Promise<unknown>
  onUpdate: (id: string, payload: Partial<Certification>) => Promise<unknown>
}

const emptyForm = {
  title: '',
  issuer: '',
  skills: '',
  certification_url: '',
  image_url: '',
  year: '',
  position: '0',
  is_visible: true,
}

export function CertificationModal({ isOpen, onClose, initialData, onCreate, onUpdate }: CertificationModalProps) {
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen) return
    if (initialData) {
      setForm({
        title: initialData.title,
        issuer: initialData.issuer,
        skills: initialData.skills || '',
        certification_url: initialData.certification_url || '',
        image_url: initialData.image_url || '',
        year: initialData.year?.toString() || '',
        position: initialData.position?.toString() || '0',
        is_visible: initialData.is_visible,
      })
    } else {
      setForm(emptyForm)
    }
    setErrors({})
    setSubmitError(null)
  }, [isOpen, initialData])

  const validate = () => {
    const next: Record<string, string> = {}
    if (!form.title.trim()) next.title = 'Title is required.'
    if (!form.issuer.trim()) next.issuer = 'Issuer is required.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setSaving(true)
    setSubmitError(null)
    try {
      const payload: Partial<Certification> = {
        title: form.title.trim(),
        issuer: form.issuer.trim(),
        skills: form.skills.trim() || null,
        certification_url: form.certification_url.trim() || null,
        image_url: form.image_url.trim() || null,
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
      title={initialData ? 'Edit certification' : 'Add certification'}
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
          label="Issuer"
          name="issuer"
          required
          value={form.issuer}
          onChange={(v) => setForm((f) => ({ ...f, issuer: v }))}
          error={errors.issuer}
        />
      </div>
      <FormInput
        label="Skills covered"
        name="skills"
        type="textarea"
        rows={2}
        value={form.skills}
        onChange={(v) => setForm((f) => ({ ...f, skills: v }))}
      />
      <div className="form-row">
        <FormInput
          label="Certification URL"
          name="certification_url"
          type="url"
          value={form.certification_url}
          onChange={(v) => setForm((f) => ({ ...f, certification_url: v }))}
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
      <ImageUpload
        label="Certificate photo"
        section="intellect"
        currentImage={form.image_url || null}
        onUpload={(url) => setForm((f) => ({ ...f, image_url: url }))}
      />
      <ToggleSwitch
        checked={form.is_visible}
        onChange={(v) => setForm((f) => ({ ...f, is_visible: v }))}
        label="Visible on site"
      />
    </Modal>
  )
}
