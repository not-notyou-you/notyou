import { useEffect, useState } from 'react'
import { Modal } from '@/components/admin/Modal'
import { FormInput } from '@/components/admin/FormInput'
import { ImageUpload } from '@/components/admin/ImageUpload'
import { ToggleSwitch } from '@/components/common/ToggleSwitch'
import { Button } from '@/components/common/Button'
import type { CarouselPhoto } from '@/types'

interface CarouselPhotoModalProps {
  isOpen: boolean
  onClose: () => void
  initialData: CarouselPhoto | null
  onCreate: (payload: Partial<CarouselPhoto>) => Promise<unknown>
  onUpdate: (id: string, payload: Partial<CarouselPhoto>) => Promise<unknown>
}

const emptyForm = { image_url: '', caption: '', event_or_context: '', position: '0', is_visible: true }

export function CarouselPhotoModal({ isOpen, onClose, initialData, onCreate, onUpdate }: CarouselPhotoModalProps) {
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen) return
    if (initialData) {
      setForm({
        image_url: initialData.image_url,
        caption: initialData.caption || '',
        event_or_context: initialData.event_or_context || '',
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
    if (!form.image_url.trim()) next.image_url = 'An image is required.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setSaving(true)
    setSubmitError(null)
    try {
      const payload: Partial<CarouselPhoto> = {
        image_url: form.image_url.trim(),
        caption: form.caption.trim() || null,
        event_or_context: form.event_or_context.trim() || null,
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
      title={initialData ? 'Edit carousel photo' : 'Add carousel photo'}
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
      <ImageUpload
        label="Photo"
        section="passion"
        currentImage={form.image_url || null}
        onUpload={(url) => setForm((f) => ({ ...f, image_url: url }))}
      />
      {errors.image_url && <div className="field-error" style={{ marginTop: -8, marginBottom: 12 }}>{errors.image_url}</div>}
      <FormInput
        label="Caption"
        name="caption"
        value={form.caption}
        onChange={(v) => setForm((f) => ({ ...f, caption: v }))}
      />
      <FormInput
        label="Event or context"
        name="event_or_context"
        value={form.event_or_context}
        onChange={(v) => setForm((f) => ({ ...f, event_or_context: v }))}
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
