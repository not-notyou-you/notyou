import { useEffect, useState } from 'react'
import { Modal } from '@/components/admin/Modal'
import { FormInput } from '@/components/admin/FormInput'
import { ImageUpload } from '@/components/admin/ImageUpload'
import { ToggleSwitch } from '@/components/common/ToggleSwitch'
import { Button } from '@/components/common/Button'
import type { Experience } from '@/types'

interface ExperienceModalProps {
  isOpen: boolean
  onClose: () => void
  initialData: Experience | null
  onCreate: (payload: Partial<Experience>) => Promise<unknown>
  onUpdate: (id: string, payload: Partial<Experience>) => Promise<unknown>
}

const emptyForm = {
  company: '',
  position: '',
  start_date: '',
  end_date: '',
  duration: '',
  location: '',
  description: '',
  institution_details: '',
  logo_url: '',
  position_order: '0',
  is_visible: true,
}

export function ExperienceModal({ isOpen, onClose, initialData, onCreate, onUpdate }: ExperienceModalProps) {
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen) return
    if (initialData) {
      setForm({
        company: initialData.company,
        position: initialData.position,
        start_date: initialData.start_date || '',
        end_date: initialData.end_date || '',
        duration: initialData.duration || '',
        location: initialData.location || '',
        description: initialData.description || '',
        institution_details: initialData.institution_details || '',
        logo_url: initialData.logo_url || '',
        position_order: initialData.position_order?.toString() || '0',
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
    if (!form.company.trim()) next.company = 'Company is required.'
    if (!form.position.trim()) next.position = 'Position is required.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setSaving(true)
    setSubmitError(null)
    try {
      const payload: Partial<Experience> = {
        company: form.company.trim(),
        position: form.position.trim(),
        start_date: form.start_date.trim() || null,
        end_date: form.end_date.trim() || null,
        duration: form.duration.trim() || null,
        location: form.location.trim() || null,
        description: form.description.trim() || null,
        institution_details: form.institution_details.trim() || null,
        logo_url: form.logo_url.trim() || null,
        position_order: Number(form.position_order) || 0,
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
      title={initialData ? 'Edit experience' : 'Add experience'}
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
          label="Company"
          name="company"
          required
          value={form.company}
          onChange={(v) => setForm((f) => ({ ...f, company: v }))}
          error={errors.company}
        />
        <FormInput
          label="Position"
          name="position"
          required
          value={form.position}
          onChange={(v) => setForm((f) => ({ ...f, position: v }))}
          error={errors.position}
        />
      </div>
      <div className="form-row">
        <FormInput
          label="Start date"
          name="start_date"
          placeholder="e.g. Jun 2025"
          value={form.start_date}
          onChange={(v) => setForm((f) => ({ ...f, start_date: v }))}
        />
        <FormInput
          label="End date"
          name="end_date"
          placeholder="e.g. Present"
          value={form.end_date}
          onChange={(v) => setForm((f) => ({ ...f, end_date: v }))}
        />
      </div>
      <div className="form-row">
        <FormInput
          label="Duration"
          name="duration"
          placeholder="e.g. 6 months"
          value={form.duration}
          onChange={(v) => setForm((f) => ({ ...f, duration: v }))}
        />
        <FormInput
          label="Location"
          name="location"
          value={form.location}
          onChange={(v) => setForm((f) => ({ ...f, location: v }))}
        />
      </div>
      <FormInput
        label="Description"
        name="description"
        type="textarea"
        value={form.description}
        onChange={(v) => setForm((f) => ({ ...f, description: v }))}
      />
      <FormInput
        label="Institution details"
        name="institution_details"
        type="textarea"
        value={form.institution_details}
        onChange={(v) => setForm((f) => ({ ...f, institution_details: v }))}
      />
      <ImageUpload
        label="Institution / company logo"
        section="identity"
        currentImage={form.logo_url || null}
        onUpload={(url) => setForm((f) => ({ ...f, logo_url: url }))}
      />
      <FormInput
        label="Sort order"
        name="position_order"
        type="number"
        value={form.position_order}
        onChange={(v) => setForm((f) => ({ ...f, position_order: v }))}
      />
      <ToggleSwitch
        checked={form.is_visible}
        onChange={(v) => setForm((f) => ({ ...f, is_visible: v }))}
        label="Visible on site"
      />
    </Modal>
  )
}
