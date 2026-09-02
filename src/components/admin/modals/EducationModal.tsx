// src/components/admin/modals/EducationModal.tsx
import { useEffect, useState } from 'react'
import { Modal } from '@/components/admin/Modal'
import { FormInput } from '@/components/admin/FormInput'
import { ImageUpload } from '@/components/admin/ImageUpload'
import { ToggleSwitch } from '@/components/common/ToggleSwitch'
import { Button } from '@/components/common/Button'
import type { Education } from '@/types'
interface EducationModalProps {
  isOpen: boolean
  onClose: () => void
  initialData: Education | null
  onCreate: (payload: Partial<Education>) => Promise<unknown>
  onUpdate: (id: string, payload: Partial<Education>) => Promise<unknown>
}
const emptyForm = {
  institution: '',
  degree: '',
  field: '',
  start_year: '',
  end_year: '',
  gpa: '',
  honors: '',
  details: '',
  image_url: '',
  logo_url: '',
  position: '0',
  is_visible: true,
}
export function EducationModal({ isOpen, onClose, initialData, onCreate, onUpdate }: EducationModalProps) {
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  useEffect(() => {
    if (!isOpen) return
    if (initialData) {
      setForm({
        institution: initialData.institution,
        degree: initialData.degree || '',
        field: initialData.field,
        start_year: initialData.start_year?.toString() || '',
        end_year: initialData.end_year?.toString() || '',
        gpa: initialData.gpa || '',
        honors: initialData.honors || '',
        details: initialData.details || '',
        image_url: initialData.image_url || '',
        logo_url: initialData.logo_url || '',
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
    if (!form.institution.trim()) next.institution = 'Institution is required.'
    if (!form.field.trim()) next.field = 'Field is required.'
    if (!form.start_year.trim()) next.start_year = 'Start year is required.'
    setErrors(next)
    return Object.keys(next).length === 0
  }
  const handleSubmit = async () => {
    if (!validate()) return
    setSaving(true)
    setSubmitError(null)
    try {
      const payload: Partial<Education> = {
        institution: form.institution.trim(),
        degree: form.degree.trim() || null,
        field: form.field.trim(),
        start_year: Number(form.start_year),
        end_year: form.end_year ? Number(form.end_year) : null,
        gpa: form.gpa.trim() || null,
        honors: form.honors.trim() || null,
        details: form.details.trim() || null,
        image_url: form.image_url.trim() || null,
        logo_url: form.logo_url.trim() || null,
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
      title={initialData ? 'Edit education' : 'Add education'}
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
        label="Institution"
        name="institution"
        required
        value={form.institution}
        onChange={(v) => setForm((f) => ({ ...f, institution: v }))}
        error={errors.institution}
      />
      <div className="form-row">
        <FormInput
          label="Degree"
          name="degree"
          value={form.degree}
          onChange={(v) => setForm((f) => ({ ...f, degree: v }))}
        />
        <FormInput
          label="Field"
          name="field"
          required
          value={form.field}
          onChange={(v) => setForm((f) => ({ ...f, field: v }))}
          error={errors.field}
        />
      </div>
      <div className="form-row">
        <FormInput
          label="Start year"
          name="start_year"
          type="number"
          required
          value={form.start_year}
          onChange={(v) => setForm((f) => ({ ...f, start_year: v }))}
          error={errors.start_year}
        />
        <FormInput
          label="End year"
          name="end_year"
          type="number"
          placeholder="Leave blank if ongoing"
          value={form.end_year}
          onChange={(v) => setForm((f) => ({ ...f, end_year: v }))}
        />
      </div>
      <div className="form-row">
        <FormInput label="GPA" name="gpa" value={form.gpa} onChange={(v) => setForm((f) => ({ ...f, gpa: v }))} />
        <FormInput
          label="Honors"
          name="honors"
          value={form.honors}
          onChange={(v) => setForm((f) => ({ ...f, honors: v }))}
        />
      </div>
      <FormInput
        label="Details"
        name="details"
        type="textarea"
        value={form.details}
        onChange={(v) => setForm((f) => ({ ...f, details: v }))}
      />
      <ImageUpload
        label="Institution photo"
        section="identity"
        currentImage={form.image_url || null}
        onUpload={(url) => setForm((f) => ({ ...f, image_url: url }))}
      />
      <ImageUpload
        label="Institution logo"
        section="identity"
        currentImage={form.logo_url || null}
        onUpload={(url) => setForm((f) => ({ ...f, logo_url: url }))}
      />
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